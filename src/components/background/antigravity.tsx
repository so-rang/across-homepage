"use client";

import { useEffect, useRef } from "react";
import type { LayerProps } from "./types";

const COUNT_BY_QUALITY: Record<"full" | "low", number> = {
  full: 75,
  low: 35,
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  brightness: number;
  twinkleAmp: number;
  twinkleSpeed: number;
  twinklePhase: number;
  tier: 0 | 1 | 2; // 0 = faint pinpoint, 1 = medium, 2 = bright anchor
};

/**
 * Night-sky star field.
 * Design notes (responding to user feedback "먼지 같다"):
 * - NO diffraction spikes.
 * - 3 distinct tiers with real contrast: pinpoint, medium, bright anchor.
 * - Halos only on tier-2 anchor stars (majority are crisp dots).
 * - Very slow drift — feels still, like a photo, not "floaters".
 */
export function Antigravity({ quality }: LayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (quality === "static") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const count = COUNT_BY_QUALITY[quality];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const particles: Particle[] = Array.from({ length: count }, () => {
      const pick = Math.random();
      let tier: Particle["tier"];
      let baseRadius: number;
      let brightness: number;
      let twinkleAmp: number;
      // Parallax drift — closer (brighter) stars move more, distant ones
      // barely shift, so the field reads as depth not uniform scroll.
      let driftSpeed: number;

      if (pick < 0.78) {
        tier = 0; // pinpoint (deep background)
        baseRadius = (Math.random() * 0.25 + 0.45) * dpr;
        brightness = Math.random() * 0.25 + 0.35;
        twinkleAmp = Math.random() * 0.05 + 0.03;
        driftSpeed = 0.04;
      } else if (pick < 0.96) {
        tier = 1; // medium
        baseRadius = (Math.random() * 0.35 + 0.85) * dpr;
        brightness = Math.random() * 0.25 + 0.55;
        twinkleAmp = Math.random() * 0.07 + 0.05;
        driftSpeed = 0.1;
      } else {
        tier = 2; // bright anchor (near)
        baseRadius = (Math.random() * 0.5 + 1.4) * dpr;
        brightness = Math.random() * 0.15 + 0.75;
        twinkleAmp = Math.random() * 0.09 + 0.08;
        driftSpeed = 0.2;
      }

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * driftSpeed * dpr,
        vy: (Math.random() - 0.5) * driftSpeed * dpr,
        baseRadius,
        brightness,
        twinkleAmp,
        twinkleSpeed: Math.random() * 0.35 + 0.25,
        twinklePhase: Math.random() * Math.PI * 2,
        tier,
      };
    });

    window.addEventListener("resize", resize);

    let rafId = 0;
    const start = performance.now();

    const tick = () => {
      const t = (performance.now() - start) * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
        if (p.y < -5) p.y = canvas.height + 5;
        if (p.y > canvas.height + 5) p.y = -5;

        const wave = Math.sin(t * p.twinkleSpeed + p.twinklePhase);
        const alpha = Math.max(
          0.1,
          Math.min(1, p.brightness + wave * p.twinkleAmp)
        );

        // Color temperature: most cool-white, few warm
        const warm = (p.twinklePhase * 100) % 1 > 0.7;
        const r = warm ? 255 : 235;
        const g = warm ? 243 : 238;
        const b = warm ? 220 : 252;

        // Crisp core — no size pulsing so they don't look fuzzy/dusty
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();

        // No halos — crisp points only (user feedback: glows feel off).
        // Brightness tier is conveyed by core size + opacity alone.
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [quality]);

  if (quality === "static") {
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

  return <canvas aria-hidden ref={canvasRef} className="stage-layer z-20" />;
}
