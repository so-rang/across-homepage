import { useTranslations } from "next-intl";
import Image from "next/image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const ACHIEVEMENT_IDS = ["book", "demoDay", "talks", "consulting"] as const;

export function CeoSection() {
  const t = useTranslations("about.ceo");
  return (
    <section
      id="ceo"
      className="home-snap-section flex min-h-dvh flex-col justify-center py-24 sm:py-32"
    >
      <ScrollReveal distance={16}>
        <h2 className="mb-8 text-[32px] font-medium leading-[1.4] tracking-[0.01em] text-text sm:text-[44px] sm:leading-[1.3] lg:text-[56px]">
          {t("title")}
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[280px_1fr]">
        <ScrollReveal axis="x" distance={24}>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border-subtle bg-bg-elev-1">
            <Image
              src="/profile/01 - 0325.jpg"
              alt={t("photoAlt")}
              fill
              sizes="(min-width: 768px) 280px, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </ScrollReveal>
        <ScrollReveal distance={20} delay={0.15}>
          <blockquote className="font-serif text-[28px] font-medium italic leading-[1.4] tracking-[0.01em] text-text sm:text-[36px]">
            <span aria-hidden className="mr-2 text-text-muted">
              “
            </span>
            {t("quote")}
            <span aria-hidden className="ml-2 text-text-muted">
              ”
            </span>
          </blockquote>
          <p className="mt-8 text-lg font-medium tracking-[0.01em]">
            {t("name")}
          </p>
          <p className="mt-1 text-sm text-text-muted">{t("role")}</p>
          <div className="mt-6 max-w-[580px] space-y-6 text-[17px] leading-[1.75] text-text-muted">
            <p>
              {t.rich("bio", {
                br: () => <br />,
              })}
            </p>
            <ul className="space-y-1 text-[15px] leading-[1.65]">
              {ACHIEVEMENT_IDS.map((id) => (
                <li key={id} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.7em] h-1 w-1 flex-none rounded-full bg-text-muted"
                  />
                  <span>
                    {t.rich(`achievements.${id}`, {
                      cite: (chunks) => (
                        <cite className="not-italic text-text">{chunks}</cite>
                      ),
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
