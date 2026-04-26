import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ImageLogo = {
  kind: "image";
  src: string;
  width: number;
  height: number;
  heightClass: string;
  /** White wordmark PNG — darken to ink in light mode, keep white in dark. */
  whiteOnDark?: boolean;
};

type TextLogo = {
  kind: "text";
  text: string;
  className: string;
};

type Service = {
  name: string;
  tagline: string;
  blurb: string;
  href: string;
  logo: ImageLogo | TextLogo;
};

const OWN: Service[] = [
  {
    name: "GPTO",
    tagline: "통합 AEO GEO 플랫폼",
    blurb: "브랜드가 AI 답변에서 어떻게 불리는지 진단하고 개선합니다.",
    href: "https://gpto.kr",
    logo: {
      kind: "image",
      src: "/logo/gpto_logo_white.png",
      width: 9600,
      height: 4000,
      heightClass: "h-10",
      whiteOnDark: true,
    },
  },
  {
    name: "GenRank",
    tagline: "AI 답변 비교",
    blurb: "생성형 AI가 내놓는 답을 모델·시점별로 교차 비교합니다.",
    href: "https://genrank.com",
    logo: {
      kind: "text",
      text: "GenRank",
      className:
        "font-[family-name:var(--font-cormorant)] text-[26px] font-medium leading-[0.85] tracking-[-0.015em] text-text",
    },
  },
  {
    name: "NAEO",
    tagline: "네이버 AI 진단",
    blurb: "네이버 생성형 답변 환경에서의 노출 위치를 분석합니다.",
    href: "https://www.naeo.kr",
    logo: {
      kind: "image",
      src: "/logo/naeo_logo_cutout.png",
      width: 740,
      height: 192,
      heightClass: "h-5",
    },
  },
];

export function HomeOwnCards() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {OWN.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={s.name}
            className="group flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-elev-1 px-5 py-4 transition-all duration-[var(--d-base)] ease-[var(--ease-snap)] hover:-translate-y-0.5 hover:border-signal-blue hover:bg-bg-elev-2"
          >
            <div className="mb-2 flex h-10 items-center justify-between gap-3">
              {s.logo.kind === "image" ? (
                <Image
                  src={s.logo.src}
                  alt={s.name}
                  width={s.logo.width}
                  height={s.logo.height}
                  className={cn(
                    s.logo.heightClass,
                    "w-auto max-w-[140px] object-contain object-left",
                    s.logo.whiteOnDark && "brightness-0 dark:brightness-100"
                  )}
                />
              ) : (
                <span className={s.logo.className}>{s.logo.text}</span>
              )}
              <ExternalLink
                aria-hidden
                className="h-3.5 w-3.5 shrink-0 text-text-muted transition-colors duration-[var(--d-base)] ease-[var(--ease-snap)] group-hover:text-signal-blue"
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
              {s.tagline}
            </p>
            <p className="mt-2 text-[13px] leading-[1.55] text-text-muted">
              {s.blurb}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
