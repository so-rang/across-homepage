import { useTranslations } from "next-intl";
import { AcrossMark } from "@/components/brand/across-mark";
import { Link } from "@/i18n/navigation";

/**
 * Global footer — rendered on all marketing + article + legal routes.
 */
export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="relative z-30 border-t border-border-subtle bg-transparent dark:bg-bg">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-10 text-text-muted sm:px-10 md:grid-cols-[1fr_auto] md:items-end lg:px-20">
        <div>
          <AcrossMark />
          <dl className="mt-3 space-y-0.5 text-sm">
            <dt className="sr-only">{t("companyInfoLabel")}</dt>
            <dd>{t("companyLine")}</dd>
            <dd>
              <a href="mailto:ask@across.center" className="hover:text-text">
                ask@across.center
              </a>
            </dd>
          </dl>
        </div>

        <div className="flex flex-col gap-4 md:items-end md:text-right">
          <nav aria-label={t("navLabel")}>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <li><Link href="/#about" className="hover:text-text">About</Link></li>
              <li><Link href="/#services" className="hover:text-text">Services</Link></li>
              <li><Link href="/contents" className="hover:text-text">Contents</Link></li>
              <li><Link href="/#contact" className="hover:text-text">Contact</Link></li>
            </ul>
          </nav>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <li><Link href="/terms" className="hover:text-text">{t("terms")}</Link></li>
            <li><Link href="/privacy" className="hover:text-text">{t("privacy")}</Link></li>
          </ul>
          <p className="text-[11px] tracking-[0.02em]">
            © {new Date().getFullYear()} Across Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}
