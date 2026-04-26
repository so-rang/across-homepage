import { ScrollReveal } from "@/components/motion/scroll-reveal";

const ROWS = [
  { axis: "최적화 대상", seo: "Google 알고리즘", geo: "AI 모델 (ChatGPT · Claude · Gemini 등)" },
  { axis: "성과 지표", seo: "키워드 순위, CTR", geo: "AI 인용 빈도, 브랜드 언급률" },
  { axis: "콘텐츠 전략", seo: "키워드 밀도, 백링크", geo: "Semantic HTML, Schema, 권위성 콘텐츠" },
  { axis: "경쟁 구도", seo: "10개 결과 안에서 경쟁", geo: "AI가 선택하는 소수의 브랜드" },
] as const;

export function MarketShiftSection() {
  return (
    <section id="shift" className="scroll-mt-24 py-24 sm:py-32">
      <ScrollReveal distance={16}>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          Market shift
        </p>
        <h2 className="mb-6 text-[32px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[44px] lg:text-[56px]">
          노출의 시대에서, 선택의 시대로
        </h2>
        <p className="mb-12 max-w-[680px] text-[17px] leading-[1.75] text-text-muted">
          AI가 답을 생성하며 인용되는 구조는 검색 최적화와 전혀 다릅니다.
          <br />
          기준이 바뀌었기에 성과를 만드는 방식도 달라져야 합니다.
        </p>
      </ScrollReveal>

      <ScrollReveal distance={20} staggerChildren stagger={0.08} duration={0.7}>
        <div className="overflow-hidden rounded-2xl border border-border-subtle">
          <div
            data-reveal-item
            className="grid grid-cols-[120px_1fr_1fr] border-b border-border-subtle bg-bg-elev-1 sm:grid-cols-[160px_1fr_1fr]"
          >
            <div className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-text-muted sm:px-6 sm:py-5" />
            <div className="px-4 py-4 text-sm font-medium text-text-muted sm:px-6 sm:py-5">
              SEO
            </div>
            <div className="px-4 py-4 text-sm font-medium text-text sm:px-6 sm:py-5">
              GEO · AEO
            </div>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.axis}
              data-reveal-item
              className={`grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] ${
                i !== ROWS.length - 1 ? "border-b border-border-subtle" : ""
              }`}
            >
              <div className="bg-bg-elev-1 px-4 py-5 text-xs uppercase tracking-[0.2em] text-text-muted sm:px-6 sm:py-6">
                {r.axis}
              </div>
              <div className="px-4 py-5 text-[15px] leading-[1.6] text-text-muted sm:px-6 sm:py-6 sm:text-[16px]">
                {r.seo}
              </div>
              <div className="px-4 py-5 text-[15px] leading-[1.6] text-text sm:px-6 sm:py-6 sm:text-[16px]">
                {r.geo}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal distance={12} delay={0.2}>
        <p className="mt-10 text-[17px] leading-[1.75] text-text">
          SEO는 보여주고,{" "}
          <span className="font-medium">GEO는 선택됩니다.</span>
        </p>
      </ScrollReveal>
    </section>
  );
}
