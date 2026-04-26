import { ScrollReveal } from "@/components/motion/scroll-reveal";

const STEPS = [
  {
    num: "01",
    title: "진단",
    body: "귀사 산업의 목표 질문을 설계하고, 10대 AI 모델이 어떻게 답하는지를 측정합니다. 자사·경쟁사 언급률과 맥락을 숫자로 꺼냅니다.",
  },
  {
    num: "02",
    title: "전략",
    body: "진단 결과를 바탕으로 최적화 방향과 예상 성과, 타임라인을 설계합니다. 감이 아닌 데이터로 다음 6개월의 지도를 만듭니다.",
  },
  {
    num: "03",
    title: "실행",
    body: "AI 학습이 잘 되는 네트워크에 최적화된 콘텐츠를 배포하고, 매주 모니터링하며 지속적으로 개선합니다.",
  },
] as const;

export function MethodSection() {
  return (
    <section id="method" className="scroll-mt-24 py-24 sm:py-32">
      <ScrollReveal distance={16}>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          Method
        </p>
        <h2 className="mb-6 text-[32px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[44px] lg:text-[56px]">
          AI가 당신을 말하게 만드는 방법
        </h2>
        <div className="mb-14 space-y-3 text-[17px] leading-[1.75] text-text-muted">
          <p className="lg:whitespace-nowrap">
            진단 · 전략 · 실행. 세 단계를 반복하며 AI 답변 속 위치를 만듭니다.
          </p>
          <p className="lg:whitespace-nowrap">
            감이 아닌 데이터로, AI가 당신을 선택하는 이유를 쌓습니다.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal axis="x" distance={28} staggerChildren stagger={0.18}>
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.num}
              data-reveal-item
              className="relative flex flex-col gap-4 pt-8"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-full bg-border-subtle"
              />
              <div className="flex items-baseline justify-between">
                <span className="font-display text-[40px] font-light leading-none text-text">
                  {s.num}
                </span>
                {i !== STEPS.length - 1 ? (
                  <span aria-hidden className="text-text-muted sm:text-lg">
                    →
                  </span>
                ) : null}
              </div>
              <h3 className="text-[22px] font-medium tracking-[0.01em] text-text sm:text-[26px]">
                {s.title}
              </h3>
              <p className="text-[15px] leading-[1.75] text-text-muted">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </ScrollReveal>
    </section>
  );
}
