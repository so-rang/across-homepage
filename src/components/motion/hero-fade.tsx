"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Dissolves the Hero as the user scrolls through it.
 * Runs a scrubbed timeline from scroll=0 to ~180% of viewport height,
 * reducing opacity + pushing content up slightly. The next section comes
 * in under it, so the transition reads as a cross-fade instead of a
 * hard panel cover.
 *
 * When the user clicks a hash anchor inside the hero (e.g., constellation
 * stars), the smooth scroll lands on the next section while scrub progress
 * is still ~0.5, leaving the hero half-visible. To avoid that, the click
 * triggers a 280ms tween straight to opacity 0 and pauses the scrub until
 * the user scrolls back near the top — at which point scrub takes over
 * again so reverse-scrolling brings the hero back.
 */
export function HeroFade({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Mobile inertia scroll fires events at very high rate; a scrubbed
      // ScrollTrigger on the hero thrashes layout on every tick. Skip the
      // fade entirely on mobile — the next section just stacks underneath.
      if (window.matchMedia("(max-width: 767px)").matches) return;

      const tween = gsap.to(root, {
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
      const st = tween.scrollTrigger;

      let scrollHandler: (() => void) | null = null;

      const onAnchorClick = (event: MouseEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const anchor = target.closest("a[href^='#']");
        if (!anchor || !root.contains(anchor)) return;
        const href = anchor.getAttribute("href") ?? "";
        // Ignore "#" and "#top" — they keep the user on the hero.
        if (href.length <= 1 || href === "#top") return;

        // Snap-fade. overwrite kills the scrub-driven tween for this
        // property so the two don't fight.
        st?.disable(false, false);
        gsap.to(root, {
          opacity: 0,
          y: -12,
          duration: 0.28,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Re-arm scrub once the user is scrolled back near the top so
        // reverse-scroll restores the hero. Wait for the click-driven smooth
        // scroll to carry the page past mid-viewport first — otherwise the
        // very first scroll tick (y≈1) still satisfies the near-top guard
        // and ScrollTrigger.refresh() calls window.scrollTo(0, 0), which
        // cancels the browser's smooth-scroll-to-anchor.
        if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
        let scrolledAway = false;
        scrollHandler = () => {
          const y = window.scrollY;
          if (!scrolledAway) {
            if (y > window.innerHeight * 0.5) scrolledAway = true;
            return;
          }
          if (y < window.innerHeight * 0.05) {
            st?.enable();
            ScrollTrigger.refresh();
            if (scrollHandler) {
              window.removeEventListener("scroll", scrollHandler);
              scrollHandler = null;
            }
          }
        };
        window.addEventListener("scroll", scrollHandler, { passive: true });
      };

      document.addEventListener("click", onAnchorClick);

      return () => {
        document.removeEventListener("click", onAnchorClick);
        if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
      };
    },
    { scope: rootRef }
  );

  return <div ref={rootRef}>{children}</div>;
}
