import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/brand/page-header";
import { getAllBlogSlugs, getAllContents, getBlogPost } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();
  const t = await getTranslations("article.post");

  const all = (await getAllContents()).filter((i) => i.type === "blog");
  const idx = all.findIndex(
    (i) => i.type === "blog" && i.slug === post.slug,
  );
  const prev = idx >= 0 ? all[idx + 1] : undefined;
  const next = idx > 0 ? all[idx - 1] : undefined;

  const html = generateHTML(post.content, [
    StarterKit,
    LinkExtension,
    ImageExtension,
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    image: post.coverImage,
  };

  return (
    <>
      <PageHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="mx-auto max-w-[760px] px-6 pb-24 pt-20 sm:px-10">
        <Link
          href="/contents"
          aria-label={t("back")}
          className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-muted transition-colors hover:border-border-strong hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
        <header className="mb-10 rounded-3xl border border-border-subtle bg-[rgba(6,6,11,0.55)] p-6 backdrop-blur-[8px] sm:p-8">
          {post.category ? (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
              {post.category}
            </p>
          ) : null}
          <h1 className="font-display text-[28px] font-light leading-[1.3] tracking-[0.01em] sm:text-[38px]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-3 text-[15px] leading-[1.6] text-text-muted">
              {post.excerpt}
            </p>
          ) : null}
          <p className="mt-4 font-mono text-sm text-text-muted">
            {post.date}
            {post.author ? ` · ${post.author}` : ""}
          </p>
        </header>

        <div className="rounded-3xl border border-border-subtle bg-[rgba(6,6,11,0.55)] p-8 backdrop-blur-[8px] sm:p-10">
          <div
            className="prose-across"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {(post.author || post.authorBio) ? (
          <footer className="mt-14 border-t border-border-subtle pt-10">
            <p className="text-lg font-medium tracking-[0.01em]">
              {post.author}
            </p>
            <p className="mt-1 text-sm text-text-muted">{post.authorBio}</p>

            <nav
              aria-label={t("prevNext")}
              className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {prev && prev.type === "blog" ? (
                <Link
                  href={`/contents/posts/${prev.slug}`}
                  className="rounded-2xl border border-border-subtle bg-bg-elev-1 p-5 transition-colors hover:border-border-strong"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                    ← {t("prev")}
                  </p>
                  <p className="mt-2 font-display text-[17px]">{prev.title}</p>
                </Link>
              ) : (
                <span />
              )}
              {next && next.type === "blog" ? (
                <Link
                  href={`/contents/posts/${next.slug}`}
                  className="rounded-2xl border border-border-subtle bg-bg-elev-1 p-5 text-right transition-colors hover:border-border-strong"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                    {t("next")} →
                  </p>
                  <p className="mt-2 font-display text-[17px]">{next.title}</p>
                </Link>
              ) : null}
            </nav>
          </footer>
        ) : null}
      </article>
    </>
  );
}
