"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { withZoomTransition } from "@/lib/nav/zoom";

type Props = {
  /** Target to navigate to on dismiss (typically "/"). */
  backHref: string;
};

/**
 * Destination-screen gesture layer (DESIGN.md §7.2).
 * Listens for ESC, a vertical swipe-down (pointer > 50px on touch),
 * and exposes a click surface via `data-zoom-out` so backgrounds or the
 * ✦ mark can trigger dismissal without extra handlers.
 */
export function ZoomOutGesture({ backHref }: Props) {
  const router = useRouter();
  const startYRef = useRef<number | null>(null);

  useEffect(() => {
    const goBack = () => {
      void withZoomTransition(() => router.push(backHref));
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        goBack();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        startYRef.current = e.clientY;
      }
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-zoom-out]")) {
        e.preventDefault();
        goBack();
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || startYRef.current === null) return;
      const delta = e.clientY - startYRef.current;
      startYRef.current = null;
      if (delta > 50) goBack();
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [router, backHref]);

  return null;
}
