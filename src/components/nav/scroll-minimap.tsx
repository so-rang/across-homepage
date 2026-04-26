"use client";

import { useEffect, useState } from "react";
import { Minimap } from "@/components/nav/minimap";
import { MobileNav } from "@/components/nav/mobile-nav";
import { cn } from "@/lib/utils";

/**
 * Shows the Minimap only after the user has scrolled past the Hero.
 * On the first screen the header stays quiet (logo only); as soon as the
 * user starts moving into the narrative, the nav slides in from above.
 * Mobile (`<sm`) swaps the inline minimap for a hamburger drawer.
 */
export function ScrollMinimap() {
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
      <div className="hidden sm:block">
        <Minimap />
      </div>
      <div className="sm:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
