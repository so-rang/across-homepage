import Image from "next/image";

/**
 * "On-scroll" emblem for the second screen.
 * Uses `/logo/across_logo_cream.png` (transparent cutout). The ✦ glow is
 * a crisp star — pinpoint core + four thin tapered rays — not a diffuse
 * dust halo. Only the rays breathe, never the whole mark.
 */
export function LogoEmblem() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px] lg:max-w-[320px]">
      <Image
        src="/logo/across_logo_cream.png"
        alt=""
        aria-hidden
        fill
        sizes="320px"
        className="select-none object-contain brightness-0 dark:brightness-100"
        priority={false}
      />
      {/* Crisp star at the ✦ position (≈62.5%, 54% of the image box). */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <g
          className="logo-emblem-star"
          style={{ transformOrigin: "62.5px 54px", transformBox: "fill-box" }}
        >
          {/* Vertical ray — tapered lozenge matching the ✦ vertical axis. */}
          <path
            d="M 62.5 42 L 62.9 54 L 62.5 66 L 62.1 54 Z"
            fill="rgba(255, 252, 240, 0.95)"
          />
          {/* Horizontal ray — shorter + subtler. */}
          <path
            d="M 54 54 L 62.5 53.6 L 71 54 L 62.5 54.4 Z"
            fill="rgba(255, 252, 240, 0.75)"
          />
          {/* Pinpoint core — bright white disc. */}
          <circle cx="62.5" cy="54" r="0.9" fill="rgba(255, 255, 250, 1)" />
        </g>
      </svg>
    </div>
  );
}
