import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PARTNERS, type Partner, type PartnerId } from "@/lib/partners";
import { cn } from "@/lib/utils";

const HEIGHT: Record<PartnerId, string> = {
  hkgpto: "h-4",
  medigpto: "h-7",
  customereye: "h-5",
};

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
          `${HEIGHT[partner.id]} w-auto max-w-[100px] object-contain object-left`,
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

function PartnerCard({
  partner,
  tagline,
  blurb,
}: {
  partner: Partner;
  tagline: string;
  blurb: string;
}) {
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
        {tagline}
      </p>
      <p className="mt-2 text-[13px] leading-[1.55] text-text-muted">{blurb}</p>
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
  const t = useTranslations("home.partnerRow");
  return (
    <section className="mt-10 border-t border-border-subtle pt-8">
      <h3 className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">
        {t("heading")}
      </h3>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNERS.map((partner) => (
          <li key={partner.id}>
            <PartnerCard
              partner={partner}
              tagline={t(`${partner.id}.tagline`)}
              blurb={t(`${partner.id}.blurb`)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
