"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type SectionId = "about" | "services" | "contents" | "contact";

const STARS: readonly { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contents", label: "Contents" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Header minimap (DESIGN.md §7.3).
 * Single-page now: each star scrolls to the matching section on `/`.
 * Off-home it routes home with the hash; on-home a plain anchor scrolls.
 * Active state tracks the section currently in view via IntersectionObserver.
 */
export function Minimap() {
  const t = useTranslations("nav.minimap");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!isHome) return;
    const targets = STARS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <nav aria-label={t("label")} className="flex items-center gap-1 sm:gap-2">
      {STARS.map((s) => {
        const current = isHome && active === s.id;
        const className = cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm transition-colors sm:px-3",
          current
            ? "bg-bg-elev-2 text-text"
            : "text-text-muted hover:text-text focus-visible:text-text"
        );
        const inner = (
          <>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className={cn("h-2.5 w-2.5", current ? "scale-125" : "")}
            >
              <path
                d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
                fill="currentColor"
              />
            </svg>
            <span className="hidden sm:inline">{s.label}</span>
          </>
        );
        return isHome ? (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={t("goTo", { label: s.label })}
            aria-current={current ? "true" : undefined}
            className={className}
          >
            {inner}
          </a>
        ) : (
          <Link
            key={s.id}
            href={`/#${s.id}`}
            aria-label={t("goTo", { label: s.label })}
            className={className}
          >
            {inner}
          </Link>
        );
      })}
    </nav>
  );
}
