import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { PageHeader } from "@/components/brand/page-header";
import { getAllBlogSlugs, getAllContents, getBlogPost } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const all = getAllContents().filter((i) => i.type === "blog");
  const idx = all.findIndex(
    (i) => i.type === "blog" && i.slug === post.slug
  );
  const prev = idx >= 0 ? all[idx + 1] : undefined;
  const next = idx > 0 ? all[idx - 1] : undefined;

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
      <PageHeader back={{ href: "/contents", label: "← Contents" }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="mx-auto max-w-[760px] px-6 pb-24 pt-20 sm:px-10">
        <header className="mb-10 rounded-3xl border border-border-subtle bg-[rgba(6,6,11,0.55)] p-8 backdrop-blur-[8px] sm:p-10">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-text-muted">
            {post.category}
          </p>
          <h1 className="font-display text-[32px] font-light leading-[1.35] tracking-[0.01em] sm:text-[44px]">
            {post.title}
          </h1>
          <p className="mt-4 text-[16px] leading-[1.65] text-text-muted">
            {post.excerpt}
          </p>
          <p className="mt-6 font-mono text-sm text-text-muted">
            {post.date} · {post.author} · {post.readTime} min read
          </p>
        </header>

        <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl">
          <Image
            src={post.coverImage}
            alt={post.coverAlt}
            fill
            sizes="(max-width: 768px) 100vw, 760px"
            priority
            className="object-cover"
          />
        </div>

        <div className="rounded-3xl border border-border-subtle bg-[rgba(6,6,11,0.55)] p-8 backdrop-blur-[8px] sm:p-10">
          <div className="prose-across">
            <MDXRemote
              source={post.body}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
        </div>

        <footer className="mt-14 border-t border-border-subtle pt-10">
          <p className="text-lg font-medium tracking-[0.01em]">{post.author}</p>
          <p className="mt-1 text-sm text-text-muted">{post.authorBio}</p>

          <nav
            aria-label="이전·다음 글"
            className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {prev && prev.type === "blog" ? (
              <Link
                href={`/contents/posts/${prev.slug}`}
                className="rounded-2xl border border-border-subtle bg-bg-elev-1 p-5 transition-colors hover:border-border-strong"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                  ← 이전 글
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
                  다음 글 →
                </p>
                <p className="mt-2 font-display text-[17px]">{next.title}</p>
              </Link>
            ) : null}
          </nav>
        </footer>
      </article>
    </>
  );
}
