import { Hero } from "@/components/sections/hero";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://across.center";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "주식회사 어크로스",
  alternateName: "Across Inc.",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/across-mark.svg`,
  email: "ask@across.center",
  sameAs: [
    "https://www.youtube.com/@acrosshouse",
    "https://www.instagram.com/across.house",
  ],
} as const;

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "어크로스",
  url: SITE_URL,
  inLanguage: "ko-KR",
} as const;

export default function HomePage() {
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
