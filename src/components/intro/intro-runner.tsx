"use client";

import { useEffect } from "react";
import {
  INTRO_FULL_DURATION_MS,
  INTRO_PERF_END,
  INTRO_PERF_MEASURE,
  INTRO_PERF_START,
  INTRO_SHORT_DURATION_MS,
} from "@/lib/motion/intro";

/**
 * Finalizes the Hero intro started by the inline bootstrap script.
 * Writes the sessionStorage flag, records a performance measure,
 * and advances `html[data-intro]` to `"done"` so animations do not
 * replay on SPA re-mount (nav back to /).
 */
export function IntroRunner() {
  useEffect(() => {
    const root = document.documentElement;
    const state = root.dataset.intro;

    if (state !== "first" && state !== "short") {
      root.dataset.intro = "done";
      return;
    }

    const duration =
      state === "first" ? INTRO_FULL_DURATION_MS : INTRO_SHORT_DURATION_MS;

    const timer = window.setTimeout(() => {
      root.dataset.intro = "done";
      try {
        performance.mark(INTRO_PERF_END);
        performance.measure(
          INTRO_PERF_MEASURE,
          INTRO_PERF_START,
          INTRO_PERF_END
        );
      } catch {
        /* marks may be missing — acceptable */
      }
    }, duration);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
