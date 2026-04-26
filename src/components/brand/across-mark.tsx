"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
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
 * Single source asset (`across_logo_cream.png`, 589×758 tightly cropped) is
 * rendered cream in dark mode and forced black via `brightness(0)` in light
 * mode, so the mark sits at identical size and position across themes.
 * Clicking the mark while already on `href` scrolls smoothly to the top
 * instead of doing nothing (Next's Link short-circuits same-path nav).
 */
const ASPECT = 589 / 758;

export function AcrossMark({
  className,
  href = "/",
  label = "어크로스 홈",
  size = "md",
  showWordmark = true,
}: AcrossMarkProps) {
  const h = size === "sm" ? 28 : 34;
  const w = Math.round(h * ASPECT);
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === href) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link
      href={href}
      aria-label={label}
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-2 text-text transition-opacity hover:opacity-90 focus-visible:opacity-100",
        className
      )}
    >
      <Image
        src="/logo/across_logo_cream.png"
        alt=""
        aria-hidden
        width={w}
        height={h}
        priority
        className="block shrink-0 select-none brightness-0 dark:brightness-100"
        style={{ height: h, width: w }}
      />
      {showWordmark ? (
        <span className="ml-1 text-[17px] font-medium tracking-[0.01em]">
          Across Inc.
        </span>
      ) : null}
    </Link>
  );
}
