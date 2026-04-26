"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useState } from "react";
import { ContentCard } from "@/components/contents/content-card";
import type { ContentsItem } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Props = {
  items: ContentsItem[];
};

const AUTO_ADVANCE_MS = 5200;

/**
 * Peek carousel — one focused center card flanked by two dim/blurred
 * neighbors. Auto-advances every ~5s (paused on hover/focus and suppressed
 * under `prefers-reduced-motion`). Side cards are clickable to jump focus.
 *
 * Layout math: cards absolutely positioned inside a relative frame; offset
 * from current index drives translateX + scale + blur. Items wrap, so the
 * loop feels endless without duplicating the list.
 */
export function HomeContentsCarousel({ items }: Props) {
  const t = useTranslations("home.contents");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const labelId = useId();
  const count = items.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((i) => (i + dir + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      AUTO_ADVANCE_MS
    );
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-labelledby={labelId}
    >
      <span id={labelId} className="sr-only">
        {t("sectionLabel")}
      </span>

      <div
        className="relative mx-auto h-[420px] w-full max-w-[380px] sm:h-[440px] sm:max-w-[420px] lg:h-[460px] lg:max-w-[460px]"
        role="group"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => {
          const raw = i - index;
          const half = Math.floor(count / 2);
          const rel = raw > half ? raw - count : raw < -half ? raw + count : raw;
          const abs = Math.abs(rel);
          const isCenter = rel === 0;
          const isPeek = abs === 1;

          const key =
            item.type === "blog"
              ? `blog-${item.slug}`
              : item.type === "news"
                ? `news-${item.id}`
                : `video-${item.id}`;

          const translate = rel * 40;
          const scale = isCenter ? 1 : isPeek ? 0.82 : 0.7;
          const opacity = isCenter ? 1 : isPeek ? 0.45 : 0;
          const blur = isCenter ? 0 : isPeek ? 6 : 10;
          const z = isCenter ? 20 : isPeek ? 10 : 0;

          return (
            <div
              key={key}
              aria-hidden={!isCenter}
              className={cn(
                "absolute inset-0 transition-[transform,opacity,filter] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                isPeek && "cursor-pointer",
                !isCenter && !isPeek && "pointer-events-none"
              )}
              style={{
                transform: isCenter
                  ? undefined
                  : `translateX(${translate}%) scale(${scale})`,
                opacity,
                filter: isCenter ? undefined : `blur(${blur}px)`,
                zIndex: z,
              }}
              onClick={() => {
                if (isPeek) setIndex(i);
              }}
            >
              <div className="h-full overflow-hidden rounded-2xl bg-bg">
                <ContentCard item={item} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          aria-label={t("prev")}
          onClick={() => go(-1)}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-subtle text-text-muted transition-colors hover:border-signal-blue hover:text-text"
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
        </button>
        <ul className="flex items-center gap-1.5" role="tablist">
          {items.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={t("goToSlide", { n: i + 1 })}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1.5 cursor-pointer rounded-full transition-all duration-300",
                  i === index
                    ? "w-6 bg-signal-blue"
                    : "w-1.5 bg-text-muted/40 hover:bg-text-muted/70"
                )}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          aria-label={t("next")}
          onClick={() => go(1)}
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border-subtle text-text-muted transition-colors hover:border-signal-blue hover:text-text"
        >
          <ChevronRight aria-hidden className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
