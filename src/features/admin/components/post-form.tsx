"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { toast } from "sonner";
import { FileEdit, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PostEditor } from "@/features/admin/components/post-editor";
import {
  createPostAction,
  deletePostAction,
  updatePostAction,
  type PostFormState,
} from "@/features/admin/actions/posts";
import type { PostRow, PostStatus } from "@/features/admin/types/post";

const initialState: PostFormState = { ok: false };

type StatusMeta = { label: string; hint: string; Icon: typeof FileEdit };

const STATUS_META: Record<PostStatus, StatusMeta> = {
  draft: {
    label: "임시저장",
    hint: "본인만 볼 수 있어요",
    Icon: FileEdit,
  },
  private: {
    label: "비공개",
    hint: "URL을 아는 사람만 접근 가능",
    Icon: Lock,
  },
  published: {
    label: "공개",
    hint: "콘텐츠 목록과 URL 모두에서 노출",
    Icon: Globe,
  },
};

const STATUS_ORDER: PostStatus[] = ["draft", "private", "published"];

type Props =
  | { mode: "create"; post?: undefined }
  | { mode: "edit"; post: PostRow };

export function PostForm(props: Props) {
  const isEdit = props.mode === "edit";
  const router = useRouter();

  const action = isEdit
    ? updatePostAction.bind(null, props.post.id)
    : createPostAction;

  const [state, formAction, pending] = useActionState(action, initialState);
  const [content, setContent] = useState<JSONContent>(
    isEdit ? props.post.content : { type: "doc", content: [{ type: "paragraph" }] },
  );
  const [status, setStatus] = useState<PostStatus>(
    isEdit ? props.post.status : "draft",
  );
  const [deleting, startDelete] = useTransition();

  useEffect(() => {
    if (state.ok && isEdit) {
      toast.success("저장됨");
      return;
    }
    if (state.created) {
      const { slug, status: createdStatus } = state.created;
      if (createdStatus === "draft") {
        toast.success("임시저장 완료");
      } else {
        const origin =
          typeof window !== "undefined" ? window.location.origin : "";
        const url = `${origin}/contents/posts/${slug}`;
        toast.success(
          createdStatus === "published" ? "공개 발행 완료" : "비공개 등록 완료",
          {
            description: url,
            duration: 8000,
            action: {
              label: "열기",
              onClick: () => window.open(url, "_blank"),
            },
          },
        );
      }
      router.push("/admin/posts");
    }
  }, [state, isEdit, router]);

  const fieldErrors = state.fieldErrors ?? {};

  const currentStatus = STATUS_META[status];
  const StatusIcon = currentStatus.Icon;

  return (
    <form action={formAction} className="mx-auto max-w-3xl space-y-8 pb-24">
      <div>
        <div className="flex items-baseline gap-4 border-b border-border pb-3">
          <span
            aria-hidden
            className="shrink-0 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            제목
          </span>
          <input
            name="title"
            required
            defaultValue={isEdit ? props.post.title : ""}
            placeholder="제목을 입력하세요"
            className="w-full flex-1 bg-transparent text-4xl font-semibold leading-tight tracking-tight outline-none placeholder:text-muted-foreground sm:text-5xl"
          />
        </div>
        {fieldErrors.title ? (
          <p className="mt-1 text-sm text-destructive">{fieldErrors.title}</p>
        ) : null}
      </div>

      <div className="space-y-5 rounded-lg border border-border bg-card/40 px-4 py-5">
        <Field label="상태" htmlFor="status">
          <StatusChips value={status} onChange={setStatus} />
          <input type="hidden" name="status" value={status} />
          <p className="mt-2 text-xs text-muted-foreground">
            {currentStatus.hint}
          </p>
        </Field>

        <Field label="요약" htmlFor="excerpt" error={fieldErrors.excerpt}>
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={isEdit ? (props.post.excerpt ?? "") : ""}
            placeholder="목록·SNS 공유 시 노출되는 짧은 설명"
          />
        </Field>
      </div>

      <div>
        <PostEditor initialContent={content} onChange={setContent} />
        <input type="hidden" name="content" value={JSON.stringify(content)} />
        {fieldErrors.content ? (
          <p className="mt-1 text-sm text-destructive">{fieldErrors.content}</p>
        ) : null}
      </div>

      {state.error ? (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <StatusIcon className="h-3.5 w-3.5" aria-hidden />
          저장 시: <strong className="text-foreground">{currentStatus.label}</strong>
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {isEdit ? (
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={deleting}
              onClick={() => {
                if (!confirm("정말 삭제할까요? 되돌릴 수 없습니다.")) return;
                startDelete(async () => {
                  try {
                    await deletePostAction(props.post.id);
                  } catch (e) {
                    toast.error((e as Error).message);
                  }
                });
              }}
            >
              {deleting ? "삭제 중…" : "삭제"}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/admin/posts")}
          >
            취소
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "저장 중…" : "저장"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function StatusChips({
  value,
  onChange,
}: {
  value: PostStatus;
  onChange: (v: PostStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_ORDER.map((option) => {
        const meta = STATUS_META[option];
        const Icon = meta.Icon;
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor} className="mb-1.5 block text-sm">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}
