import Image from "next/image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

const INVESTORS = [
  {
    name: "Primer",
    src: "/logo/primer_logo.png",
    width: 691,
    height: 201,
    /** Primer's wordmark ships in brand navy — show as-is in both modes. */
    whiteOnDark: false,
  },
  {
    name: "해시드",
    src: "/logo/hashed_logo.png",
    width: 1862,
    height: 472,
    /** Hashed asset is pure white on transparent; darken to ink in light. */
    whiteOnDark: true,
  },
] as const;

const PARTNERS = [
  {
    name: "한국경제",
    field: "경제 미디어",
    src: "/logo/hkgpto_hk.svg",
    width: 80,
    height: 20,
    /** Navy SVG — light: original navy / dark: invert to white. */
    invertOnDark: true,
    /** Wordmark — scale down so wordmark aligns with icon-heavy logos. */
    heightClass: "h-5 sm:h-6",
  },
  {
    name: "메디고라운드",
    field: "헬스케어 플랫폼",
    src: "/logo/medi_trans_logo.png",
    width: 750,
    height: 728,
    /** Colorful triangle mark — render as-is in both modes. */
    invertOnDark: false,
    heightClass: "h-8 sm:h-9",
  },
  {
    name: "김팀장",
    field: "전문가 네트워크",
    src: "/logo/client_eye_logo.png",
    width: 508,
    height: 136,
    /** 고객의눈 purple pill — render as-is in both modes. */
    invertOnDark: false,
    heightClass: "h-8 sm:h-9",
  },
] as const;

export function PartnersClientsSection() {
  return (
    <section id="partners" className="scroll-mt-24 py-24 sm:py-32">
      <ScrollReveal distance={16}>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          Ecosystem
        </p>
        <h2 className="mb-6 text-[32px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[44px] lg:text-[56px]">
          어크로스를 선택한 이름들
        </h2>
        <p className="mb-16 max-w-[640px] text-[17px] leading-[1.75] text-text-muted">
          자본과 현장, 두 축에서 같은 결정을 내렸습니다.
          <br />
          AI 답변 시대를 먼저 움직이는 투자사와 파트너가 어크로스와 함께합니다.
        </p>
      </ScrollReveal>

      <ScrollReveal axis="x" distance={24} staggerChildren stagger={0.18}>
        <div className="space-y-12">
          <div data-reveal-item>
            <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.24em] text-text-muted">
              Backed by
            </h3>
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-6">
              {INVESTORS.map((inv) => (
                <li key={inv.name} className="h-8 sm:h-9">
                  <Image
                    src={inv.src}
                    alt={inv.name}
                    width={inv.width}
                    height={inv.height}
                    className={cn(
                      "h-full w-auto opacity-80 transition-opacity hover:opacity-100",
                      inv.whiteOnDark && "brightness-0 dark:brightness-100"
                    )}
                    sizes="(min-width: 640px) 180px, 140px"
                  />
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal-item className="border-t border-border-subtle pt-10">
            <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.24em] text-text-muted">
              Partners
            </h3>
            <ul className="flex flex-wrap items-center gap-x-12 gap-y-8">
              {PARTNERS.map((p) => (
                <li
                  key={p.name}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div
                    className={cn(
                      "flex items-center justify-center",
                      p.heightClass
                    )}
                  >
                    <Image
                      src={p.src}
                      alt={p.name}
                      width={p.width}
                      height={p.height}
                      className={cn(
                        "h-full w-auto max-w-[160px] object-contain opacity-90 transition-opacity hover:opacity-100",
                        p.invertOnDark && "dark:brightness-0 dark:invert"
                      )}
                      sizes="(min-width: 640px) 160px, 130px"
                    />
                  </div>
                  <p className="text-xs text-text-muted">
                    <span className="font-medium text-text">{p.name}</span>
                    <span className="mx-1.5">·</span>
                    {p.field}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
