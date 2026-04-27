/**
 * Layer 4 — minimal corner falloff.
 * Very low-opacity violet wash in corners, nothing more.
 */
export function BorderGlow() {
  return (
    <svg
      aria-hidden
      className="stage-layer z-30"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="across-corner-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(90, 70, 130, 0.06)" />
          <stop offset="100%" stopColor="rgba(90, 70, 130, 0)" />
        </radialGradient>
      </defs>
      <circle cx="140" cy="120" r="240" fill="url(#across-corner-glow)" />
      <circle cx="1300" cy="820" r="220" fill="url(#across-corner-glow)" opacity="0.7" />
    </svg>
  );
}
