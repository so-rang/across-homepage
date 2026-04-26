import { useTranslations } from "next-intl";
import Link from "next/link";
import { Footer } from "@/components/footer";

export function CtaSection() {
  const t = useTranslations("about.cta");
  return (
    <section id="cta" className="flex min-h-dvh flex-col">
      <div className="flex flex-1 flex-col justify-center">
        <div className="rounded-3xl border border-border-subtle bg-bg-elev-1 px-8 py-12 sm:px-14 sm:py-16">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
            {t("eyebrow")}
          </p>
          <h2 className="text-[30px] font-medium leading-[1.3] tracking-[0.01em] text-text sm:text-[40px] lg:text-[48px]">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-[580px] text-[17px] leading-[1.75] text-text-muted">
            {t("leadLine1")}
            <br />
            {t("leadLine2")}
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 text-sm font-medium transition-colors hover:bg-bg-elev-2"
            >
              {t("link")} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}
