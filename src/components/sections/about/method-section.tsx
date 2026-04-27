import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type StepId = "diagnose" | "strategy" | "execute";

const STEPS: { id: StepId; num: string }[] = [
  { id: "diagnose", num: "01" },
  { id: "strategy", num: "02" },
  { id: "execute", num: "03" },
];

export function MethodSection() {
  const t = useTranslations("about.method");
  return (
    <section
      id="method"
      className="home-snap-section flex min-h-dvh flex-col justify-center py-24 sm:py-32"
    >
      <ScrollReveal distance={16}>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          {t("eyebrow")}
        </p>
        <h2 className="mb-6 text-[32px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[44px] lg:text-[56px]">
          {t("title")}
        </h2>
        <div className="mb-14 space-y-3 text-[17px] leading-[1.75] text-text-muted">
          <p className="lg:whitespace-nowrap">{t("leadLine1")}</p>
          <p className="lg:whitespace-nowrap">{t("leadLine2")}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal axis="x" distance={28} staggerChildren stagger={0.18}>
        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.id}
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
                {t(`steps.${s.id}.title`)}
              </h3>
              <p className="text-[15px] leading-[1.75] text-text-muted">
                {t(`steps.${s.id}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </ScrollReveal>
    </section>
  );
}
