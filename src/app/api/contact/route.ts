import { NextRequest, NextResponse } from "next/server";
import { getResendClient } from "@/lib/mail/resend-client";
import { rateLimit } from "@/lib/mail/rate-limit";
import {
  ContactPayloadSchema,
  INQUIRY_LABEL,
} from "@/lib/validation/contact";

const MIN_FORM_FILL_MS = 5000;
const RATE_MAX = 5;
const RATE_WINDOW_MS = 60_000;

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`contact:${ip}`, RATE_MAX, RATE_WINDOW_MS);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "VALIDATION_FAILED", fields: {} },
      { status: 400 }
    );
  }

  const parsed = ContactPayloadSchema.safeParse(json);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!fields[key]) fields[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: "VALIDATION_FAILED", fields },
      { status: 400 }
    );
  }

  const payload = parsed.data;

  if (payload._hp !== "" || Date.now() - payload._ts < MIN_FORM_FILL_MS) {
    return NextResponse.json(
      { ok: false, error: "BOT_SUSPECTED" },
      { status: 400 }
    );
  }

  const resend = getResendClient();
  const to = process.env.CONTACT_TO ?? "ask@across.center";
  const from = process.env.RESEND_FROM ?? "어크로스 <no-reply@across.send>";

  if (!resend) {
    console.warn(
      "[contact] RESEND_API_KEY missing — logging payload and returning 200",
      payload
    );
    return NextResponse.json({ ok: true, relayed: false });
  }

  try {
    const body = [
      `이름: ${payload.name}`,
      `회사: ${payload.company ?? "-"}`,
      `이메일: ${payload.email}`,
      `문의 유형: ${INQUIRY_LABEL[payload.inquiryType]} (${payload.inquiryType})`,
      `IP: ${ip}`,
      `UA: ${req.headers.get("user-agent") ?? "-"}`,
      "",
      payload.message,
    ].join("\n");

    await resend.emails.send({
      from,
      to: [to],
      replyTo: payload.email,
      subject: `[문의] ${INQUIRY_LABEL[payload.inquiryType]} — ${payload.name}`,
      text: body,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Resend send failed", err);
    return NextResponse.json(
      { ok: false, error: "MAIL_SEND_FAILED" },
      { status: 500 }
    );
  }
}
