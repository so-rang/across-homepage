import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const LAST_UPDATED = "2026-04-23";
const OFFICE_ADDRESS = "[B05 — 본점 도로명 주소 (juso.go.kr 확정 후 반영)]";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legal.privacy.metadata");
  return {
    title: t("title"),
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("legal.privacy");
  const itemLines = t.raw("items.lines") as string[];
  const purposeLines = t.raw("purpose.lines") as string[];
  const processorLines = t.raw("processors.lines") as string[];

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
        <p>{t("intro")}</p>

        <h2>{t("items.title")}</h2>
        <ul>
          {itemLines.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2>{t("purpose.title")}</h2>
        <ul>
          {purposeLines.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2>{t("retention.title")}</h2>
        <p>
          {t.rich("retention.body", {
            emphasis: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        <h2>{t("thirdParty.title")}</h2>
        <p>{t("thirdParty.body")}</p>

        <h2>{t("processors.title")}</h2>
        <ul>
          {processorLines.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2>{t("rights.title")}</h2>
        <p>
          {t.rich("rights.body", {
            email: (chunks) => (
              <a href="mailto:ask@across.center">{chunks}</a>
            ),
          })}
        </p>

        <h2>{t("security.title")}</h2>
        <p>{t("security.body")}</p>

        <h2>{t("company.title")}</h2>
        <ul>
          <li>
            {t("company.labels.name")}: {t("company.values.name")}
          </li>
          <li>
            {t("company.labels.ceo")}: {t("company.values.ceo")}
          </li>
          <li>
            {t("company.labels.registrationNumber")}:{" "}
            {t("company.values.registrationNumber")}
          </li>
          <li>
            {t("company.labels.address")}: {OFFICE_ADDRESS}
          </li>
          <li>
            {t("company.labels.email")}:{" "}
            <a href="mailto:ask@across.center">ask@across.center</a>
          </li>
        </ul>

        <h2>{t("amendment.title")}</h2>
        <p>{t("amendment.body", { date: LAST_UPDATED })}</p>
      </div>
    </article>
  );
}
