import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const LAST_UPDATED = "2026-04-23";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.terms.metadata");
  return {
    title: t("title"),
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage() {
  const t = await getTranslations("legal.terms");
  const userObligations = t.raw("userObligations.items") as string[];

  return (
    <article className="mx-auto max-w-[760px] px-6 py-20 sm:px-10">
      <header className="mb-10">
        <h1 className="font-display text-[32px] font-light leading-[1.3] tracking-[0.01em] sm:text-[44px]">
          {t("title")}
        </h1>
        <p className="mt-3 font-mono text-sm text-text-muted">
          {t("lastUpdatedLabel")} {LAST_UPDATED}
        </p>
      </header>

      <div className="prose-across">
        <h2>{t("purpose.title")}</h2>
        <p>{t("purpose.body")}</p>

        <h2>{t("service.title")}</h2>
        <p>{t("service.body")}</p>

        <h2>{t("userObligations.title")}</h2>
        <ul>
          {userObligations.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2>{t("ip.title")}</h2>
        <p>{t("ip.body")}</p>

        <h2>{t("disclaimer.title")}</h2>
        <p>{t("disclaimer.body")}</p>

        <h2>{t("governingLaw.title")}</h2>
        <p>{t("governingLaw.body")}</p>

        <h2>{t("amendment.title")}</h2>
        <p>{t("amendment.body", { date: LAST_UPDATED })}</p>
      </div>
    </article>
  );
}
