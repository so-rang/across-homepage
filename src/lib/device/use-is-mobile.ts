"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 767px)";

function noopSubscribe(): () => void {
  return () => {};
}

function detect(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

/**
 * Returns true on viewports ≤ 767px. SSR-safe: returns false on the server
 * so initial markup matches; useSyncExternalStore upgrades to the client
 * value after hydration without warning.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(noopSubscribe, detect, () => false);
}
