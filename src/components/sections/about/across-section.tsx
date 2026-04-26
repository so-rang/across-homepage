import { useTranslations } from "next-intl";
import Link from "next/link";

export function AcrossSection() {
  const t = useTranslations("about.across");
  return (
    <section
      id="across"
      className="flex min-h-[100svh] scroll-mt-24 flex-col justify-center py-24 sm:py-32"
    >
      <Link
        href="/"
        aria-label={t("homeAria")}
        className="mb-10 inline-block self-center transition-opacity hover:opacity-100 focus-visible:opacity-100"
      >
        <span
          role="img"
          aria-label={t("logoAlt")}
          className="across-mark block aspect-[589/758] h-20 bg-white/85 light:bg-black/85 sm:h-24 lg:h-28"
        />
      </Link>
      <h2 className="mb-8 text-[32px] font-medium leading-[1.4] tracking-[0.01em] text-text sm:text-[44px] sm:leading-[1.3] lg:text-[56px]">
        {t("title")}
      </h2>
      <div className="space-y-6 text-[17px] leading-[1.75] text-text-muted">
        <p className="max-w-[680px]">{t("p1")}</p>
        <p className="whitespace-normal lg:whitespace-nowrap">{t("p2")}</p>
      </div>
    </section>
  );
}
