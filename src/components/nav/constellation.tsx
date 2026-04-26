import Link from "next/link";
import { cn } from "@/lib/utils";

type Star = {
  readonly href: "/about" | "/services" | "/contents" | "/contact";
  readonly label: string;
  readonly aria: string;
  readonly pos: string;
  readonly xPct: number;
  readonly yPct: number;
};

const STARS: readonly Star[] = [
  {
    href: "/about",
    label: "About",
    aria: "About 섹션으로 이동",
    pos: "sm:left-[28%] sm:top-[14%]",
    xPct: 28,
    yPct: 14,
  },
  {
    href: "/services",
    label: "Services",
    aria: "Services 섹션으로 이동",
    pos: "sm:left-[72%] sm:top-[34%]",
    xPct: 72,
    yPct: 34,
  },
  {
    href: "/contents",
    label: "Contents",
    aria: "Contents 섹션으로 이동",
    pos: "sm:left-[30%] sm:top-[62%]",
    xPct: 30,
    yPct: 62,
  },
  {
    href: "/contact",
    label: "Contact",
    aria: "Contact 섹션으로 이동",
    pos: "sm:left-[74%] sm:top-[84%]",
    xPct: 74,
    yPct: 84,
  },
] as const;

/**
 * Primary site navigation as a four-star constellation (DESIGN.md §7.1).
 * Lines connect consecutive stars with a gap around each star — the line
 * starts a few units out from one star and ends a few units before the next,
 * like a real constellation map. Only rendered on ≥sm.
 */
const STAR_GAP = 12; // viewBox units — keeps the line clear of the star + its label below

type Segment = { x1: number; y1: number; x2: number; y2: number };

const SEGMENTS: readonly Segment[] = STARS.slice(0, -1).map((from, i) => {
  const to = STARS[i + 1]!;
  const dx = to.xPct - from.xPct;
  const dy = to.yPct - from.yPct;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: from.xPct + ux * STAR_GAP,
    y1: from.yPct + uy * STAR_GAP,
    x2: to.xPct - ux * STAR_GAP,
    y2: to.yPct - uy * STAR_GAP,
  };
});

export function Constellation() {
  return (
    <nav aria-label="메뉴" className="relative h-full w-full">
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
      >
        {/* Sequential zigzag: About → Services → Contents → Contact.
            Each segment floats between two stars with a gap at both ends,
            leaving room for the label below each star. The intro timeline
            fades each line in after the preceding star appears. */}
        {SEGMENTS.map((seg, i) => (
          <line
            key={i}
            data-intro-item={`line-${i + 1}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke="rgba(248, 239, 214, 0.55)"
            strokeWidth="1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <ul className="grid h-full grid-cols-2 grid-rows-2 place-items-center gap-4 sm:block">
        {STARS.map((star, idx) => (
          <li
            key={star.href}
            data-intro-item={`star-${idx + 1}`}
            className={cn(
              "sm:absolute sm:-translate-x-1/2 sm:-translate-y-1/2",
              star.pos
            )}
          >
            <Link
              href={star.href}
              aria-label={star.aria}
              className="group inline-flex min-h-11 flex-col items-center gap-2.5 rounded-full px-3 py-1.5 sm:gap-3"
            >
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="constellation-star h-6 w-6 text-star-warm transition-transform duration-[var(--d-base)] ease-[var(--ease-snap)] group-hover:scale-[1.3] group-focus-visible:scale-[1.3]"
              >
                {/* 4-point star + bright pinpoint core. The halo glow is
                    handled by a chase animation in globals.css (each of
                    the 4 stars takes its turn shining). */}
                <path
                  d="M 10 1 L 11.2 8.8 L 19 10 L 11.2 11.2 L 10 19 L 8.8 11.2 L 1 10 L 8.8 8.8 Z"
                  fill="currentColor"
                />
                <circle cx="10" cy="10" r="1.6" fill="rgba(255, 254, 245, 1)" />
              </svg>
              <span className="text-[16px] font-medium tracking-[0.01em] text-text transition-[color,transform] duration-[var(--d-base)] ease-[var(--ease-soft)] group-hover:-translate-y-0.5 group-hover:text-star-warm group-focus-visible:-translate-y-0.5 group-focus-visible:text-star-warm">
                {star.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
