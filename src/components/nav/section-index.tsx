"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Section = { readonly id: string; readonly label: string };

type Props = {
  sections: readonly Section[];
};

/**
 * Vertical section index for About / Services (DESIGN.md §7.4).
 * ≥lg: left-pinned ✦ rail with IntersectionObserver highlight.
 * <lg: top horizontal scroll tabs.
 */
export function SectionIndex({ sections }: Props) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = visible[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0.1, 0.3, 0.6] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <>
      <nav
        aria-label="섹션 인덱스"
        className="sticky top-20 z-20 hidden h-fit lg:block"
      >
        <ul className="space-y-6">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "group flex items-center gap-3 text-sm transition-colors",
                  active === s.id ? "text-text" : "text-text-muted hover:text-text"
                )}
              >
                <svg
                  aria-hidden
                  viewBox="0 0 16 16"
                  className={cn(
                    "h-2.5 w-2.5 transition-transform",
                    active === s.id ? "scale-125" : ""
                  )}
                >
                  <path
                    d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <nav
        aria-label="섹션 인덱스"
        className="sticky top-0 z-20 -mx-6 flex gap-2 overflow-x-auto bg-bg/70 px-6 py-3 backdrop-blur-[8px] [scroll-snap-type:x_mandatory] lg:hidden"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "true" : undefined}
            className={cn(
              "shrink-0 snap-start rounded-full border px-4 py-2 text-sm",
              active === s.id
                ? "border-border-strong bg-bg-elev-2 text-text"
                : "border-border-subtle bg-bg-elev-1 text-text-muted"
            )}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </>
  );
}
