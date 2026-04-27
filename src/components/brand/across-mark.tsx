"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { MouseEvent } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type AcrossMarkProps = {
  className?: string;
  href?: string;
  label?: string;
  size?: "sm" | "md";
  showWordmark?: boolean;
};

/**
 * Across brand mark — Warm Cream in dark, Ink Black in light (DESIGN.md §3.1.1).
 * Single source asset (`logo_across_cream.png`, 589×758 tightly cropped) is
 * rendered cream in dark mode and forced black via `brightness(0)` in light
 * mode, so the mark sits at identical size and position across themes.
 * Clicking the mark while already on `href` scrolls smoothly to the top
 * instead of doing nothing (Next's Link short-circuits same-path nav).
 *
 * Height is responsive: mobile shrinks the mark a step so it doesn't crowd
 * the header band; aspect ratio is locked to the source 589×758 crop.
 */
const MARK_HEIGHT_CLASS = {
  sm: "h-4 sm:h-6",
  md: "h-5 sm:h-7",
} as const;

export function AcrossMark({
  className,
  href = "/",
  label,
  size = "md",
  showWordmark = true,
}: AcrossMarkProps) {
  const t = useTranslations("nav.brand");
  const pathname = usePathname();
  const ariaLabel = label ?? t("homeAria");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === href) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // When wrapped by [data-zoom-out], the parent gesture handler runs the
    // View Transition on pointerdown; suppress the Link's own navigation so
    // the two paths don't race and tear the zoom animation.
    if (event.currentTarget.closest("[data-zoom-out]")) {
      event.preventDefault();
    }
  };

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 text-text transition-opacity hover:opacity-90 focus-visible:opacity-100",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "across-mark block shrink-0 select-none aspect-[589/758] bg-white/85 light:bg-black/85",
          MARK_HEIGHT_CLASS[size]
        )}
      />
      {showWordmark ? (
        <span className="ml-1 hidden whitespace-nowrap text-[17px] font-medium tracking-[0.01em] sm:inline">
          Across Inc.
        </span>
      ) : null}
    </Link>
  );
}
