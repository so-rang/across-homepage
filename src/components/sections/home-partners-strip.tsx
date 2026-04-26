import { useTranslations } from "next-intl";
import Image from "next/image";
import { cn } from "@/lib/utils";

const INVESTORS = [
  {
    name: "Primer",
    src: "/logo/primer_logo.png",
    width: 691,
    height: 201,
  },
  {
    name: "Hashed",
    src: "/logo/hashed_logo.png",
    width: 1862,
    height: 472,
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
}[] = [
  {
    id: "hankyung",
    src: "/logo/hkgpto_hk.svg",
    width: 80,
    height: 20,
    invertOnDark: true,
    imageClass: "!h-5 sm:!h-6",
    boxClass: "",
  },
  {
    id: "medigoround",
    src: "/logo/medi_trans_logo.png",
    width: 750,
    height: 728,
    invertOnDark: false,
    imageClass: "object-center",
    boxClass: "justify-center w-full",
  },
  {
    id: "kimteamlead",
    src: "/logo/client_eye_logo.png",
    width: 508,
    height: 136,
    invertOnDark: false,
    imageClass: "",
    boxClass: "",
  },
];

export function HomePartnersStrip() {
  const t = useTranslations("home.partnersStrip");
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
                className="h-full w-auto opacity-80 brightness-0 transition-opacity hover:opacity-100 dark:invert"
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
          {PARTNERS.map((p) => {
            const name = t(`${p.id}.name`);
            return (
              <li key={p.id} className="flex flex-col items-start gap-2">
                <div className={cn("flex h-7 items-center sm:h-8", p.boxClass)}>
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
                </div>
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
  );
}
