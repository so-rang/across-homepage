"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
};

function detectSync(): boolean {
  const nav = navigator as NavigatorWithMemory;
  const mem = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  return mem < 4 || cores < 4;
}

function noopSubscribe(): () => void {
  return () => {};
}

/**
 * Detects low-end conditions: memory < 4GB, CPU cores < 4, or battery < 20% (not charging).
 * Returns false during SSR so initial layers render in full quality.
 */
export function useLowEndDevice(): boolean {
  const sync = useSyncExternalStore(
    noopSubscribe,
    detectSync,
    () => false
  );
  const [battLow, setBattLow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const nav = navigator as NavigatorWithMemory;
    const getBattery = nav.getBattery;
    if (typeof getBattery !== "function") return;
    getBattery
      .call(nav)
      .then((b) => {
        if (!cancelled && !b.charging && b.level < 0.2) setBattLow(true);
      })
      .catch(() => {
        /* noop */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return sync || battLow;
}
