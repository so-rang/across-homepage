"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { MenuIcon, XIcon } from "lucide-react";
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
 * Uses base-ui Dialog primitives directly so the panel slides from the right
 * edge instead of centering, mirroring `components/ui/dialog.tsx` styling.
 */
export function MobileNav() {
  const t = useTranslations("nav.menu");
  const tMinimap = useTranslations("nav.minimap");
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("open")}
          />
        }
      >
        <MenuIcon />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 bg-black/30 duration-150 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        />
        <DialogPrimitive.Popup
          className="fixed inset-y-0 right-0 z-50 flex w-72 max-w-[80vw] flex-col gap-6 bg-popover p-6 text-popover-foreground shadow-xl ring-1 ring-foreground/10 outline-none duration-200 data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right"
        >
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="font-heading text-base font-medium">
              {t("title")}
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("close")}
                />
              }
            >
              <XIcon />
            </DialogPrimitive.Close>
          </div>
          <nav
            aria-label={tMinimap("label")}
            className="flex flex-col"
          >
            {STARS.map((s) => {
              const current =
                pathname === s.href || pathname.startsWith(`${s.href}/`);
              return (
                <DialogPrimitive.Close
                  key={s.href}
                  render={
                    <Link
                      href={s.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-base transition-colors",
                        current
                          ? "bg-bg-elev-2 text-text"
                          : "text-text-muted hover:text-text"
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
                </DialogPrimitive.Close>
              );
            })}
          </nav>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
