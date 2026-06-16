import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { buildAlternates, LANGUAGE_TAG, SITE_URL } from "@/lib/seo/site";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { alternates: buildAlternates(locale, "/") };
}

export default async function HomePage() {
  const t = await getTranslations("metadata");
  const locale = await getLocale();

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: t("organizationName"),
    alternateName: "Across Inc.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/logo_across_black.png`,
    image: `${SITE_URL}/opengraph-image`,
    description: t("description"),
    knowsAbout: [
      "Answer Engine Optimization",
      "Generative Engine Optimization",
      "AEO",
      "GEO",
      "AI SEO",
      "LLM visibility",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "ask@across.center",
      contactType: "sales",
      availableLanguage: ["Korean", "English", "Japanese", "Chinese"],
    },
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
    publisher: { "@type": "Organization", name: t("organizationName") },
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
