import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  OWNED_PRODUCTS,
  type ProductId,
} from "@/lib/owned-products";
import { cn } from "@/lib/utils";

const LOGO_CLASS: Record<ProductId, string> = {
  gpto: "h-14",
  genrank:
    "font-[family-name:var(--font-cormorant)] text-[36px] font-medium leading-[0.85] tracking-[-0.015em] text-text",
  naeo: "h-7",
};

export function OwnCards() {
  const t = useTranslations("home.ownCards");
  return (
    <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {OWNED_PRODUCTS.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={s.name}
            className="group flex h-full flex-col rounded-2xl border border-border-subtle bg-bg-elev-1 px-6 py-5 transition-all duration-[var(--d-base)] ease-[var(--ease-snap)] hover:-translate-y-1 hover:border-signal-blue hover:bg-bg-elev-2"
          >
            <div>
              <div className="mb-3 flex h-14 items-center justify-between gap-3">
                {s.logo.kind === "image" ? (
                  <Image
                    src={s.logo.src}
                    alt={s.name}
                    width={s.logo.width}
                    height={s.logo.height}
                    className={cn(
                      LOGO_CLASS[s.id],
                      "w-auto max-w-full object-contain object-left",
                      s.logo.whiteOnDark && "brightness-0 dark:brightness-100"
                    )}
                  />
                ) : (
                  <span className={LOGO_CLASS[s.id]}>{s.logo.text}</span>
                )}
                <ExternalLink
                  aria-hidden
                  className="h-3.5 w-3.5 shrink-0 text-text-muted transition-colors duration-[var(--d-base)] ease-[var(--ease-snap)] group-hover:text-signal-blue"
                />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted">
                {t(`${s.id}.tagline`)}
              </p>
            </div>
            <p className="mt-2 text-[14px] leading-[1.55] text-text-muted">
              {t(`${s.id}.blurb`)}
            </p>
          </a>
        </li>
      ))}
    </ul>
  );
}
