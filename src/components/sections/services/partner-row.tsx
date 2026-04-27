import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PARTNERS, type Partner, type PartnerId } from "@/lib/partners";
import { cn } from "@/lib/utils";

const HEIGHT: Record<PartnerId, string> = {
  hkgpto: "h-5",
  medigpto: "h-8",
  customereye: "h-6",
};

const BASE_CARD =
  "group flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-elev-1 px-6 py-5 transition-all duration-[var(--d-base)] ease-[var(--ease-snap)]";

function PartnerMark({ partner }: { partner: Partner }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src={partner.logo.src}
        alt={partner.name}
        width={partner.logo.width}
        height={partner.logo.height}
        className={cn(
          `${HEIGHT[partner.id]} w-auto max-w-[120px] object-contain object-left`,
          partner.logo.className
        )}
      />
      <span className="text-sm text-text-muted">×</span>
      <span className="text-lg font-black tracking-[0.08em] text-text">
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
      <div>
        <div className="mb-3 flex h-14 items-center justify-between gap-3">
          <PartnerMark partner={partner} />
          {partner.href ? (
            <ExternalLink
              aria-hidden
              className="h-3.5 w-3.5 shrink-0 text-text-muted transition-colors duration-[var(--d-base)] ease-[var(--ease-snap)] group-hover:text-signal-blue"
            />
          ) : null}
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
          {tagline}
        </p>
      </div>
      <p className="mt-2 text-[14px] leading-[1.55] text-text-muted">{blurb}</p>
    </>
  );

  if (partner.href) {
    return (
      <a
        href={partner.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${BASE_CARD} hover:-translate-y-1 hover:border-signal-blue hover:bg-bg-elev-2`}
      >
        {body}
      </a>
    );
  }

  return <div className={BASE_CARD}>{body}</div>;
}

export function PartnerRow() {
  const t = useTranslations("home.partnerRow");
  return (
    <section className="mt-16 border-t border-border-subtle pt-10">
      <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
        {t("heading")}
      </h3>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
