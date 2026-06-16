import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/**
 * Canonical production origin. The live site redirects across.cx → www.across.cx,
 * so the www host is the canonical origin for og:url / canonical / sitemap.
 * Override via NEXT_PUBLIC_SITE_URL in the deployment environment.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.across.cx"
).replace(/\/$/, "");

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
