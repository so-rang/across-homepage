import { useTranslations } from "next-intl";
import { CountUp } from "@/components/motion/count-up";

type MetricId = "aiModel" | "learning" | "customers" | "multilingual";

const METRICS: { id: MetricId; to: number; suffix: string }[] = [
  { id: "aiModel", to: 10, suffix: "" },
  { id: "learning", to: 400, suffix: "+" },
  { id: "customers", to: 200, suffix: "+" },
  { id: "multilingual", to: 18, suffix: "" },
];

export function HomeScaleStrip() {
  const t = useTranslations("home.scale");
  return (
    <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-border-subtle pt-10 lg:grid-cols-4">
      {METRICS.map((m, i) => (
        <div key={m.id} className="flex flex-col gap-2">
          <dt className="font-display text-[40px] font-semibold leading-none tracking-[-0.02em] text-text sm:text-[52px] lg:text-[60px]">
            <CountUp to={m.to} suffix={m.suffix} delay={i * 120} />
          </dt>
          <dd>
            <p className="text-[15px] font-medium tracking-[0.01em] text-text">
              {t(`${m.id}.unit`)}
            </p>
            <p className="mt-1 text-[13px] leading-[1.55] text-text-muted">
              {t(`${m.id}.detail`)}
            </p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
