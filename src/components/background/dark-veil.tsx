import type { LayerProps } from "./types";

/**
 * Layer 2 — Dark Veil.
 * Soft nebular depth. Muted violet/rose tints instead of vivid blue.
 */
export function DarkVeil({ quality }: LayerProps) {
  const opacity = quality === "low" ? 0.75 : 1;

  return (
    <div
      aria-hidden
      className="stage-layer z-10"
      style={{
        opacity,
        background: `
          radial-gradient(1100px 800px at 28% 18%, rgba(100, 75, 160, 0.09), transparent 60%),
          radial-gradient(900px 700px at 82% 72%, rgba(150, 100, 110, 0.07), transparent 55%),
          radial-gradient(1600px 1200px at 50% 50%, rgba(255, 255, 255, 0.018), transparent 70%),
          radial-gradient(700px 500px at 12% 92%, rgba(70, 60, 110, 0.08), transparent 55%)
        `,
      }}
    />
  );
}
