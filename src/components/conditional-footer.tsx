"use client";

import { Footer } from "@/components/footer";
import { usePathname } from "@/i18n/navigation";

/**
 * Layout-level Footer that skips routes which render their own Footer
 * inside the last snap section (so closing content + Footer share one
 * viewport). Currently: home (`/`), about (`/about`), contact (`/contact`).
 */
export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/about" || pathname === "/contact")
    return null;
  return <Footer />;
}
