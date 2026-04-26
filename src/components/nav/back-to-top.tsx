"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Floating button that smooth-scrolls the page to the top.
 * Fades in after the user has scrolled past the Hero, hides while in Hero.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="페이지 맨 위로"
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-border-strong bg-bg-elev-1/80 text-text-muted backdrop-blur-[8px] transition-[opacity,transform,color,border-color] duration-[var(--d-base)] ease-[var(--ease-soft)] hover:text-text hover:border-text sm:bottom-10 sm:right-10 sm:h-12 sm:w-12",
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M12 19 L12 5" />
        <path d="M5 12 L12 5 L19 12" />
      </svg>
    </button>
  );
}
