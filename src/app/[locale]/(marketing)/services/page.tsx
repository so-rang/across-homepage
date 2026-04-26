import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/brand/page-header";
import { ZoomOutGesture } from "@/components/nav/zoom-out-gesture";
import { OwnCards } from "@/components/sections/services/own-cards";
import { PartnerRow } from "@/components/sections/services/partner-row";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services.metadata");
  return {
    title: "Services",
    description: t("description"),
  };
}

export default function ServicesPage() {
  const t = useTranslations("services");
  return (
    <>
      <ZoomOutGesture backHref="/" />
      <PageHeader />
      <main className="mx-auto max-w-[1200px] px-6 pb-32 pt-20 sm:px-10">
        <header className="mb-12 max-w-[720px]">
          <h1 className="text-[40px] font-medium leading-[1.25] tracking-[-0.01em] sm:text-[56px]">
            Services
          </h1>
          <p className="mt-4 text-[17px] leading-[1.65] text-text-muted">
            {t("subtitle")}
          </p>
        </header>
        <OwnCards />
        <PartnerRow />
      </main>
    </>
  );
}
