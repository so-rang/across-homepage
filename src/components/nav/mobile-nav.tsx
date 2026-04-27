"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const STARS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contents", label: "Contents" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Mobile-only hamburger nav. Hidden on `sm:` and up where Minimap takes over.
 * Drops a popover anchored to the trigger (mirrors LanguageToggle) instead of
 * a side-sliding panel so it feels like a quick menu rather than a takeover.
 */
export function MobileNav() {
  const t = useTranslations("nav.menu");
  const tMinimap = useTranslations("nav.minimap");
  const pathname = usePathname();

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("open")}
          />
        }
      >
        <MenuIcon />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          sideOffset={8}
          align="end"
          className="z-50 outline-none"
        >
          <PopoverPrimitive.Popup className="min-w-[140px] rounded-lg border border-border-subtle bg-bg-elev-1 p-1 text-sm shadow-lg outline-none backdrop-blur duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <nav
              aria-label={tMinimap("label")}
              className="flex flex-col"
            >
              {STARS.map((s) => {
                const current =
                  pathname === s.href || pathname.startsWith(`${s.href}/`);
                return (
                  <PopoverPrimitive.Close
                    key={s.href}
                    render={
                      <Link
                        href={s.href}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                          current
                            ? "bg-bg-elev-2 text-text"
                            : "text-text-muted hover:bg-bg-elev-2 hover:text-text"
                        )}
                      />
                    }
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 16 16"
                      className={cn("h-3 w-3", current ? "scale-125" : "")}
                    >
                      <path
                        d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>{s.label}</span>
                  </PopoverPrimitive.Close>
                );
              })}
            </nav>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
