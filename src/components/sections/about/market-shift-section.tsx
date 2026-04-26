import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type RowId = "target" | "kpi" | "content" | "competition";

const ROW_IDS: RowId[] = ["target", "kpi", "content", "competition"];

export function MarketShiftSection() {
  const t = useTranslations("about.marketShift");
  return (
    <section id="shift" className="scroll-mt-24 py-24 sm:py-32">
      <ScrollReveal distance={16}>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          {t("eyebrow")}
        </p>
        <h2 className="mb-6 text-[32px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[44px] lg:text-[56px]">
          {t("title")}
        </h2>
        <p className="mb-12 max-w-[680px] text-[17px] leading-[1.75] text-text-muted">
          {t("leadLine1")}
          <br />
          {t("leadLine2")}
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
              {t("tableHeader.seo")}
            </div>
            <div className="px-4 py-4 text-sm font-medium text-text sm:px-6 sm:py-5">
              {t("tableHeader.geo")}
            </div>
          </div>
          {ROW_IDS.map((id, i) => (
            <div
              key={id}
              data-reveal-item
              className={`grid grid-cols-[120px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] ${
                i !== ROW_IDS.length - 1 ? "border-b border-border-subtle" : ""
              }`}
            >
              <div className="bg-bg-elev-1 px-4 py-5 text-xs uppercase tracking-[0.2em] text-text-muted sm:px-6 sm:py-6">
                {t(`rows.${id}.axis`)}
              </div>
              <div className="px-4 py-5 text-[15px] leading-[1.6] text-text-muted sm:px-6 sm:py-6 sm:text-[16px]">
                {t(`rows.${id}.seo`)}
              </div>
              <div className="px-4 py-5 text-[15px] leading-[1.6] text-text sm:px-6 sm:py-6 sm:text-[16px]">
                {t(`rows.${id}.geo`)}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal distance={12} delay={0.2}>
        <p className="mt-10 text-[17px] leading-[1.75] text-text">
          {t.rich("closing", {
            em: (chunks) => <span className="font-medium">{chunks}</span>,
          })}
        </p>
      </ScrollReveal>
    </section>
  );
}
