import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/brand/page-header";
import { ZoomOutGesture } from "@/components/nav/zoom-out-gesture";
import { buildAlternates, LANGUAGE_TAG } from "@/lib/seo/site";

export const revalidate = 300;

type FaqItem = { q: string; a: string };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq");
  const locale = await getLocale();
  const title = t("title");
  const description = t("description");
  return {
    title,
    description,
    alternates: buildAlternates(locale, "/faq"),
    openGraph: {
      title,
      description,
      url: buildAlternates(locale, "/faq").canonical as string,
    },
  };
}

export default async function FaqPage() {
  const t = await getTranslations("faq");
  const locale = await getLocale();
  const items = t.raw("items") as FaqItem[];

  // FAQPage JSON-LD lives on the page whose visible content it mirrors (Google
  // rich-result requirement) — the same Q&A is rendered below.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: LANGUAGE_TAG[locale] ?? "ko-KR",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <ZoomOutGesture backHref="/" />
      <PageHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <main className="mx-auto max-w-[760px] px-6 pb-32 pt-20 sm:px-10">
        <header className="mb-10">
          <h1 className="mb-3 text-[40px] font-medium leading-[1.25] tracking-[-0.01em] sm:text-[56px]">
            {t("title")}
          </h1>
          <p className="text-text-muted">{t("description")}</p>
        </header>

        <dl className="divide-y divide-border-subtle border-y border-border-subtle">
          {items.map((item, i) => (
            <details key={i} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[18px] font-medium outline-none transition-colors hover:text-text focus-visible:ring-2 focus-visible:ring-signal-blue/60 sm:text-[20px]">
                <dt>{item.q}</dt>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <dd className="pb-6 pr-8 text-[15px] leading-[1.7] text-text-muted sm:text-base">
                {item.a}
              </dd>
            </details>
          ))}
        </dl>
      </main>
    </>
  );
}
