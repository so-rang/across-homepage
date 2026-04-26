"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme/bootstrap";

/**
 * Theme toggle — switches between dark (Deep Space) and light (Dawn).
 * Reads current theme from the `html` class set by the bootstrap script
 * and observes class mutations so multiple toggles in different headers
 * stay in sync without prop drilling.
 */

function subscribeToTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getClientTheme(): Theme {
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function getServerTheme(): Theme {
  return "dark";
}

export function ThemeToggle() {
  const t = useTranslations("ui.themeToggle");
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getClientTheme,
    getServerTheme
  );

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? t("toDark") : t("toLight")}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-elev-2 hover:text-text"
    >
      {isLight ? (
        <Moon aria-hidden className="h-[14px] w-[14px]" />
      ) : (
        <Sun aria-hidden className="h-[14px] w-[14px]" />
      )}
    </button>
  );
}
