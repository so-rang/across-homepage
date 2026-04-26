import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PostForm } from "@/features/admin/components/post-form";
import type { PostRow } from "@/features/admin/types/post";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const post = data as PostRow;

  return (
    <section>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-medium tracking-tight">
          {post.title || "(제목 없음)"}
        </h1>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          /{post.slug}
        </p>
      </header>
      <PostForm mode="edit" post={post} />
    </section>
  );
}
