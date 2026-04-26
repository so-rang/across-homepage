"use client";

import { useEffect } from "react";

/**
 * Enables per-section vertical scroll snap on the current page.
 * Toggles `.snap-page` on <html> while mounted; globals.css turns that
 * into `scroll-snap-type: y proximity` with `min-h-dvh` sections.
 * Respects `prefers-reduced-motion` via the same CSS rule.
 */
export function SnapScroll() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("snap-page");
    return () => {
      html.classList.remove("snap-page");
    };
  }, []);
  return null;
}
