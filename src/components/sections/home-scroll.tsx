import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { BackToTop } from "@/components/nav/back-to-top";
import { HomeContentsSlider } from "@/components/sections/home-contents-slider";
import { HomeOwnCards } from "@/components/sections/home-own-cards";
import { HomePartnerRow } from "@/components/sections/home-partner-row";
import { HomePartnersStrip } from "@/components/sections/home-partners-strip";
import { HomeScaleStrip } from "@/components/sections/home-scale-strip";

/**
 * Scroll-revealed story beats beneath the Hero.
 * Each content section surfaces real material from its corresponding
 * subpage (About / Services / Contents) so visitors get the gist without
 * drilling in. The snap sections use `items-start` with generous top
 * padding so richer content aligns to the viewport top when snapped.
 */
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
  return (
    <>
      <div className="relative z-10">
        {/* Screen 2 — Position + Scale proof */}
        <section aria-labelledby="home-position" className={fullSectionClass}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-bg"
          />
          <div className="relative mx-auto w-full max-w-[1200px]">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-16">
              <ScrollReveal>
                <p className={eyebrowClass}>About · Across</p>
                <h2 id="home-position" className={h2Class}>
                  어크로스는 AI 답변 최적화
                  <br />
                  GEO·AEO 회사입니다
                </h2>
                <p className={leadClass}>
                  검색의 시대가 답의 시대로 바뀌는 지금, AI가 브랜드를 어떻게
                  부르고 선택하는지를 설계합니다. 자체 프로덕트를 직접 운영하고,
                  파트너 프로덕트에{" "}
                  <span className="whitespace-nowrap">
                    핵심 기술을 공급합니다.
                  </span>
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1} axis="x" distance={24}>
                <div className="across-glyph-halo justify-self-start md:justify-self-end">
                  <Image
                    src="/logo/across_logo_cream.png"
                    alt="어크로스 로고"
                    width={589}
                    height={758}
                    priority
                    className="block h-28 w-auto opacity-95 brightness-0 dark:brightness-100 md:h-40 lg:h-52"
                  />
                  <div aria-hidden className="across-glyph-shimmer" />
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.15}>
              <HomeScaleStrip />
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <Link href="/about" className={quietClass}>
                회사 자세히 보기 <span aria-hidden>→</span>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Screen 3 — Services: own products */}
        <section aria-labelledby="home-method" className={fullSectionClass}>
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
              <ScrollReveal>
                <p className={eyebrowClass}>Services · Own products</p>
                <h2 id="home-method" className={h2Class}>
                  AI 답변 속 브랜드 전략
                </h2>
                <p className={leadClass}>
                  등장을 추적하고, 순위를 읽고, 한국어와 산업의 맥락을 맞춥니다.
                  <br />
                  자체 프로덕트가 각자의 자리를 맡습니다.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.1} className="md:pb-1">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 border-b border-border-strong pb-1 text-[15px] font-normal tracking-[0.01em] text-text transition-colors hover:border-text"
                >
                  서비스 자세히 보기 <span aria-hidden>→</span>
                </Link>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.15} className="mt-10">
              <HomeOwnCards />
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <HomePartnerRow />
            </ScrollReveal>
          </div>
        </section>

        {/* Screen 4 — Contents: latest records */}
        <section aria-labelledby="home-practice" className={fullSectionClass}>
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
              <ScrollReveal>
                <p className={eyebrowClass}>Contents · Latest</p>
                <h2 id="home-practice" className={h2Class}>
                  어크로스는 이렇게
                  <br />
                  세상과 만나고 있습니다
                </h2>
                <p className={leadClass}>
                  우리가 보는 것, 바깥이 우리를 담는 것.
                  <br />
                  블로그, 뉴스, 영상으로 만나실 수 있습니다.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.25} className="md:pb-1">
                <Link href="/contents" className={quietClass}>
                  콘텐츠 자세히 보기 <span aria-hidden>→</span>
                </Link>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.15} className="mt-10">
              <HomeContentsSlider />
            </ScrollReveal>
          </div>
        </section>

        {/* Screen 5 — Partners & investors. */}
        <section aria-labelledby="home-partners" className={fullSectionClass}>
          <div className="mx-auto w-full max-w-[1200px]">
            <ScrollReveal>
              <p className={eyebrowClass}>Ecosystem · Backed & trusted</p>
              <h2 id="home-partners" className={h2Class}>
                함께 기준을
                <br />
                세우는 사람들
              </h2>
              <p className={leadClass}>
                자본과 전략, 두 축에서 어크로스를 신뢰하는 파트너들이 AI 답변
                최적화의 기준을 함께 만들고 있습니다.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <HomePartnersStrip />
            </ScrollReveal>

            <ScrollReveal delay={0.25}>
              <Link href="/about#partners" className={quietClass}>
                파트너·투자사 자세히 보기 <span aria-hidden>→</span>
              </Link>
            </ScrollReveal>
          </div>
        </section>

        {/* Screen 6 — Invitation + Footer sharing one viewport. */}
        <section
          aria-labelledby="home-invitation"
          className="home-snap-section relative flex min-h-dvh flex-col"
        >
          <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10 sm:py-20 lg:px-20">
            <div className="mx-auto w-full max-w-[1100px]">
              <ScrollReveal>
                <p className={eyebrowClass}>Contact · Work with us</p>
                <h2 id="home-invitation" className={h2Class}>
                  제안을 기다리고 있습니다
                  <br />
                  빠르게 답장드립니다
                </h2>
                <p className={leadClass}>
                  제품 도입과 파트너십, 미디어 취재, 채용 문의를 환영합니다.
                  간단히 이메일로 보내 주셔도 좋습니다.
                </p>
                <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-3 rounded-full border border-text-muted/70 px-8 py-4 text-[15px] font-normal tracking-[0.02em] text-text transition-colors hover:border-text hover:bg-bg-elev-1"
                  >
                    문의 보내기
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href="mailto:ask@across.center"
                    className="font-mono text-sm tracking-[0.02em] text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                  >
                    ask@across.center
                  </a>
                </div>
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
