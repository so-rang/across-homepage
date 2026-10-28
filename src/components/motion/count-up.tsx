"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Props = {
  /** Final numeric value. */
  to: number;
  /** Literal suffix appended after the number (e.g. `+` for "400+"). */
  suffix?: string;
  /** Total tween duration in ms. */
  duration?: number;
  /** Delay before the count starts (after the element enters view), in ms. */
  delay?: number;
  className?: string;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

/**
 * Counts from 0 → `to` once, when the element first crosses into view.
 * Uses a single `requestAnimationFrame` loop with `easeOutCubic`. Falls
 * back to the final value immediately for `prefers-reduced-motion`.
 *
 * The server HTML (and the first client paint) carry the FINAL value, not 0:
 * crawlers and LLM readers only see server HTML, and "0 AI models / 0+
 * customers" is what they quoted before. The tween resets to 0 on the client
 * only when the element is still off-screen at mount.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1200,
  delay = 0,
  className,
}: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const [value, setValue] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;

    // Already on screen at mount (tall viewports, headless renderers): keep
    // the final value instead of flashing to 0 and counting back up.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    setValue(0);

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting || hasRunRef.current) return;
        hasRunRef.current = true;

        const startTime = performance.now() + delay;

        const tick = (now: number) => {
          if (now < startTime) {
            requestAnimationFrame(tick);
            return;
          }
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(to * eased));
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, delay, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {prefersReduced ? to : value}
      {suffix}
    </span>
  );
}
