"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type SectionId = "about" | "services" | "contents" | "contact";

const STARS: readonly { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contents", label: "Contents" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Mobile-only hamburger nav. Anchors to in-page sections on `/`; off-home
 * the link routes home with the hash so the merged single-page navigation
 * works from anywhere.
 */
export function MobileNav() {
  const t = useTranslations("nav.menu");
  const tMinimap = useTranslations("nav.minimap");
  const pathname = usePathname();
  const isHome = pathname === "/";

  const itemCls =
    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors text-text-muted hover:bg-bg-elev-2 hover:text-text";

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label={t("open")} />
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
              {STARS.map((s) => (
                <PopoverPrimitive.Close
                  key={s.id}
                  render={
                    isHome ? (
                      <a href={`#${s.id}`} className={cn(itemCls)} />
                    ) : (
                      <Link href={`/#${s.id}`} className={cn(itemCls)} />
                    )
                  }
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                  >
                    <path
                      d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>{s.label}</span>
                </PopoverPrimitive.Close>
              ))}
            </nav>
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
