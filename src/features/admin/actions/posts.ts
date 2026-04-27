"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { JSONContent } from "@tiptap/react";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireStaffProfile } from "@/features/admin/utils/auth";
import type { PostStatus } from "@/features/admin/types/post";

const postSchema = z.object({
  title: z.string().min(1, "제목은 필수입니다").max(200),
  excerpt: z.string().max(500).optional().nullable(),
  status: z.enum(["draft", "private", "published"]),
  content: z.unknown().refine((v) => v && typeof v === "object", {
    message: "content가 비어 있습니다",
  }),
});

const SLUG_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function generateSlug(): string {
  let out = "";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += SLUG_ALPHABET[b % SLUG_ALPHABET.length];
  return out;
}

export type PostFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  created?: {
    slug: string;
    status: PostStatus;
  };
};

function mapSupabaseError(error: {
  code?: string;
  message: string;
}): PostFormState {
  if (error.code === "23505" && /slug/i.test(error.message)) {
    return {
      ok: false,
      error: "이미 같은 slug가 있어요. 다른 값으로 변경해주세요.",
      fieldErrors: { slug: "이미 사용 중인 slug" },
    };
  }
  return { ok: false, error: error.message };
}

function parseInput(formData: FormData) {
  const raw = {
    title: (formData.get("title") as string | null)?.trim() ?? "",
    excerpt: (formData.get("excerpt") as string | null) || null,
    status: (formData.get("status") as string | null) ?? "draft",
    content: JSON.parse((formData.get("content") as string | null) || "{}"),
  };
  return postSchema.safeParse(raw);
}

function firstImageInContent(node: JSONContent): string | null {
  if (!node || typeof node !== "object") return null;
  if (
    (node as { type?: string }).type === "image" &&
    typeof (node as { attrs?: { src?: unknown } }).attrs?.src === "string"
  ) {
    return (node as { attrs: { src: string } }).attrs.src;
  }
  const children = (node as { content?: JSONContent[] }).content;
  if (Array.isArray(children)) {
    for (const child of children) {
      const found = firstImageInContent(child);
      if (found) return found;
    }
  }
  return null;
}

const WORDS_PER_MINUTE = 280;

function extractText(node: JSONContent): string {
  if (!node || typeof node !== "object") return "";
  let text = "";
  if (typeof (node as { text?: unknown }).text === "string") {
    text += (node as { text: string }).text + " ";
  }
  const children = (node as { content?: JSONContent[] }).content;
  if (Array.isArray(children)) {
    for (const child of children) text += extractText(child);
  }
  return text;
}

function estimateReadTime(content: JSONContent): number {
  const text = extractText(content).trim();
  if (!text) return 1;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

export async function createPostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const profile = await requireStaffProfile();
  const parsed = parseInput(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "입력값을 확인해주세요", fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { status, ...rest } = parsed.data;
  const content = rest.content as JSONContent;
  const coverImage = firstImageInContent(content);

  let attemptError: { code?: string; message: string } | null = null;
  let createdId: string | null = null;
  let createdSlug: string | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = generateSlug();
    const { data, error } = await supabase
      .from("posts")
      .insert({
        ...rest,
        slug,
        status,
        cover_image: coverImage,
        cover_alt: rest.title,
        read_time: estimateReadTime(content),
        author_id: profile.id,
        author_name: profile.display_name,
        published_at:
          status === "published" || status === "private"
            ? new Date().toISOString()
            : null,
      })
      .select("id")
      .single();
    if (!error) {
      createdId = data.id;
      createdSlug = slug;
      break;
    }
    if (error.code === "23505") {
      attemptError = error;
      continue;
    }
    return mapSupabaseError(error);
  }
  if (!createdId || !createdSlug) {
    return mapSupabaseError(
      attemptError ?? { message: "slug 생성에 실패했어요. 다시 시도해주세요." },
    );
  }

  revalidatePath("/admin/posts");
  revalidatePath("/contents");
  if (status !== "draft") {
    revalidatePath(`/contents/posts/${createdSlug}`);
  }
  return { ok: true, created: { slug: createdSlug, status } };
}

export async function updatePostAction(
  id: string,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireStaffProfile();
  const parsed = parseInput(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { ok: false, error: "입력값을 확인해주세요", fieldErrors };
  }

  const supabase = await createSupabaseServerClient();
  const { status, ...rest } = parsed.data;
  const content = rest.content as JSONContent;
  const coverImage = firstImageInContent(content);

  const { data: existing } = await supabase
    .from("posts")
    .select("status, published_at, slug")
    .eq("id", id)
    .maybeSingle();

  const wasShared =
    existing?.status === "published" || existing?.status === "private";
  const willShare = status === "published" || status === "private";
  const newPublishedAt = willShare
    ? wasShared
      ? (existing?.published_at ?? new Date().toISOString())
      : new Date().toISOString()
    : null;

  const { error } = await supabase
    .from("posts")
    .update({
      ...rest,
      status,
      cover_image: coverImage,
      cover_alt: rest.title,
      read_time: estimateReadTime(content),
      published_at: newPublishedAt,
    })
    .eq("id", id);

  if (error) return mapSupabaseError(error);

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePath("/contents");
  if (existing?.slug) revalidatePath(`/contents/posts/${existing.slug}`);
  return { ok: true };
}

export async function deletePostAction(id: string): Promise<void> {
  await requireStaffProfile();
  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();
  const { data: deleted, error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .select("id");
  if (error) throw new Error(error.message);
  if (!deleted || deleted.length === 0) {
    throw new Error("삭제 권한이 없거나 글을 찾을 수 없어요.");
  }
  revalidatePath("/admin/posts");
  revalidatePath("/contents");
  if (row?.slug) revalidatePath(`/contents/posts/${row.slug}`);
  redirect("/admin/posts");
}

export async function deletePostsAction(ids: string[]): Promise<void> {
  await requireStaffProfile();
  if (ids.length === 0) return;
  const supabase = await createSupabaseServerClient();
  const { data: rows } = await supabase
    .from("posts")
    .select("slug")
    .in("id", ids);
  const { data: deleted, error } = await supabase
    .from("posts")
    .delete()
    .in("id", ids)
    .select("id");
  if (error) throw new Error(error.message);
  const deletedCount = deleted?.length ?? 0;
  if (deletedCount === 0) {
    throw new Error("삭제 권한이 없거나 글을 찾을 수 없어요.");
  }
  if (deletedCount < ids.length) {
    throw new Error(
      `${ids.length}개 중 ${deletedCount}개만 삭제됐어요. 권한을 확인해주세요.`,
    );
  }
  revalidatePath("/admin/posts");
  revalidatePath("/contents");
  for (const row of (rows ?? []) as { slug: string | null }[]) {
    if (row.slug) revalidatePath(`/contents/posts/${row.slug}`);
  }
}
