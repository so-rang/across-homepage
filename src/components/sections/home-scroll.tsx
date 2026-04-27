import { useTranslations } from "next-intl";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { BackToTop } from "@/components/nav/back-to-top";
import { CeoSection } from "@/components/sections/about/ceo-section";
import { MarketShiftSection } from "@/components/sections/about/market-shift-section";
import { MethodSection as AboutMethodSection } from "@/components/sections/about/method-section";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { HomeContentsSlider } from "@/components/sections/home-contents-slider";
import { HomeOwnCards } from "@/components/sections/home-own-cards";
import { HomePartnerRow } from "@/components/sections/home-partner-row";
import { HomePartnersStrip } from "@/components/sections/home-partners-strip";
import { HomeScaleStrip } from "@/components/sections/home-scale-strip";
import { Toaster } from "@/components/ui/sonner";

const fullSectionClass =
  "home-snap-section relative flex min-h-dvh items-center px-6 sm:px-10 lg:px-20";

const h2Class =
  "text-[30px] font-medium leading-[1.3] tracking-[-0.02em] text-text [word-break:keep-all] sm:text-[40px] sm:leading-[1.25] lg:text-[52px] lg:leading-[1.2]";

const leadClass =
  "mt-8 max-w-[620px] text-[17px] font-normal leading-[1.85] tracking-[0.01em] text-text-muted sm:text-[18px]";

const quietClass =
  "mt-10 inline-flex items-center gap-2 border-b border-border-strong pb-1 text-[15px] font-normal tracking-[0.01em] text-text transition-colors hover:border-text";

const eyebrowClass =
  "mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted";

export function HomeScroll() {
  const t = useTranslations("home");
  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="relative z-10">
        {/* #about — Position landmark + absorbed About deep-dive blocks.
         * No `to-bg` gradient floor here: it created a visible seam at the
         * boundary with the next block (MarketShift) since the rest of the
         * single-page narrative reads on the layout's Stage / DawnSky. The
         * Earth video already feathers out via its own mask. */}
        <section
          id="about"
          aria-labelledby="home-position"
          className={fullSectionClass}
        >
          <div className="relative mx-auto w-full max-w-[1200px]">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16">
              <ScrollReveal>
                <p className={eyebrowClass}>{t("position.eyebrow")}</p>
                <h2 id="home-position" className={h2Class}>
                  {t("position.titleLine1")}
                  <br />
                  {t("position.titleLine2")}
                </h2>
                <p className={leadClass}>
                  {t.rich("position.lead", {
                    nowrap: (chunks) => (
                      <span className="whitespace-nowrap">{chunks}</span>
                    ),
                  })}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1} axis="x" distance={24}>
                <div className="across-glyph-halo justify-self-start md:justify-self-end">
                  <span
                    role="img"
                    aria-label={t("position.logoAlt")}
                    className="across-mark block aspect-[589/758] h-28 bg-white/85 light:bg-black/85 md:h-40 lg:h-52"
                  />
                  <div aria-hidden className="across-glyph-ambient-shimmer" />
                  <div aria-hidden className="across-glyph-shimmer" />
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.15}>
              <HomeScaleStrip />
            </ScrollReveal>
          </div>
        </section>

        {/* About deep-dive — merged from /about. Free-flow (non-snap) so the
         * reader can move through the table, the 3-step method, and the CEO
         * bio without forced section locking. */}
        <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-20">
          <MarketShiftSection />
          <AboutMethodSection />
          <CeoSection />
        </div>

        {/* Partners + investors — credibility cap on the About arc, set
         * before Services so the trust signal arrives ahead of the offer. */}
        <section aria-labelledby="home-partners" className={fullSectionClass}>
          <div className="mx-auto w-full max-w-[1200px]">
            <ScrollReveal>
              <p className={eyebrowClass}>{t("partners.eyebrow")}</p>
              <h2 id="home-partners" className={h2Class}>
                {t("partners.titleLine1")}
                <br />
                {t("partners.titleLine2")}
              </h2>
              <p className={leadClass}>{t("partners.lead")}</p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <HomePartnersStrip />
            </ScrollReveal>
          </div>
        </section>

        {/* #services — Own products + partner row. */}
        <section
          id="services"
          aria-labelledby="home-method"
          className={fullSectionClass}
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <ScrollReveal>
              <p className={eyebrowClass}>{t("method.eyebrow")}</p>
              <h2 id="home-method" className={h2Class}>
                {t("method.title")}
              </h2>
              <p className={leadClass}>
                {t("method.leadLine1")}
                <br />
                {t("method.leadLine2")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15} className="mt-10">
              <HomeOwnCards />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <HomePartnerRow />
            </ScrollReveal>
          </div>
        </section>

        {/* #contents — Latest records preview. The full archive lives at
         * /contents because posts keep accumulating. */}
        <section
          id="contents"
          aria-labelledby="home-practice"
          className={fullSectionClass}
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_420px] md:items-center md:gap-10 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-16">
              <div>
                <ScrollReveal>
                  <p className={eyebrowClass}>{t("practice.eyebrow")}</p>
                  <h2 id="home-practice" className={h2Class}>
                    {t("practice.titleLine1")}
                    <br />
                    {t("practice.titleLine2")}
                  </h2>
                  <p className={leadClass}>
                    {t("practice.leadLine1")}
                    <br />
                    {t("practice.leadLine2")}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={0.25}>
                  <Link href="/contents" className={quietClass}>
                    {t("cta.viewContents")} <span aria-hidden>→</span>
                  </Link>
                </ScrollReveal>
              </div>

              <ScrollReveal
                delay={0.15}
                axis="x"
                distance={24}
                className="md:mt-6 md:-ml-6 lg:mt-10 lg:-ml-12"
              >
                <HomeContentsSlider />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* #contact — Invitation + inline form. Footer shares the viewport. */}
        <section
          id="contact"
          aria-labelledby="home-invitation"
          className="home-snap-section relative flex min-h-dvh flex-col"
        >
          <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10 sm:py-20 lg:px-20">
            <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
              <ScrollReveal>
                <p className={eyebrowClass}>{t("invitation.eyebrow")}</p>
                <h2 id="home-invitation" className={h2Class}>
                  {t("invitation.titleLine1")}
                  <br />
                  {t("invitation.titleLine2")}
                </h2>
                <p className={leadClass}>{t("invitation.lead")}</p>
                <a
                  href="mailto:ask@across.center"
                  className="mt-10 inline-flex items-center gap-2 font-mono text-sm tracking-[0.02em] text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                >
                  <span aria-hidden className="text-signal-blue/80">↗</span>
                  ask@across.center
                </a>
              </ScrollReveal>

              <ScrollReveal delay={0.1} axis="x" distance={24}>
                <ContactForm />
              </ScrollReveal>
            </div>
          </div>
          <Footer />
        </section>
      </div>

      <BackToTop />
    </>
  );
}
