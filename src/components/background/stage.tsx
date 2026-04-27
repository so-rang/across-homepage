"use client";

import { useIsMobile } from "@/lib/device/use-is-mobile";
import { useLowEndDevice } from "@/lib/device/use-low-end-device";
import { useReducedMotion } from "@/lib/device/use-reduced-motion";
import { Antigravity } from "./antigravity";
import { BorderGlow } from "./border-glow";
import { DarkVeil } from "./dark-veil";
import { LiquidEther } from "./liquid-ether";
import type { RenderQuality } from "./types";

/**
 * Background orchestrator — mounts the 5-layer field.
 * Picks `full` / `low` / `static` based on reduced-motion + device heuristics.
 *
 * Layer stack (bottom → top):
 *   z-0   Liquid Ether (WebGL fragment shader)
 *   z-10  Dark Veil (CSS radial gradients)
 *   z-20  Antigravity (Canvas 2D particle field)
 *   z-30  Border Glow (SVG starfield seeds + connecting lines)
 *
 * Layers are grouped by `data-intro-item` so the intro timeline (plan T10)
 * can stagger their appearance via CSS in globals.css.
 */
export function Stage() {
  const reduced = useReducedMotion();
  const lowEnd = useLowEndDevice();
  const isMobile = useIsMobile();

  const quality: RenderQuality = reduced
    ? "static"
    : lowEnd || isMobile
      ? "low"
      : "full";

  return (
    <>
      <div data-intro-item="stage-low">
        <LiquidEther quality={quality} />
        <DarkVeil quality={quality} />
      </div>
      <div data-intro-item="stage-particles">
        <Antigravity quality={quality} />
      </div>
      <div data-intro-item="stage-border">
        <BorderGlow />
      </div>
    </>
  );
}
