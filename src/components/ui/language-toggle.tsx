"use client";

import { Menu } from "@base-ui/react/menu";
import { Languages } from "lucide-react";
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "English",
  ja: "日本語",
  zh: "中文",
};

export function LanguageToggle() {
  const t = useTranslations("ui.languageToggle");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={t("label")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-bg-elev-2 hover:text-text disabled:opacity-60"
        disabled={isPending}
      >
        <Languages aria-hidden className="h-[14px] w-[14px]" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-50 outline-none">
          <Menu.Popup className="min-w-[140px] rounded-lg border border-border-subtle bg-bg-elev-1 p-1 text-sm shadow-lg outline-none backdrop-blur">
            {routing.locales.map((next) => {
              const isActive = next === locale;
              return (
                <Menu.Item
                  key={next}
                  onClick={() => switchTo(next)}
                  className={cn(
                    "flex cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-text-muted outline-none transition-colors data-[highlighted]:bg-bg-elev-2 data-[highlighted]:text-text",
                    isActive && "text-text"
                  )}
                >
                  <span>{LOCALE_LABELS[next]}</span>
                  {isActive ? (
                    <span aria-hidden className="text-xs text-text-muted">
                      ●
                    </span>
                  ) : null}
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
