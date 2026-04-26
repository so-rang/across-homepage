"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const STARS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contents", label: "Contents" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Destination-screen nav (plan T30 / DESIGN.md §7.3).
 * Rendered inside PageHeader so it inherits the header's stacking context
 * and stays clickable. Star icon + label on sm+, icon-only on mobile.
 */
export function Minimap() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="미니맵"
      className="flex items-center gap-1 sm:gap-2"
    >
      {STARS.map((s) => {
        const current =
          pathname === s.href || pathname.startsWith(`${s.href}/`);
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-label={`${s.label}로 이동`}
            aria-current={current ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm transition-colors sm:px-3",
              current
                ? "bg-bg-elev-2 text-text"
                : "text-text-muted hover:text-text focus-visible:text-text"
            )}
          >
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
          </Link>
        );
      })}
    </nav>
  );
}
