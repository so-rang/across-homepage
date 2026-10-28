import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/**
 * Canonical production origin. The live site is www.across.center; the legacy
 * across.cx / www.across.cx hosts 308-redirect there. canonical / og:url /
 * hreflang / sitemap / robots must all declare the host that actually serves
 * the page — declaring a redirecting host makes crawlers (and GPTO's homepage
 * reader) reject the page as inconsistent.
 * Override via NEXT_PUBLIC_SITE_URL in the deployment environment.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.across.center"
).replace(/\/$/, "");

/**
 * Company facts already published on the site (footer `companyLine`, legal
 * pages). JSON-LD and llms.txt read them from here so every surface spells
 * them the same way. The registered office address is still unconfirmed and
 * is deliberately absent — do not add one here until it is.
 */
export const COMPANY = {
  legalName: "주식회사 어크로스",
  tradeName: "Across Inc.",
  ceo: "이재홍",
  registrationNumber: "288-86-03687",
  email: "ask@across.center",
  sameAs: [
    "https://www.youtube.com/@acrosshouse",
    "https://www.instagram.com/across.house",
  ],
} as const;

/** BCP-47 language tags for each supported locale (used by JSON-LD / og:locale). */
export const LANGUAGE_TAG: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};

/** OpenGraph locale codes (underscore form) for each supported locale. */
export const OG_LOCALE: Record<string, string> = {
  ko: "ko_KR",
  en: "en_US",
  ja: "ja_JP",
  zh: "zh_CN",
};

/**
 * Build the locale-prefixed path for a given route + locale, honoring
 * next-intl's `localePrefix: "as-needed"` (default locale `ko` has no prefix).
 */
function localizedPath(locale: string, path: string): string {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  if (locale === routing.defaultLocale) return clean || "/";
  return `/${locale}${clean}`;
}

/**
 * Build `alternates` (canonical + hreflang languages + x-default) for a page.
 * `path` is the locale-agnostic route, e.g. "/", "/contents".
 */
export function buildAlternates(
  locale: string,
  path: string = "/"
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[LANGUAGE_TAG[l] ?? l] = `${SITE_URL}${localizedPath(l, path)}`;
  }
  languages["x-default"] = `${SITE_URL}${localizedPath(
    routing.defaultLocale,
    path
  )}`;

  return {
    canonical: `${SITE_URL}${localizedPath(locale, path)}`,
    languages,
  };
}
