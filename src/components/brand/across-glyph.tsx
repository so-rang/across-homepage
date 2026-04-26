import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Whether the ✦ breathes with a warm glow. Off for tiny chrome uses. */
  animated?: boolean;
  title?: string;
};

/**
 * Across brand glyph — thin A + 4-point ✦ piercing the right leg.
 * Proportions measured directly from the source JPEG (pixel-for-pixel):
 * - A peak  (486/1024, 153/1024) ≈ (47.5, 14.9)
 * - A feet  (245, 885) / (775, 885) ≈ (23.9, 86.4) / (75.7, 86.4)
 * - ✦ cross center (640, 555) ≈ (62.5, 54.2)
 * - ✦ tips top/bottom/left/right measured at (62.5, 31.3), (61.3, 84.0),
 *   (47.4, 54.2), (80.1, 54.2)
 *
 * Both A legs are filled lozenges (sharp point at apex + sharp point at
 * base) — matches the raw logo's calligraphic tapered ends. Leg mid-
 * thickness is 2.4 viewBox units so even at 40–48px render sizes the
 * stroke is ≥ 1 device pixel (no sub-pixel blur).
 */
export function AcrossGlyph({ className, animated = true, title }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={cn("block", className)}
    >
      {title ? <title>{title}</title> : null}
      {/* A — left leg: apex → widened mid → tapered base tip → mid (back) */}
      <path d="M 47.5 14.9 L 36.84 51.03 L 23.9 86.4 L 34.56 50.27 Z" />
      {/* A — right leg */}
      <path d="M 47.5 14.9 L 62.72 50.21 L 75.7 86.4 L 60.48 51.09 Z" />
      <g className={animated ? "across-glyph-sparkle" : undefined}>
        <path d="M 62.5 31.3 L 63.4 54.2 L 61.3 84.0 L 61.6 54.2 Z" />
        <path d="M 47.4 54.2 L 62.5 53.5 L 80.1 54.2 L 62.5 54.9 Z" />
      </g>
    </svg>
  );
}
