import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/brand/page-header";
import { SnapScroll } from "@/components/nav/snap-scroll";
import { ZoomOutGesture } from "@/components/nav/zoom-out-gesture";
import { AcrossSection } from "@/components/sections/about/across-section";
import { CeoSection } from "@/components/sections/about/ceo-section";
import { CtaSection } from "@/components/sections/about/cta-section";
import { MarketShiftSection } from "@/components/sections/about/market-shift-section";
import { MethodSection } from "@/components/sections/about/method-section";
import { PartnersClientsSection } from "@/components/sections/about/partners-clients-section";
import { ScaleSection } from "@/components/sections/about/scale-section";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about.metadata");
  return {
    title: "About",
    description: t("description"),
  };
}

export default function AboutPage() {
  return (
    <>
      <SnapScroll />
      <ZoomOutGesture backHref="/" />
      <PageHeader />
      <main className="mx-auto max-w-[1200px] px-6 pb-32 sm:px-10">
        <AcrossSection />
        <MarketShiftSection />
        <ScaleSection />
        <MethodSection />
        <CeoSection />
        <PartnersClientsSection />
        <CtaSection />
      </main>
    </>
  );
}
