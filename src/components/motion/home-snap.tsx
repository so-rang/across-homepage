"use client";

import { useEffect } from "react";

/**
 * Opt the <html> element into scroll snapping while the home page is
 * mounted. Uses `proximity` so content-heavy sections don't fight the
 * user — the page nudges to the nearest section boundary rather than
 * forcibly locking to it.
 */
export function HomeSnap() {
  useEffect(() => {
    const el = document.documentElement;
    el.classList.add("home-snap");
    return () => {
      el.classList.remove("home-snap");
    };
  }, []);
  return null;
}
