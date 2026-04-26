import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  PostsView,
  type AdminPostListItem,
} from "@/features/admin/components/posts-view";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select(
      "id, slug, title, status, cover_image, published_at, updated_at",
    )
    .order("updated_at", { ascending: false });

  const posts = (data ?? []) as AdminPostListItem[];

  return (
    <section>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium tracking-tight">
            Posts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            블로그 게시물 관리
          </p>
        </div>
        <Link href="/admin/posts/new" className={cn(buttonVariants())}>
          새 글 작성
        </Link>
      </header>

      {error ? (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error.message}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            아직 게시물이 없습니다.
          </p>
          <Link href="/admin/posts/new" className={cn(buttonVariants(), "mt-4")}>
            첫 글 작성하기
          </Link>
        </div>
      ) : (
        <PostsView posts={posts} />
      )}
    </section>
  );
}
