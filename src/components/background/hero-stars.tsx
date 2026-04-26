/**
 * Hero cosmic scene — a soft nebula glow + scattered twinkling stars.
 * Positioned at z-6 (above Earth, below the copy/constellation at z-20)
 * so it adds atmosphere without blocking interactive elements.
 *
 * Star positions:
 *   - Loosely scattered across the entire hero, no grid rhythm
 *   - Avoid the header band (y < 12%)
 *   - Around — but not on — the Constellation menu's 4 interactive
 *     nodes at roughly (70,22), (85,32), (70,46), (85,57)
 */
type Star = {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
};

/**
 * Constellation menu nodes live at roughly (70,22), (85,32), (70,46),
 * (85,57). Every star here sits ≥12 units away from all four so the
 * twinkle never gets confused with — or crowds — the interactive menu.
 * Header band (y < 16) also excluded.
 */
const STARS: Star[] = [
  // Left half — above copy, loose irregular spacing
  { x: 4, y: 18, size: 3, opacity: 0.85, delay: 0.2, duration: 3.8 },
  { x: 11, y: 38, size: 2, opacity: 0.6, delay: 1.1, duration: 4.5 },
  { x: 17, y: 24, size: 4, opacity: 0.95, delay: 0.7, duration: 5.2 },
  { x: 23, y: 52, size: 2, opacity: 0.55, delay: 2.4, duration: 3.3 },
  { x: 30, y: 34, size: 3, opacity: 0.8, delay: 0, duration: 4.1 },
  { x: 38, y: 20, size: 2, opacity: 0.55, delay: 1.6, duration: 3.6 },
  { x: 9, y: 68, size: 4, opacity: 0.9, delay: 0.4, duration: 5.5 },
  { x: 27, y: 72, size: 2, opacity: 0.6, delay: 2, duration: 3.5 },
  { x: 40, y: 84, size: 2, opacity: 0.55, delay: 1.3, duration: 4.2 },

  // Middle
  { x: 44, y: 46, size: 3, opacity: 0.75, delay: 0.9, duration: 4.8 },
  { x: 50, y: 28, size: 2, opacity: 0.5, delay: 2.7, duration: 3.1 },
  { x: 55, y: 78, size: 3, opacity: 0.8, delay: 0.1, duration: 4.6 },
  { x: 36, y: 86, size: 2, opacity: 0.55, delay: 1.4, duration: 4.2 },
  { x: 48, y: 92, size: 2, opacity: 0.55, delay: 1.9, duration: 3.7 },

  // Constellation area — spaced ≥12 units from all 4 menu nodes
  { x: 58, y: 18, size: 2, opacity: 0.6, delay: 1.3, duration: 4.4 },
  { x: 85, y: 18, size: 3, opacity: 0.82, delay: 0.5, duration: 5 },
  { x: 92, y: 18, size: 2, opacity: 0.55, delay: 2.1, duration: 3.4 },
  { x: 97, y: 28, size: 3, opacity: 0.85, delay: 0.3, duration: 5.3 },
  { x: 58, y: 32, size: 2, opacity: 0.55, delay: 1.7, duration: 4 },
  { x: 58, y: 40, size: 2, opacity: 0.5, delay: 0.8, duration: 4.7 },
  { x: 97, y: 42, size: 3, opacity: 0.8, delay: 2.3, duration: 3.9 },
  { x: 58, y: 50, size: 3, opacity: 0.75, delay: 0.6, duration: 4.9 },
  { x: 97, y: 60, size: 2, opacity: 0.6, delay: 1.2, duration: 4.3 },
  { x: 73, y: 65, size: 2, opacity: 0.55, delay: 2.5, duration: 3.6 },
  { x: 67, y: 70, size: 3, opacity: 0.85, delay: 0.4, duration: 4.5 },
  { x: 78, y: 68, size: 3, opacity: 0.78, delay: 1.8, duration: 4.2 },

  // Below constellation
  { x: 64, y: 82, size: 3, opacity: 0.85, delay: 0.8, duration: 4.7 },
  { x: 74, y: 76, size: 2, opacity: 0.55, delay: 2.2, duration: 3.4 },
  { x: 82, y: 88, size: 4, opacity: 0.95, delay: 0.3, duration: 5.3 },
  { x: 90, y: 78, size: 2, opacity: 0.6, delay: 1.7, duration: 4 },
  { x: 95, y: 90, size: 3, opacity: 0.8, delay: 1, duration: 4.3 },
];

/**
 * Four stacked radial clouds form a soft, slow-drifting nebula biased
 * toward the upper right — around (not over) the constellation menu.
 * Dusty blue (signal-blue) + desaturated deep blue (gpto-blue) + warm
 * cyan (earth-cyan) + a low warm highlight. All at low alpha so the
 * Earth video reads through.
 */
const NEBULA = [
  "radial-gradient(ellipse 48% 38% at 78% 28%, rgba(127,163,212,0.22), transparent 65%)",
  "radial-gradient(ellipse 32% 32% at 88% 50%, rgba(95,125,174,0.16), transparent 70%)",
  "radial-gradient(ellipse 36% 28% at 62% 16%, rgba(157,197,217,0.12), transparent 70%)",
  "radial-gradient(ellipse 28% 22% at 30% 10%, rgba(248,239,214,0.08), transparent 75%)",
  "radial-gradient(ellipse 24% 24% at 14% 72%, rgba(127,163,212,0.1), transparent 72%)",
].join(", ");

export function HeroStars() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[6]">
      <div
        className="hero-nebula absolute inset-0"
        style={{ backgroundImage: NEBULA }}
      />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="hero-star absolute rounded-full motion-safe:animate-[hero-star-twinkle_var(--d)_ease-in-out_var(--delay)_infinite]"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              ["--base-opacity" as string]: s.opacity,
              ["--d" as string]: `${s.duration}s`,
              ["--delay" as string]: `${s.delay}s`,
              opacity: s.opacity,
              backgroundColor: "rgb(248, 239, 214)",
              boxShadow: `0 0 ${s.size * 2.5}px rgba(248, 239, 214, ${s.opacity * 0.55}), 0 0 ${s.size * 1.2}px rgba(255, 253, 240, ${s.opacity * 0.8})`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
