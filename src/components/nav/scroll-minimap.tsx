"use client";

import { useEffect, useState } from "react";
import { Minimap } from "@/components/nav/minimap";
import { MobileNav } from "@/components/nav/mobile-nav";
import { cn } from "@/lib/utils";

/**
 * Both viewports gate the secondary nav by scroll so the hero stays quiet:
 * desktop reveals the Minimap, mobile reveals the hamburger — both ride in
 * with the same fade/slide as ScrollAcrossMark for a synchronized header.
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
    <>
      <div
        aria-hidden={!visible}
        className={cn(
          "hidden transition-[opacity,transform] duration-300 ease-out sm:block",
          visible
            ? "opacity-100 translate-y-0"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <Minimap />
      </div>
      <div
        aria-hidden={!visible}
        className={cn(
          "overflow-hidden transition-[width,opacity] duration-300 ease-out sm:hidden",
          visible
            ? "w-7 opacity-100"
            : "pointer-events-none w-0 opacity-0"
        )}
      >
        <MobileNav />
      </div>
    </>
  );
}
