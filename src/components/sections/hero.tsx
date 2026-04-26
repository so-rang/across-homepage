import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { EarthBackdrop } from "@/components/background/earth-backdrop";
import { HeroStars } from "@/components/background/hero-stars";
import { ScrollAcrossMark } from "@/components/brand/scroll-across-mark";
import { ConstellationHint } from "@/components/intro/constellation-hint";
import { IntroRunner } from "@/components/intro/intro-runner";
import { HeroFade } from "@/components/motion/hero-fade";
import { HomeSnap } from "@/components/motion/home-snap";
import { Constellation } from "@/components/nav/constellation";
import { ScrollMinimap } from "@/components/nav/scroll-minimap";
import { HomeScroll } from "@/components/sections/home-scroll";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Per-character shimmer stagger.
 * Each glyph in the H1 lights up briefly in sequence after the intro,
 * giving the impression of one beam of light traveling letter by letter
 * through the whole title. `Array.from` (not `text.split("")`) handles
 * Hangul and any future surrogate-pair characters correctly.
 */
const HERO_CHAR_STAGGER_MS = 50;

function renderShimmerChars(text: string, startIndex: number) {
  return Array.from(text).map((ch, i) => (
    <span
      key={i}
      className="hero-char"
      style={
        {
          "--char-delay": `${(startIndex + i) * HERO_CHAR_STAGGER_MS}ms`,
        } as CSSProperties
      }
    >
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

/**
 * Hero + scroll narrative layout.
 * Hero is a plain h-dvh section — no sticky pin. As the user scrolls, the
 * whole Hero dissolves (HeroFade ScrollTrigger) and the next screen fades
 * in underneath, so the transition feels like a cross-dissolve instead of
 * a dark panel sliding up over the hero.
 */
export function Hero() {
  const t = useTranslations("home.hero");
  const titleLine1 = t("titleLine1");
  const titleLine2 = t("titleLine2");
  const titleLine3 = t("titleLine3");
  const line1Length = Array.from(titleLine1).length;
  const line2Length = Array.from(titleLine2).length;
  return (
    <>
      <IntroRunner />
      <HomeSnap />
      <ConstellationHint />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[48] h-[18vh] bg-gradient-to-b from-bg via-bg/80 to-transparent supports-backdrop-filter:backdrop-blur-md"
      />
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-4 py-5 sm:py-6 sm:pl-5 sm:pr-10 lg:pl-8 lg:pr-16">
        <ScrollAcrossMark />
        <div className="flex items-center gap-3 sm:gap-5">
          <ScrollMinimap />
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </header>

      <HeroFade>
        <section
          aria-labelledby="hero-title"
          className="home-snap-section relative h-dvh"
        >
          <EarthBackdrop />
          <HeroStars />

          <div className="relative z-20 mx-auto grid h-full max-w-[1200px] grid-cols-1 items-start gap-12 px-6 pb-24 pt-24 sm:px-10 sm:pt-28 md:grid-cols-2 md:gap-10 md:pt-32 lg:grid-cols-[3fr_2fr] lg:gap-16 lg:pt-36">
            <div className="relative mt-[4vh] md:mt-[12vh] lg:mt-[18vh]">
              <p
                data-intro-item="eyebrow"
                className="mb-5 text-[13px] font-medium tracking-[0.16em] text-text-muted [word-break:keep-all] sm:mb-6 sm:text-[15px] sm:tracking-[0.18em]"
              >
                <span className="text-text">{t("eyebrowBrand")}</span>
                <span className="mx-2 hidden text-text-muted/60 sm:inline">·</span>
                <br className="sm:hidden" />
                {t("eyebrowTagline")}
              </p>
              <h1
                id="hero-title"
                className="origin-left text-[27px] font-normal leading-[1.65] tracking-[0.02em] text-text sm:text-[34px] lg:text-[46px] lg:leading-[1.55]"
                style={{ transform: "scaleX(1.04)" }}
              >
                <span data-intro-item="copy-1" className="inline-block">
                  {renderShimmerChars(titleLine1, 0)}
                </span>
                <br />
                <span data-intro-item="copy-2" className="inline-block">
                  {renderShimmerChars(titleLine2, line1Length)}
                </span>
                <br />
                <span data-intro-item="copy-3" className="inline-block">
                  {renderShimmerChars(titleLine3, line1Length + line2Length)}
                </span>
              </h1>
            </div>

            <div className="relative h-[280px] w-full sm:h-[420px] lg:ml-8 lg:h-[520px]">
              <Constellation />
            </div>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-text-muted"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.28em]">
              Scroll
            </span>
            <span className="h-8 w-px bg-gradient-to-b from-text-muted/70 to-transparent motion-safe:animate-pulse" />
          </div>
        </section>
      </HeroFade>

      <HomeScroll />
    </>
  );
}
