"use client";

import { useEffect, useMemo, useRef } from "react";
import { useIsMobile } from "@/lib/device/use-is-mobile";

/**
 * Earth-from-orbit accent for Hero.
 * Oversized canvas positioned absolutely in the Hero section; the section
 * drops `overflow-hidden` so the globe's lower portion bleeds into the
 * About section beneath it.
 *
 * Seamless loop: two <video> elements offset by duration/2. The top one's
 * opacity is animated around its loop seam so the switch between loops is
 * hidden by the element that's mid-playback at that moment.
 *
 * Starfield overlay: deterministic scattered dots that never overlap the
 * central sphere area (radial mask with a transparent center + hand-picked
 * positions outside that zone).
 */
const CROSSFADE_SECONDS = 1.2;
const PLAYBACK_RATE = 1;

type Star = { cx: number; cy: number; r: number; opacity: number };

/**
 * Stars laid out on a 100×100 canvas grid; all positions are at least ~35
 * units from the sphere centre (50, 50) so none land on Earth. A radial
 * mask on the SVG feathers the inner boundary so the transition from
 * star-covered → sphere-area reads as a soft cloud, not a cut-out hole.
 */
const STARS: Star[] = [
  { cx: 4, cy: 6, r: 0.12, opacity: 0.7 },
  { cx: 11, cy: 14, r: 0.08, opacity: 0.45 },
  { cx: 8, cy: 30, r: 0.1, opacity: 0.55 },
  { cx: 3, cy: 44, r: 0.14, opacity: 0.8 },
  { cx: 6, cy: 62, r: 0.07, opacity: 0.4 },
  { cx: 12, cy: 78, r: 0.11, opacity: 0.65 },
  { cx: 2, cy: 88, r: 0.09, opacity: 0.5 },
  { cx: 16, cy: 94, r: 0.1, opacity: 0.6 },
  { cx: 22, cy: 8, r: 0.1, opacity: 0.55 },
  { cx: 28, cy: 18, r: 0.06, opacity: 0.4 },
  { cx: 34, cy: 5, r: 0.13, opacity: 0.75 },
  { cx: 42, cy: 12, r: 0.07, opacity: 0.45 },
  { cx: 50, cy: 3, r: 0.11, opacity: 0.65 },
  { cx: 57, cy: 10, r: 0.08, opacity: 0.5 },
  { cx: 64, cy: 4, r: 0.12, opacity: 0.75 },
  { cx: 72, cy: 11, r: 0.09, opacity: 0.55 },
  { cx: 78, cy: 6, r: 0.06, opacity: 0.4 },
  { cx: 85, cy: 14, r: 0.11, opacity: 0.65 },
  { cx: 92, cy: 7, r: 0.08, opacity: 0.5 },
  { cx: 97, cy: 18, r: 0.1, opacity: 0.6 },
  { cx: 88, cy: 28, r: 0.07, opacity: 0.45 },
  { cx: 96, cy: 42, r: 0.13, opacity: 0.75 },
  { cx: 92, cy: 58, r: 0.09, opacity: 0.55 },
  { cx: 97, cy: 72, r: 0.11, opacity: 0.65 },
  { cx: 89, cy: 84, r: 0.08, opacity: 0.5 },
  { cx: 95, cy: 93, r: 0.12, opacity: 0.75 },
  { cx: 82, cy: 91, r: 0.06, opacity: 0.4 },
  { cx: 74, cy: 95, r: 0.1, opacity: 0.6 },
  { cx: 66, cy: 92, r: 0.07, opacity: 0.45 },
  { cx: 58, cy: 96, r: 0.11, opacity: 0.65 },
  { cx: 48, cy: 94, r: 0.09, opacity: 0.55 },
  { cx: 40, cy: 97, r: 0.06, opacity: 0.4 },
  { cx: 32, cy: 92, r: 0.1, opacity: 0.6 },
  { cx: 24, cy: 96, r: 0.08, opacity: 0.5 },
  { cx: 18, cy: 88, r: 0.1, opacity: 0.55 },
];

export function EarthBackdrop() {
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();

  // Very soft edge vignette — only the extreme outer 15% fades to bg so the
  // video rectangle never shows as a line, but the vast majority of the
  // canvas (including the full sphere + any light) is untouched.
  const overlay = useMemo(
    () =>
      [
        "radial-gradient(ellipse closest-side at 50% 55%,",
        "transparent 0%,",
        "transparent 80%,",
        "rgba(4,4,10,0.4) 90%,",
        "rgba(4,4,10,1) 100%)",
      ].join(" "),
    []
  );

  // Radial mask that hides stars inside the sphere's footprint and feathers
  // outward so there's no cut-out ring around Earth.
  const starMask = useMemo(
    () =>
      [
        "radial-gradient(ellipse 40% 40% at 50% 55%,",
        "transparent 0%,",
        "transparent 55%,",
        "rgba(0,0,0,0.5) 75%,",
        "black 100%)",
      ].join(" "),
    []
  );

  useEffect(() => {
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    if (!v1) return;

    let rafId = 0;
    let started = false;

    const fadeIn = (t: number, duration: number) => {
      if (!duration) return 1;
      const dist = Math.min(t, duration - t);
      return Math.min(1, Math.max(0, dist / CROSSFADE_SECONDS));
    };

    const tick = () => {
      if (v2 && v2.duration) {
        v2.style.opacity = String(fadeIn(v2.currentTime, v2.duration));
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (started) return;
      const duration = v1.duration;
      if (!duration || Number.isNaN(duration)) return;
      started = true;
      v1.playbackRate = PLAYBACK_RATE;
      void v1.play().catch(() => {});
      if (!v2) return;
      try {
        v2.currentTime = duration / 2;
      } catch {
        // Some browsers throw if currentTime set before metadata; ignore.
      }
      v2.playbackRate = PLAYBACK_RATE;
      v2.preload = "auto";
      v2.load();
      void v2.play().catch(() => {});
      tick();
    };

    if (v1.readyState >= 1) start();
    v1.addEventListener("loadedmetadata", start);
    if (v2) v2.addEventListener("loadedmetadata", start);

    return () => {
      cancelAnimationFrame(rafId);
      v1.removeEventListener("loadedmetadata", start);
      if (v2) v2.removeEventListener("loadedmetadata", start);
    };
  }, [isMobile]);

  const videoClass =
    "absolute inset-0 h-full w-full select-none object-cover object-[50%_50%]";

  return (
    <div
      aria-hidden
      data-intro-item="stage-low"
      className="pointer-events-none absolute z-[5]"
      style={{
        left: "-8vw",
        bottom: "-52vh",
        width: "116vw",
        maxWidth: "none",
        height: "148vh",
        minHeight: "1040px",
        opacity: 0.92,
        maskImage:
          "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
      }}
    >
      <div className="relative h-full w-full">
        <video
          ref={v1Ref}
          src="/earth_2.mp4"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          className={videoClass}
        />
        {!isMobile && (
          <video
            ref={v2Ref}
            src="/earth_2.mp4"
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            className={videoClass}
            style={{ opacity: 0 }}
          />
        )}
        <div className="absolute inset-0" style={{ background: overlay }} />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          style={{ maskImage: starMask, WebkitMaskImage: starMask }}
        >
          <defs>
            <filter
              id="earth-star-glow"
              x="-400%"
              y="-400%"
              width="900%"
              height="900%"
            >
              <feGaussianBlur stdDeviation="0.12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#earth-star-glow)">
            {STARS.map((s, i) => (
              <circle
                key={i}
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill="rgba(248,239,214,1)"
                opacity={s.opacity}
              />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
