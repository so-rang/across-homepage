/**
 * Dawn Sky — atmospheric cloud + glow field for light mode.
 *
 * Mirrors the cosmic Stage's role in dark mode: fills the page with slow,
 * breathing depth so the UI does not float on flat color. Five soft blurred
 * blobs drift at different paces for parallax, plus a horizon shimmer at
 * the bottom. All elements are pure CSS — no JS, no canvas — and hidden in
 * dark mode via globals.css so the component is free to mount unconditionally.
 *
 * Respects `prefers-reduced-motion` (animations suppressed in globals.css).
 */
export function DawnSky() {
  return (
    <div
      aria-hidden
      data-dawn-sky
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Top-left warm peach cloud — largest, drifts rightward. */}
      <div
        className="dawn-cloud dawn-cloud-1 absolute rounded-[50%]"
        style={{
          top: "-12%",
          left: "-18%",
          width: "74vw",
          height: "64vh",
          background:
            "radial-gradient(closest-side, rgba(255, 188, 140, 0.95), rgba(255, 188, 140, 0.45) 42%, rgba(255, 188, 140, 0) 78%)",
          filter: "blur(22px)",
        }}
      />
      {/* Upper-right bright white cloud — sharper core, medium drift. */}
      <div
        className="dawn-cloud dawn-cloud-2 absolute rounded-[50%]"
        style={{
          top: "-6%",
          right: "-16%",
          width: "62vw",
          height: "54vh",
          background:
            "radial-gradient(closest-side, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.45) 45%, rgba(255, 255, 255, 0) 80%)",
          filter: "blur(26px)",
        }}
      />
      {/* Mid-left cool blue streak — crosses slowly, prominent. */}
      <div
        className="dawn-cloud dawn-cloud-3 absolute rounded-[50%]"
        style={{
          top: "36%",
          left: "-28%",
          width: "84vw",
          height: "34vh",
          background:
            "radial-gradient(closest-side, rgba(155, 195, 255, 0.85), rgba(155, 195, 255, 0.35) 44%, rgba(155, 195, 255, 0) 78%)",
          filter: "blur(24px)",
        }}
      />
      {/* Mid-right lavender cloud — newly added for density. */}
      <div
        className="dawn-cloud dawn-cloud-5 absolute rounded-[50%]"
        style={{
          top: "50%",
          right: "-20%",
          width: "66vw",
          height: "40vh",
          background:
            "radial-gradient(closest-side, rgba(220, 200, 255, 0.72), rgba(220, 200, 255, 0.3) 46%, rgba(220, 200, 255, 0) 78%)",
          filter: "blur(22px)",
        }}
      />
      {/* Bottom warm horizon glow — Sand Cream at the edge of the world. */}
      <div
        className="dawn-cloud dawn-cloud-4 absolute rounded-[50%]"
        style={{
          bottom: "-22%",
          left: "-12%",
          width: "110vw",
          height: "58vh",
          background:
            "radial-gradient(closest-side, rgba(255, 195, 140, 0.9), rgba(255, 195, 140, 0.4) 42%, rgba(255, 195, 140, 0) 78%)",
          filter: "blur(28px)",
        }}
      />
      {/* Pinpoint sunrise glint — bright warm core, subtle pulse. */}
      <div
        className="dawn-sunrise absolute"
        style={{
          top: "10%",
          right: "20%",
          width: "360px",
          height: "360px",
          background:
            "radial-gradient(closest-side, rgba(255, 170, 100, 0.9), rgba(255, 170, 100, 0.4) 35%, rgba(255, 170, 100, 0) 70%)",
          filter: "blur(14px)",
        }}
      />
    </div>
  );
}
