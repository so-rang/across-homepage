"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Translation magnitude in px. */
  distance?: number;
  /** Axis of translation. `y` slides up (default), `x` slides in from the left. */
  axis?: "x" | "y";
  /** Stagger children selector (children must carry `data-reveal-item`). */
  staggerChildren?: boolean;
  /** Per-step stagger in seconds when `staggerChildren` is true. */
  stagger?: number;
  delay?: number;
  /** Total duration of the tween in seconds. */
  duration?: number;
};

/**
 * Fades + translates contents in when the element scrolls into view.
 * Uses GSAP ScrollTrigger for proper scrubbed easing and reversal on scroll-up.
 * Respects `prefers-reduced-motion` via the browser's media query guard.
 */
export function ScrollReveal({
  children,
  className,
  distance = 40,
  axis = "y",
  staggerChildren = false,
  stagger = 0.12,
  delay = 0,
  duration = 0.9,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(rootRef.current, { opacity: 1, x: 0, y: 0 });
        return;
      }

      const targets = staggerChildren
        ? rootRef.current.querySelectorAll<HTMLElement>("[data-reveal-item]")
        : [rootRef.current];

      const fromVars =
        axis === "x"
          ? { opacity: 0, x: -distance }
          : { opacity: 0, y: distance };
      const toVars = axis === "x" ? { x: 0 } : { y: 0 };

      gsap.fromTo(
        targets,
        fromVars,
        {
          opacity: 1,
          ...toVars,
          duration,
          ease: "power3.out",
          delay,
          stagger: staggerChildren ? stagger : 0,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 82%",
            end: "top 35%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={cn("will-change-[opacity,transform]", className)}>
      {children}
    </div>
  );
}
