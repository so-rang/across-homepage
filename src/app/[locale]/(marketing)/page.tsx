import { getLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/hero";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://across.center";

const LANGUAGE_TAG: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  zh: "zh-CN",
};

export default async function HomePage() {
  const t = await getTranslations("metadata");
  const locale = await getLocale();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("organizationName"),
    alternateName: "Across Inc.",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/across-mark.svg`,
    email: "ask@across.center",
    sameAs: [
      "https://www.youtube.com/@acrosshouse",
      "https://www.instagram.com/across.house",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: t("websiteName"),
    url: SITE_URL,
    inLanguage: LANGUAGE_TAG[locale] ?? "ko-KR",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Hero />
    </>
  );
}
