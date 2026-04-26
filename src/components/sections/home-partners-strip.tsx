import Image from "next/image";
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
    /** Wordmark reads heavier than the other marks — shrink a notch. */
    imageClass: "!h-5 sm:!h-6",
    boxClass: "",
  },
  {
    name: "메디고라운드",
    field: "헬스케어 플랫폼",
    src: "/logo/medi_trans_logo.png",
    width: 750,
    height: 728,
    /** Colorful triangle mark — render as-is in both modes. */
    invertOnDark: false,
    /** Square mark — center inside its cell instead of left-aligning. */
    imageClass: "object-center",
    boxClass: "justify-center w-full",
  },
  {
    name: "김팀장",
    field: "전문가 네트워크",
    src: "/logo/client_eye_logo.png",
    width: 508,
    height: 136,
    /** 고객의눈 purple pill — render as-is in both modes. */
    invertOnDark: false,
    imageClass: "",
    boxClass: "",
  },
] as const;

export function HomePartnersStrip() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-10 border-t border-border-subtle pt-10 lg:grid-cols-[auto_1fr] lg:gap-x-16">
      <div>
        <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">
          Backed by
        </h3>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
          {INVESTORS.map((inv) => (
            <li key={inv.name} className="h-7 sm:h-8">
              <Image
                src={inv.src}
                alt={inv.name}
                width={inv.width}
                height={inv.height}
                className={cn(
                  "h-full w-auto opacity-80 transition-opacity hover:opacity-100",
                  inv.whiteOnDark && "brightness-0 dark:brightness-100"
                )}
                sizes="(min-width: 640px) 160px, 120px"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:border-l lg:border-border-subtle lg:pl-16">
        <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">
          Partners
        </h3>
        <ul className="flex flex-wrap items-start gap-x-10 gap-y-6">
          {PARTNERS.map((p) => (
            <li key={p.name} className="flex flex-col items-start gap-2">
              <div className={cn("flex h-7 items-center sm:h-8", p.boxClass)}>
                <Image
                  src={p.src}
                  alt={p.name}
                  width={p.width}
                  height={p.height}
                  className={cn(
                    "h-full w-auto max-w-[140px] object-contain object-left opacity-90 transition-opacity hover:opacity-100",
                    p.invertOnDark && "dark:brightness-0 dark:invert",
                    p.imageClass
                  )}
                  sizes="(min-width: 640px) 140px, 110px"
                />
              </div>
              <p className="text-[11px] leading-[1.5] text-text-muted">
                <span className="font-medium text-text">{p.name}</span>
                <span className="mx-1.5">·</span>
                {p.field}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
