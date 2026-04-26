import { PostForm } from "@/features/admin/components/post-form";

export const metadata = { title: "새 글 작성" };

export default function NewPostPage() {
  return (
    <section>
      <header className="mb-8">
        <h1 className="font-display text-2xl font-medium tracking-tight">
          새 글 작성
        </h1>
      </header>
      <PostForm mode="create" />
    </section>
  );
}
