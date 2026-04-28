import { useTranslations } from "next-intl";
import Image from "next/image";
import { ClientsMarquee } from "@/components/sections/clients-marquee";
import { cn } from "@/lib/utils";

const INVESTORS = [
  {
    name: "Primer",
    src: "/logo/logo_primer.png",
    width: 691,
    height: 201,
    monochrome: false,
    href: "https://primer.kr",
  },
  {
    name: "Hashed",
    src: "/logo/logo_hashed.png",
    width: 1862,
    height: 472,
    monochrome: true,
    href: "https://www.hashed.com",
  },
] as const;

type PartnerId = "hankyung" | "medigoround" | "kimteamlead";

const PARTNERS: {
  id: PartnerId;
  src: string;
  width: number;
  height: number;
  invertOnDark: boolean;
  imageClass: string;
  boxClass: string;
  href: string;
}[] = [
  {
    id: "hankyung",
    src: "/logo/logo_hkgpto_hk.svg",
    width: 80,
    height: 20,
    invertOnDark: false,
    imageClass: "!h-5 sm:!h-6",
    boxClass: "",
    href: "https://www.hankyung.com",
  },
  {
    id: "medigoround",
    src: "/logo/logo_medi_trans.png",
    width: 750,
    height: 728,
    invertOnDark: false,
    imageClass: "object-center",
    boxClass: "justify-center w-full",
    href: "https://medigpto.com",
  },
  {
    id: "kimteamlead",
    src: "/logo/logo_client_eye.png",
    width: 508,
    height: 136,
    invertOnDark: false,
    imageClass: "",
    boxClass: "",
    href: "https://client-eye.com",
  },
];

export function HomePartnersStrip() {
  const t = useTranslations("home.partnersStrip");
  return (
    <div className="mt-14 space-y-10 border-t border-border-subtle pt-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[auto_1fr] lg:gap-x-16">
      <div>
        <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">
          Backed by
        </h3>
        <ul className="flex flex-wrap items-center gap-x-10 gap-y-5">
          {INVESTORS.map((inv) => (
            <li key={inv.name} className="h-7 sm:h-8">
              <a
                href={inv.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={inv.name}
                className="block h-full rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-blue/60"
              >
                <Image
                  src={inv.src}
                  alt={inv.name}
                  width={inv.width}
                  height={inv.height}
                  className={cn(
                    "h-full w-auto opacity-80 transition-opacity hover:opacity-100",
                    inv.monochrome && "brightness-0 dark:invert"
                  )}
                  sizes="(min-width: 640px) 160px, 120px"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:border-l lg:border-border-subtle lg:pl-16">
        <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">
          Partners
        </h3>
        <ul className="flex flex-wrap items-start gap-x-10 gap-y-6">
          {PARTNERS.map((p) => {
            const name = t(`${p.id}.name`);
            return (
              <li key={p.id} className="flex flex-col items-start gap-2">
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className={cn(
                    "flex h-7 items-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-blue/60 sm:h-8",
                    p.boxClass
                  )}
                >
                  <Image
                    src={p.src}
                    alt={name}
                    width={p.width}
                    height={p.height}
                    className={cn(
                      "h-full w-auto max-w-[140px] object-contain object-left opacity-90 transition-opacity hover:opacity-100",
                      p.invertOnDark && "dark:brightness-0 dark:invert",
                      p.imageClass
                    )}
                    sizes="(min-width: 640px) 140px, 110px"
                  />
                </a>
                <p className="text-[11px] leading-[1.5] text-text-muted">
                  <span className="font-medium text-text">{name}</span>
                  <span className="mx-1.5">·</span>
                  {t(`${p.id}.field`)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      </div>

      <div className="border-t border-border-subtle pt-10">
        <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.28em] text-text-muted">
          {t("clients.eyebrow")}
        </h3>
        <ClientsMarquee ariaLabel={t("clients.eyebrow")} />
      </div>
    </div>
  );
}
