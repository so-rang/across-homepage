"use client";

import { useEffect, useState } from "react";
import { AcrossMark } from "@/components/brand/across-mark";
import { cn } from "@/lib/utils";

/**
 * Mirrors ScrollMinimap: keeps the top-left mark hidden during the hero
 * (the eyebrow already states the brand), then slides it in once the user
 * scrolls into the narrative so the header reads as one synchronized band.
 *
 * Mobile mirrors the hamburger's push: the mark emerges by growing its
 * width from the left edge instead of the desktop's top slide, so the two
 * sides of the band animate symmetrically inward.
 */
export function ScrollAcrossMark() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "flex items-center overflow-hidden transition-[max-width,opacity,transform] duration-300 ease-out sm:overflow-visible",
        visible
          ? "max-w-[200px] opacity-100 sm:translate-y-0"
          : "pointer-events-none max-w-0 opacity-0 sm:max-w-none sm:-translate-y-2"
      )}
    >
      <AcrossMark />
    </div>
  );
}
