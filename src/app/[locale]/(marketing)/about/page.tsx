import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "About",
  description:
    "어크로스는 GEO·AEO(AI 답변 최적화) 회사입니다. 검색의 시대에서 AI 답변의 시대로. 대표·투자사·파트너 정보를 소개합니다.",
};

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
