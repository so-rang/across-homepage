import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Partner = {
  name: string;
  tagline: string;
  blurb: string;
  href?: string;
  logo: {
    src: string;
    width: number;
    height: number;
    heightClass: string;
    className?: string;
  };
};

const PARTNERS: Partner[] = [
  {
    name: "한경GPTO",
    tagline: "한국경제 × 어크로스",
    blurb: "한경 권위 콘텐츠로 B2B 브랜드를 AI 답변에 심습니다.",
    href: "https://www.hkgpto.com",
    logo: {
      src: "/logo/hkgpto_hk.svg",
      width: 80,
      height: 20,
      heightClass: "h-4",
      className: "dark:brightness-0 dark:invert",
    },
  },
  {
    name: "MediGPTO",
    tagline: "메디고라운드 × 어크로스",
    blurb: "병원·의료 특화 GEO로 지역 AI 추천을 선점합니다.",
    href: "https://medigpto.com",
    logo: {
      src: "/logo/medi_trans_logo.png",
      width: 750,
      height: 728,
      heightClass: "h-7",
    },
  },
  {
    name: "고객의눈 GPTO",
    tagline: "김팀장 × 어크로스",
    blurb: "전문가·자영업의 AI 추천 목록 진입을 설계합니다.",
    href: "https://client-gpto.com",
    logo: {
      src: "/logo/client_eye_logo.png",
      width: 508,
      height: 136,
      heightClass: "h-5",
      className: "-mr-2 -translate-y-px",
    },
  },
];

const BASE_CARD =
  "group flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-elev-1 px-5 py-4 transition-all duration-[var(--d-base)] ease-[var(--ease-snap)]";

function PartnerMark({ partner }: { partner: Partner }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src={partner.logo.src}
        alt={partner.name}
        width={partner.logo.width}
        height={partner.logo.height}
        className={cn(
          `${partner.logo.heightClass} w-auto max-w-[100px] object-contain object-left`,
          partner.logo.className
        )}
      />
      <span className="text-xs text-text-muted">×</span>
      <span className="text-base font-black tracking-[0.08em] text-text">
        GPTO
      </span>
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  const body = (
    <>
      <div className="mb-2 flex h-10 items-center justify-between gap-3">
        <PartnerMark partner={partner} />
        {partner.href ? (
          <ExternalLink
            aria-hidden
            className="h-3.5 w-3.5 shrink-0 text-text-muted transition-colors duration-[var(--d-base)] ease-[var(--ease-snap)] group-hover:text-signal-blue"
          />
        ) : null}
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-text-muted">
        {partner.tagline}
      </p>
      <p className="mt-2 text-[13px] leading-[1.55] text-text-muted">
        {partner.blurb}
      </p>
    </>
  );

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BASE_CARD} hover:-translate-y-0.5 hover:border-signal-blue hover:bg-bg-elev-2`}
      >
        {body}
      </a>
    );
  }

  return <div className={BASE_CARD}>{body}</div>;
}

export function HomePartnerRow() {
  return (
    <section className="mt-10 border-t border-border-subtle pt-8">
      <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">
        파트너 서비스
      </h3>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((partner) => (
          <li key={partner.name}>
            <PartnerCard partner={partner} />
          </li>
        ))}
      </ul>
    </section>
  );
}
