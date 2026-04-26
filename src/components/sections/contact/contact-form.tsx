"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ContactPayloadSchema,
  INQUIRY_LABEL,
  INQUIRY_TYPES,
  type ContactPayload,
  type InquiryType,
} from "@/lib/validation/contact";

type FormValues = {
  name: string;
  company: string;
  email: string;
  inquiryType: ContactPayload["inquiryType"] | "";
  message: string;
  privacyAgreed: boolean;
};

const DEFAULTS: FormValues = {
  name: "",
  company: "",
  email: "",
  inquiryType: "",
  message: "",
  privacyAgreed: false,
};

const FIELD_CLS =
  "h-9 rounded-[10px] border-border-subtle bg-bg-elev-1 px-3 text-[14px] transition-colors hover:border-border-strong focus-visible:border-signal-blue focus-visible:ring-signal-blue/30";

export function ContactForm() {
  const mountedAt = useRef<number>(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: DEFAULTS,
    mode: "onSubmit",
  });

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const inquiryType = watch("inquiryType");

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      company: values.company === "" ? null : values.company,
      email: values.email,
      inquiryType: values.inquiryType,
      message: values.message,
      privacyAgreed: values.privacyAgreed === true ? true : undefined,
      _hp: "",
      _ts: mountedAt.current,
    };
    const parsed = ContactPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && field in values) {
          setError(field as keyof FormValues, {
            type: "manual",
            message: issue.message,
          });
        }
      }
      toast.error("입력 내용을 확인해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (res.ok) {
        toast.success("접수되었습니다.");
        reset(DEFAULTS);
        mountedAt.current = Date.now();
      } else if (res.status === 429) {
        toast.error("잠시 후 다시 시도해 주세요.");
      } else {
        toast.error(
          "전송에 문제가 있습니다. ask@across.center로 직접 보내주세요."
        );
      }
    } catch {
      toast.error("전송에 문제가 있습니다. ask@across.center로 직접 보내주세요.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-border-subtle bg-[rgba(6,6,11,0.55)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-[10px] light:bg-white/85 light:shadow-[0_20px_60px_-24px_rgba(18,25,51,0.18)] sm:p-6"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="이름" error={errors.name?.message} required>
          <Input
            {...register("name", { required: "이름을 입력해 주세요" })}
            aria-invalid={errors.name ? "true" : undefined}
            autoComplete="name"
            className={FIELD_CLS}
          />
        </Field>
        <Field label="회사명" error={errors.company?.message}>
          <Input
            {...register("company")}
            autoComplete="organization"
            className={FIELD_CLS}
          />
        </Field>
      </div>

      <Field label="이메일" error={errors.email?.message} required>
        <Input
          type="email"
          {...register("email", { required: "이메일을 입력해 주세요" })}
          aria-invalid={errors.email ? "true" : undefined}
          autoComplete="email"
          inputMode="email"
          className={FIELD_CLS}
        />
      </Field>

      <Field label="문의 유형" error={errors.inquiryType?.message} required>
        <Select
          value={inquiryType === "" ? undefined : inquiryType}
          onValueChange={(v) =>
            setValue("inquiryType", v as ContactPayload["inquiryType"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            aria-invalid={errors.inquiryType ? "true" : undefined}
            className={cn(FIELD_CLS, "w-full data-[size=default]:h-9")}
          >
            <SelectValue placeholder="선택해 주세요">
              {(value: string) =>
                INQUIRY_LABEL[value as InquiryType] ?? "선택해 주세요"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {INQUIRY_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {INQUIRY_LABEL[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="메시지" error={errors.message?.message} required>
        <Textarea
          rows={3}
          {...register("message", { required: "메시지를 입력해 주세요" })}
          aria-invalid={errors.message ? "true" : undefined}
          className="min-h-[72px] resize-none rounded-[10px] border-border-subtle bg-bg-elev-1 px-3 py-2 text-[15px] leading-[1.55] transition-colors hover:border-border-strong focus-visible:border-signal-blue focus-visible:ring-signal-blue/30 md:text-sm"
        />
      </Field>

      <label className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-text">
        <Checkbox
          checked={watch("privacyAgreed")}
          onCheckedChange={(c) =>
            setValue("privacyAgreed", c === true, { shouldValidate: true })
          }
          aria-invalid={errors.privacyAgreed ? "true" : undefined}
          className="mt-0.5 size-[18px] rounded-[5px] border-border-strong bg-bg-elev-1 transition-colors hover:border-signal-blue/60 focus-visible:border-signal-blue focus-visible:ring-2 focus-visible:ring-signal-blue/40 data-checked:border-signal-blue data-checked:bg-signal-blue data-checked:text-bg"
        />
        <span>
          <a
            href="/privacy"
            className="underline decoration-border-strong underline-offset-2 transition-colors hover:text-text hover:decoration-signal-blue"
          >
            개인정보 수집·이용
          </a>
          에 동의합니다.
        </span>
      </label>
      {errors.privacyAgreed ? (
        <p className="-mt-2 text-[13px] text-[#ff7a7a]">
          {errors.privacyAgreed.message}
        </p>
      ) : null}

      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="sr-only"
        {...register("_hp" as never)}
      />

      <Button
        type="submit"
        disabled={submitting}
        className="group/submit mt-1 h-11 w-full rounded-[10px] bg-text text-[14px] font-medium tracking-[0.02em] text-bg shadow-[0_0_0_1px_rgba(127,163,212,0.0),0_0_24px_-10px_rgba(127,163,212,0.0)] transition-[box-shadow,background-color,transform] hover:bg-text/90 hover:shadow-[0_0_0_1px_rgba(18,25,51,0.2),0_10px_32px_-12px_rgba(18,25,51,0.35)] disabled:opacity-40"
      >
        <span className="inline-flex items-center gap-2">
          {submitting ? "전송 중…" : "문의 보내기"}
          {submitting ? null : (
            <span
              aria-hidden
              className="translate-x-0 transition-transform group-hover/submit:translate-x-0.5"
            >
              →
            </span>
          )}
        </span>
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        className={cn(
          "text-[12px] font-semibold uppercase tracking-[0.12em] text-text"
        )}
      >
        {label}
        {required ? (
          <span aria-hidden className="ml-1 text-signal-blue">
            ✦
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p role="alert" aria-live="polite" className="text-[13px] text-[#ff7a7a]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
