import { useTranslations } from "next-intl";
import { CountUp } from "@/components/motion/count-up";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type MetricId = "aiModel" | "learning" | "customers" | "multilingual";

const METRICS: { id: MetricId; to: number; suffix: string }[] = [
  { id: "aiModel", to: 10, suffix: "" },
  { id: "learning", to: 400, suffix: "+" },
  { id: "customers", to: 200, suffix: "+" },
  { id: "multilingual", to: 18, suffix: "" },
];

const INDUSTRY_IDS = [
  "retail",
  "healthcare",
  "media",
  "fnb",
  "finance",
  "tech",
] as const;

export function ScaleSection() {
  const t = useTranslations("about.scale");
  return (
    <section id="scale" className="scroll-mt-24 py-24 sm:py-32">
      <ScrollReveal distance={16}>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          {t("eyebrow")}
        </p>
        <h2 className="mb-14 text-[32px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[44px] lg:text-[56px]">
          {t("title")}
        </h2>
      </ScrollReveal>

      <ScrollReveal axis="x" distance={24} staggerChildren stagger={0.14}>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <div key={m.id} data-reveal-item className="flex flex-col gap-3">
              <dt className="font-display text-[56px] font-semibold leading-none tracking-[-0.02em] text-text sm:text-[72px] lg:text-[84px]">
                <CountUp to={m.to} suffix={m.suffix} delay={i * 140} />
              </dt>
              <dd>
                <p className="text-base font-medium tracking-[0.01em] text-text">
                  {t(`metrics.${m.id}.unit`)}
                </p>
                <p className="mt-1 text-sm leading-[1.6] text-text-muted">
                  {t(`metrics.${m.id}.detail`)}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </ScrollReveal>

      <ScrollReveal distance={12} delay={0.3}>
        <div className="mt-14 flex flex-col gap-4 border-t border-border-subtle pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-text-muted">
            {t("industriesLabel")}
          </p>
          <ul className="flex flex-wrap gap-2">
            {INDUSTRY_IDS.map((id) => (
              <li
                key={id}
                className="rounded-full border border-border-subtle px-3 py-1.5 text-sm text-text-muted"
              >
                {t(`industries.${id}`)}
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </section>
  );
}
