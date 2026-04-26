import Link from "next/link";
import { AcrossMark } from "@/components/brand/across-mark";
import { Minimap } from "@/components/nav/minimap";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type Props = {
  /** Secondary link (e.g., "← Contents") shown on article detail pages. */
  back?: { href: string; label: string };
};

/**
 * Header band for destination + article screens (DESIGN.md §7.3).
 * ✦ mark doubles as home-return (via `data-zoom-out`); the Minimap rides
 * inside the header so it stays clickable and sits inset from the edge.
 */
export function PageHeader({ back }: Props) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 py-4 pl-3 pr-6 sm:pl-5 sm:pr-10">
      {/* Soft wash that fades into the page so the bar reads as part of the
       * background. Single gradient without an extra mask — the gradient
       * itself carries the fade, which keeps the visual band tight around
       * the items so `items-center` looks truly centered. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-md"
        style={{
          background:
            "linear-gradient(to bottom, color-mix(in oklab, var(--color-bg) 82%, transparent) 0%, color-mix(in oklab, var(--color-bg) 40%, transparent) 85%, transparent 100%)",
        }}
      />
      <span data-zoom-out>
        <AcrossMark />
      </span>
      <div className="flex items-center gap-3 sm:gap-5">
        <Minimap />
        {back ? (
          <Link
            href={back.href}
            className="text-sm text-text-muted transition-colors hover:text-text"
          >
            {back.label}
          </Link>
        ) : null}
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
}
