"use client";

import { useEffect } from "react";

/**
 * Hides the PageHeader mark while the given selector is in view,
 * reveals it once the user scrolls past. Target the About page's first
 * (hero) section so the big emblem has the stage alone.
 */
export function HeroMarkToggle({
  selector = "main > section:first-of-type",
}: {
  selector?: string;
}) {
  useEffect(() => {
    const hero = document.querySelector(selector);
    if (!hero) return;
    const html = document.documentElement;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.intersectionRatio > 0.35) {
          html.setAttribute("data-in-hero", "");
        } else {
          html.removeAttribute("data-in-hero");
        }
      },
      { threshold: [0, 0.35, 0.7] }
    );
    io.observe(hero);
    return () => {
      io.disconnect();
      html.removeAttribute("data-in-hero");
    };
  }, [selector]);
  return null;
}
