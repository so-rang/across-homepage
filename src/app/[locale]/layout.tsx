import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  cormorant,
  jetbrainsMono,
  notoSerifKr,
  pretendard,
} from "@/app/fonts";
import { routing } from "@/i18n/routing";
import { INTRO_BOOTSTRAP } from "@/lib/motion/intro";
import { THEME_BOOTSTRAP, THEME_COOKIE_KEY } from "@/lib/theme/bootstrap";
import { cn } from "@/lib/utils";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: {
      default: t("title"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://across.center"
    ),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get(THEME_COOKIE_KEY)?.value;
  const theme = themeCookie === "light" ? "light" : "dark";

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "h-full",
        theme,
        pretendard.variable,
        jetbrainsMono.variable,
        cormorant.variable,
        notoSerifKr.variable
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-full font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
