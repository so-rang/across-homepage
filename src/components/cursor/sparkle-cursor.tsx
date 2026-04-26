"use client";

import { useEffect, useRef } from "react";
import { useCoarsePointer } from "@/lib/device/use-pointer";
import { useReducedMotion } from "@/lib/device/use-reduced-motion";

type Sparkle = {
  x: number;
  y: number;
  angle: number;
  distance: number;
  born: number;
  life: number;
};

/**
 * Starlight cursor halo (DESIGN.md §6).
 * - Small warm halo that eases toward the pointer.
 * - Click emits a small ✦ sparkle burst.
 * - No mouse-driven backdrop effects (handled in Liquid Ether / Antigravity).
 * - Coarse pointer + reduced motion: not rendered.
 */
export function SparkleCursor() {
  const coarse = useCoarsePointer();
  const reduced = useReducedMotion();
  const haloRef = useRef<HTMLDivElement>(null);
  const sparkleLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (coarse || reduced) return;

    const halo = haloRef.current;
    const layer = sparkleLayerRef.current;
    if (!halo || !layer) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    const sparkles: Sparkle[] = [];

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onClick = (e: PointerEvent) => {
      const count = 5 + Math.floor(Math.random() * 3);
      const now = performance.now();
      for (let i = 0; i < count; i++) {
        sparkles.push({
          x: e.clientX,
          y: e.clientY,
          angle: (i / count) * Math.PI * 2 + Math.random() * 0.5,
          distance: 14 + Math.random() * 12,
          born: now,
          life: 320,
        });
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onClick);

    let raf = 0;
    const tick = () => {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;

      halo.style.transform = `translate3d(${x - 14}px, ${y - 14}px, 0)`;

      const now = performance.now();
      let markup = "";
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i]!;
        const age = now - s.born;
        if (age > s.life) {
          sparkles.splice(i, 1);
          continue;
        }
        const t = age / s.life;
        const r = s.distance * t;
        const sx = s.x + Math.cos(s.angle) * r;
        const sy = s.y + Math.sin(s.angle) * r;
        const alpha = 1 - t;
        const scale = 1 - t * 0.5;
        markup += `<svg style="position:absolute;left:${sx - 4}px;top:${sy - 4}px;width:8px;height:8px;opacity:${alpha};transform:scale(${scale})" viewBox="0 0 20 20" aria-hidden="true"><path d="M 10 0 L 11.1 8.9 L 20 10 L 11.1 11.1 L 10 20 L 8.9 11.1 L 0 10 L 8.9 8.9 Z" fill="#f8efd6" /></svg>`;
      }
      layer.innerHTML = markup;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [coarse, reduced]);

  if (coarse || reduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
    >
      <div
        ref={haloRef}
        className="absolute h-7 w-7 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(248,239,214,0.42), rgba(248,239,214,0))",
          willChange: "transform",
        }}
      />
      <div ref={sparkleLayerRef} className="absolute inset-0" />
    </div>
  );
}
