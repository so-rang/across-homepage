"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { NewsThumbnail } from "@/components/contents/news-thumbnail";
import { VideoModal } from "@/components/contents/video-modal";
import type { ContentsItem } from "@/lib/content/types";
import { youtubeThumbnail } from "@/lib/content/youtube";

function CardFrame({
  children,
  thumbnail,
  badge,
  source,
  title,
  excerpt,
  date,
}: {
  children?: React.ReactNode;
  thumbnail: React.ReactNode;
  badge: string;
  source: string;
  title: string;
  excerpt: string;
  date: string;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-elev-1 transition-colors hover:border-border-strong">
      {thumbnail}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-text-muted">
          <span className="rounded-full border border-border-subtle px-2 py-0.5">
            {badge}
          </span>
          <span className="truncate">{source}</span>
        </div>
        <h3 className="line-clamp-2 text-[18px] font-medium leading-[1.4] tracking-[0.01em]">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.55] text-text-muted">
          {excerpt}
        </p>
        <p className="mt-auto pt-4 font-mono text-[12px] text-text-muted">{date}</p>
        {children}
      </div>
    </article>
  );
}

export function ContentCard({ item }: { item: ContentsItem }) {
  const t = useTranslations("contents.badge");
  if (item.type === "blog") {
    return (
      <Link
        href={`/contents/posts/${item.slug}`}
        className="block h-full focus-visible:outline-none"
      >
        <CardFrame
          thumbnail={
            <div className="relative aspect-video">
              <Image
                src={item.coverImage}
                alt={item.coverAlt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
                className="object-cover"
              />
            </div>
          }
          badge={t("blog")}
          source={item.author}
          title={item.title}
          excerpt={item.excerpt}
          date={item.date}
        />
      </Link>
    );
  }

  if (item.type === "news") {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full focus-visible:outline-none"
      >
        <CardFrame
          thumbnail={
            <NewsThumbnail
              src={item.thumbnail}
              alt={item.title}
              aspect={item.thumbnailAspect}
              fallback={{ sourceName: item.sourceName, date: item.date }}
            />
          }
          badge={t("news")}
          source={item.sourceName}
          title={item.title}
          excerpt={item.excerpt}
          date={item.date}
        />
      </a>
    );
  }

  const thumb = item.thumbnail ?? youtubeThumbnail(item.youtubeId);
  return (
    <VideoModal video={item} triggerClassName="group">
      <CardFrame
        thumbnail={
          <div className="relative aspect-video bg-bg-elev-2">
            <Image
              src={thumb}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 500px"
              className="object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/30"
            >
              {/* YouTube mark — rounded red plate + white play triangle.
               * Slight drop-shadow so it reads over bright or busy thumbs. */}
              <svg
                viewBox="0 0 68 48"
                className="h-8 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] transition-transform group-hover:scale-110"
              >
                <path
                  d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26Z"
                  fill="#FF0000"
                />
                <path d="M27 34V14l18 10Z" fill="#FFFFFF" />
              </svg>
            </span>
          </div>
        }
        badge={t("video")}
        source={item.channelName}
        title={item.title}
        excerpt={item.excerpt}
        date={item.date}
      />
    </VideoModal>
  );
}
