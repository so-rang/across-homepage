import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("errors.notFound");
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-md">
        <p className="font-mono text-sm text-text-muted">{t("code")}</p>
        <h1 className="mt-4 text-3xl font-light tracking-[0.01em] lg:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-text-muted">{t("description")}</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full border border-border-subtle px-6 py-3 text-sm transition hover:border-border-strong"
        >
          {t("home")}
        </Link>
      </div>
    </main>
  );
}
