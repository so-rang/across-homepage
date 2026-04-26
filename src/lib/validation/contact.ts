import { z } from "zod";

export const INQUIRY_TYPES = [
  "product",
  "partnership",
  "press",
  "careers",
  "other",
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_LABEL: Record<InquiryType, string> = {
  product: "제품 도입 문의",
  partnership: "파트너십",
  press: "미디어·보도 문의",
  careers: "채용 문의",
  other: "기타",
};

export const ContactPayloadSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해 주세요").max(60),
  company: z
    .string()
    .trim()
    .max(120)
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  email: z.string().trim().email("올바른 이메일 주소를 입력해 주세요"),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z
    .string()
    .trim()
    .min(20, "최소 20자 이상 입력해 주세요")
    .max(4000),
  privacyAgreed: z.literal(true, {
    message: "개인정보 수집·이용에 동의해 주세요",
  }),
  _hp: z.string().max(0),
  _ts: z.number().int().positive(),
});

export type ContactPayload = z.infer<typeof ContactPayloadSchema>;
