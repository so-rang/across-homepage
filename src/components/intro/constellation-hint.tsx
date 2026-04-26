"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/device/use-reduced-motion";

const STORAGE_KEY = "across.constellationHinted";
const APPEAR_AT_MS = 1900; // just after intro settles at 1.8s
const HIDE_AFTER_MS = 3000;

/**
 * First-visit constellation onboarding (plan T29 / DESIGN.md §7.1).
 * Mounts only when the user has not seen the hint this session.
 * Appears near the first star with a "클릭해서 이동 →" tooltip + a 1-beat
 * pulse on all four stars. Respects reduced-motion (pulse off).
 */
export function ConstellationHint() {
  const t = useTranslations("intro");
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "visible" | "done">("idle");

  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage blocked */
    }
    if (seen === "1") return;

    const appear = window.setTimeout(() => setPhase("visible"), APPEAR_AT_MS);
    const hide = window.setTimeout(() => {
      setPhase("done");
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* storage blocked */
      }
    }, APPEAR_AT_MS + HIDE_AFTER_MS);

    return () => {
      window.clearTimeout(appear);
      window.clearTimeout(hide);
    };
  }, []);

  if (phase !== "visible") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-star-warm/30 bg-bg-elev-2 px-4 py-2 text-sm text-text shadow-[0_0_24px_rgba(248,239,214,0.18)] backdrop-blur-[8px] animate-in fade-in duration-300 sm:bottom-10"
    >
      {t("constellationHint")} <span aria-hidden>→</span>
      {!reduced ? (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-star-warm/50 motion-safe:animate-ping"
        />
      ) : null}
    </div>
  );
}
