import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type SectionId = "about" | "services" | "contents" | "contact";

type Star = {
  readonly id: SectionId;
  readonly label: string;
  readonly pos: string;
  readonly xPct: number;
  readonly yPct: number;
};

const STARS: readonly Star[] = [
  {
    id: "about",
    label: "About",
    pos: "sm:left-[28%] sm:top-[14%]",
    xPct: 28,
    yPct: 14,
  },
  {
    id: "services",
    label: "Services",
    pos: "sm:left-[72%] sm:top-[34%]",
    xPct: 72,
    yPct: 34,
  },
  {
    id: "contents",
    label: "Contents",
    pos: "sm:left-[30%] sm:top-[62%]",
    xPct: 30,
    yPct: 62,
  },
  {
    id: "contact",
    label: "Contact",
    pos: "sm:left-[74%] sm:top-[84%]",
    xPct: 74,
    yPct: 84,
  },
] as const;

const STAR_GAP = 12;

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
  const t = useTranslations("nav.constellation");
  return (
    <nav aria-label={t("label")} className="relative h-full w-full">
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
      >
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
            key={star.id}
            data-intro-item={`star-${idx + 1}`}
            className={cn(
              "sm:absolute sm:-translate-x-1/2 sm:-translate-y-1/2",
              star.pos
            )}
          >
            <a
              href={`#${star.id}`}
              aria-label={t("goTo", { label: star.label })}
              className="group inline-flex min-h-11 flex-col items-center gap-2.5 rounded-full px-3 py-1.5 sm:gap-3"
            >
              <svg
                aria-hidden
                viewBox="0 0 20 20"
                className="constellation-star h-6 w-6 text-star-warm transition-transform duration-[var(--d-base)] ease-[var(--ease-snap)] group-hover:scale-[1.3] group-focus-visible:scale-[1.3]"
              >
                <path
                  d="M 10 1 L 11.2 8.8 L 19 10 L 11.2 11.2 L 10 19 L 8.8 11.2 L 1 10 L 8.8 8.8 Z"
                  fill="currentColor"
                />
                <circle cx="10" cy="10" r="1.6" fill="rgba(255, 254, 245, 1)" />
              </svg>
              <span className="text-[16px] font-medium tracking-[0.01em] text-text transition-[color,transform] duration-[var(--d-base)] ease-[var(--ease-soft)] group-hover:-translate-y-0.5 group-hover:text-star-warm group-focus-visible:-translate-y-0.5 group-focus-visible:text-star-warm">
                {star.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
