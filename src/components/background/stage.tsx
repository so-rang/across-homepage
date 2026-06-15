"use client";

import dynamic from "next/dynamic";
import { useIsMobile } from "@/lib/device/use-is-mobile";
import { useLowEndDevice } from "@/lib/device/use-low-end-device";
import { useReducedMotion } from "@/lib/device/use-reduced-motion";
import { BorderGlow } from "./border-glow";
import { DarkVeil } from "./dark-veil";
import type { RenderQuality } from "./types";

/**
 * Animated layers are heavy: LiquidEther pulls in `ogl` (WebGL) and Antigravity
 * runs a per-frame canvas rAF. Neither executes on the `static` tier
 * (mobile / reduced-motion), which falls back to the CSS + SVG layers below — so
 * they load via next/dynamic. The `ogl` chunk is fetched only when an animated
 * tier actually mounts them, keeping it out of the bundle that static-tier
 * (mobile) devices download.
 */
const LiquidEther = dynamic(
  () => import("./liquid-ether").then((m) => m.LiquidEther),
  { ssr: false }
);
const Antigravity = dynamic(
  () => import("./antigravity").then((m) => m.Antigravity),
  { ssr: false }
);

/**
 * Zero-cost static fallbacks (no ogl, no rAF) for the `static` tier. Kept inline
 * here so the WebGL / canvas modules are never dragged into the bundle that
 * static-tier devices download.
 */
function LiquidEtherStatic() {
  return (
    <div
      aria-hidden
      className="stage-layer z-0"
      style={{
        background: `
          radial-gradient(1400px 1000px at 30% 25%, rgba(95, 70, 150, 0.14), transparent 60%),
          radial-gradient(1000px 800px at 78% 72%, rgba(150, 100, 110, 0.08), transparent 55%),
          #04040a
        `,
      }}
    />
  );
}

function AntigravityStatic() {
  return (
    <svg
      aria-hidden
      className="stage-layer z-20"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: 70 }).map((_, i) => {
        const x = ((i * 97) % 1440) + 10;
        const y = ((i * 53) % 900) + 5;
        const r = i % 20 === 0 ? 1.8 : i % 5 === 0 ? 1.0 : 0.55;
        const a = ((i * 31) % 50) / 100 + 0.45;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill={i % 7 === 0 ? "#f8efd6" : "#ffffff"}
            opacity={a}
          />
        );
      })}
    </svg>
  );
}

/**
 * Background orchestrator — mounts the 5-layer field.
 * Picks `full` / `low` / `static` based on reduced-motion + device heuristics.
 *
 * Layer stack (bottom → top):
 *   z-0   Liquid Ether (WebGL fragment shader) — static tier: CSS gradient
 *   z-10  Dark Veil (CSS radial gradients)
 *   z-20  Antigravity (Canvas 2D particle field) — static tier: SVG starfield
 *   z-30  Border Glow (SVG starfield seeds + connecting lines)
 *
 * Layers are grouped by `data-intro-item` so the intro timeline (plan T10)
 * can stagger their appearance via CSS in globals.css.
 */
export function Stage() {
  const reduced = useReducedMotion();
  const lowEnd = useLowEndDevice();
  const isMobile = useIsMobile();

  // Mobile drops to static: WebGL fragment shader + canvas particle rAF
  // pegged the GPU on phones even at "low" (half framerate, lower DPR).
  // Static path is a CSS gradient + pre-baked SVG starfield — zero per-frame
  // cost, never downloads the `ogl` chunk — and visually close enough at the
  // smaller viewport.
  const quality: RenderQuality = reduced || isMobile
    ? "static"
    : lowEnd
      ? "low"
      : "full";

  const animated = quality !== "static";

  return (
    <>
      <div data-intro-item="stage-low">
        {animated ? <LiquidEther quality={quality} /> : <LiquidEtherStatic />}
        <DarkVeil quality={quality} />
      </div>
      <div data-intro-item="stage-particles">
        {animated ? <Antigravity quality={quality} /> : <AntigravityStatic />}
      </div>
      <div data-intro-item="stage-border">
        <BorderGlow />
      </div>
    </>
  );
}
