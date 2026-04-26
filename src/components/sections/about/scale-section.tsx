import { CountUp } from "@/components/motion/count-up";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const METRICS = [
  {
    to: 10,
    suffix: "",
    unit: "AI 모델",
    detail: "글로벌 5 + 중국 5, 매주 API 모니터링",
  },
  {
    to: 400,
    suffix: "+",
    unit: "학습 사이트",
    detail: "AI가 학습하는 신뢰도 높은 배포 네트워크",
  },
  {
    to: 200,
    suffix: "+",
    unit: "고객사",
    detail: "국내외 성과 데이터 투명 관리",
  },
  {
    to: 18,
    suffix: "",
    unit: "다국어",
    detail: "한국어·영어·중국어·일본어 포함",
  },
] as const;

const INDUSTRIES = [
  "리테일",
  "헬스케어",
  "미디어",
  "F&B",
  "금융",
  "테크",
] as const;

export function ScaleSection() {
  return (
    <section id="scale" className="scroll-mt-24 py-24 sm:py-32">
      <ScrollReveal distance={16}>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          Scale
        </p>
        <h2 className="mb-14 text-[32px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[44px] lg:text-[56px]">
          숫자로 보는 어크로스
        </h2>
      </ScrollReveal>

      <ScrollReveal axis="x" distance={24} staggerChildren stagger={0.14}>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <div key={m.unit} data-reveal-item className="flex flex-col gap-3">
              <dt className="font-display text-[56px] font-semibold leading-none tracking-[-0.02em] text-text sm:text-[72px] lg:text-[84px]">
                <CountUp to={m.to} suffix={m.suffix} delay={i * 140} />
              </dt>
              <dd>
                <p className="text-base font-medium tracking-[0.01em] text-text">
                  {m.unit}
                </p>
                <p className="mt-1 text-sm leading-[1.6] text-text-muted">
                  {m.detail}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </ScrollReveal>

      <ScrollReveal distance={12} delay={0.3}>
        <div className="mt-14 flex flex-col gap-4 border-t border-border-subtle pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-text-muted">
            주요 고객 산업
          </p>
          <ul className="flex flex-wrap gap-2">
            {INDUSTRIES.map((i) => (
              <li
                key={i}
                className="rounded-full border border-border-subtle px-3 py-1.5 text-sm text-text-muted"
              >
                {i}
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}
