import type { Metadata } from "next";
import { PageHeader } from "@/components/brand/page-header";
import { ZoomOutGesture } from "@/components/nav/zoom-out-gesture";
import { OwnCards } from "@/components/sections/services/own-cards";
import { PartnerRow } from "@/components/sections/services/partner-row";

export const metadata: Metadata = {
  title: "Services",
  description:
    "자체 솔루션 GPTO·GenRank·NAEO와 파트너 서비스 한경GPTO·MediGPTO·고객의눈 GPTO.",
};

export default function ServicesPage() {
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
            어크로스가 직접 운영하는 프로덕트와, 파트너와 함께 만든 솔루션
          </p>
        </header>
        <OwnCards />
        <PartnerRow />
      </main>
    </>
  );
}
