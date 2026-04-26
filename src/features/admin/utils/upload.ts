import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "post-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export type UploadResult = { url: string; path: string };

export async function uploadPostImage(file: File): Promise<UploadResult> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("PNG·JPG·WEBP·GIF·SVG 형식만 업로드할 수 있어요.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("파일 크기는 5MB 이하여야 해요.");
  }

  const supabase = createSupabaseBrowserClient();
  const ext = inferExtension(file);
  const path = buildObjectPath(ext);

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

function inferExtension(file: File): string {
  const fromName = file.name.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  if (fromName) return fromName;
  const fromType = file.type.split("/")[1]?.toLowerCase();
  if (fromType === "svg+xml") return "svg";
  return fromType ?? "bin";
}

function buildObjectPath(ext: string): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const rand = crypto.randomUUID();
  return `${yyyy}/${mm}/${rand}.${ext}`;
}
