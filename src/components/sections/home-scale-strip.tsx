import { CountUp } from "@/components/motion/count-up";

/**
 * Compact scale tiles for the main page's About preview.
 * Mirrors the four proof points from `/about` (ScaleSection) at a tighter
 * scale so they fit alongside the lead copy in a single screen beat.
 */
const METRICS = [
  { to: 10, suffix: "", unit: "AI 모델", detail: "글로벌 5 + 중국 5" },
  { to: 400, suffix: "+", unit: "학습 사이트", detail: "AI가 학습하는 네트워크" },
  { to: 200, suffix: "+", unit: "고객사", detail: "국내외 성과 데이터" },
  { to: 18, suffix: "", unit: "다국어", detail: "한·영·중·일 포함" },
] as const;

export function HomeScaleStrip() {
  return (
    <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border-subtle pt-10 lg:grid-cols-4">
      {METRICS.map((m, i) => (
        <div key={m.unit} className="flex flex-col gap-2">
          <dt className="font-display text-[40px] font-semibold leading-none tracking-[-0.02em] text-text sm:text-[52px] lg:text-[60px]">
            <CountUp to={m.to} suffix={m.suffix} delay={i * 120} />
          </dt>
          <dd>
            <p className="text-[15px] font-medium tracking-[0.01em] text-text">
              {m.unit}
            </p>
            <p className="mt-1 text-[13px] leading-[1.55] text-text-muted">
              {m.detail}
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
