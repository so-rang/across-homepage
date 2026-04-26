import { useTranslations } from "next-intl";
import Image from "next/image";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
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
  heightClass: string;
}[] = [
  {
    id: "hankyung",
    src: "/logo/hkgpto_hk.svg",
    width: 80,
    height: 20,
    invertOnDark: true,
    heightClass: "h-5 sm:h-6",
  },
  {
    id: "medigoround",
    src: "/logo/medi_trans_logo.png",
    width: 750,
    height: 728,
    invertOnDark: false,
    heightClass: "h-8 sm:h-9",
  },
  {
    id: "kimteamlead",
    src: "/logo/client_eye_logo.png",
    width: 508,
    height: 136,
    invertOnDark: false,
    heightClass: "h-8 sm:h-9",
  },
];

export function PartnersClientsSection() {
  const t = useTranslations("about.partnersClients");
  return (
    <section id="partners" className="scroll-mt-24 py-24 sm:py-32">
      <ScrollReveal distance={16}>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          {t("eyebrow")}
        </p>
        <h2 className="mb-6 text-[32px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[44px] lg:text-[56px]">
          {t("title")}
        </h2>
        <p className="mb-16 max-w-[640px] text-[17px] leading-[1.75] text-text-muted">
          {t("leadLine1")}
          <br />
          {t("leadLine2")}
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
                    className="h-full w-auto opacity-80 brightness-0 transition-opacity hover:opacity-100 dark:invert"
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
              {PARTNERS.map((p) => {
                const name = t(`items.${p.id}.name`);
                return (
                  <li
                    key={p.id}
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
                        alt={name}
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
                      <span className="font-medium text-text">{name}</span>
                      <span className="mx-1.5">·</span>
                      {t(`items.${p.id}.field`)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
