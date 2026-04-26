"use client";

import { useEffect, useState } from "react";
import { AcrossMark } from "@/components/brand/across-mark";
import { cn } from "@/lib/utils";

/**
 * Mirrors ScrollMinimap: keeps the top-left mark hidden during the hero
 * (the eyebrow already states the brand), then slides it in once the user
 * scrolls into the narrative so the header reads as one synchronized band.
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
        "transition-[opacity,transform] duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "pointer-events-none -translate-y-2 opacity-0"
      )}
    >
      <AcrossMark />
    </div>
  );
}
