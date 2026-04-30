"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Dissolves the Hero as the user scrolls through it.
 * Runs a scrubbed timeline from scroll=0 to ~80% of viewport height,
 * reducing opacity + pushing content up slightly. The next section comes
 * in under it, so the transition reads as a cross-fade instead of a
 * hard panel cover.
 */
export function HeroFade({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!rootRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Mobile inertia scroll fires events at very high rate; a scrubbed
      // ScrollTrigger on the hero thrashes layout on every tick. Skip the
      // fade entirely on mobile — the next section just stacks underneath.
      if (window.matchMedia("(max-width: 767px)").matches) return;

      gsap.to(rootRef.current, {
        opacity: 0,
        y: -12,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: () => window.innerHeight * 1.8,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}
