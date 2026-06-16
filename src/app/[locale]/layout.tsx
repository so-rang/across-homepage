import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import {
  cormorant,
  jetbrainsMono,
  notoSerifKr,
  pretendard,
} from "@/app/fonts";
import { routing } from "@/i18n/routing";
import { INTRO_BOOTSTRAP } from "@/lib/motion/intro";
import {
  buildAlternates,
  LANGUAGE_TAG,
  OG_LOCALE,
  SITE_URL,
} from "@/lib/seo/site";
import { THEME_BOOTSTRAP } from "@/lib/theme/bootstrap";
import { cn } from "@/lib/utils";
import "../globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const title = t("title");
  const description = t("description");
  const siteName = t("websiteName");

  return {
    title: {
      default: title,
      template: t("titleTemplate"),
    },
    description,
    metadataBase: new URL(SITE_URL),
    applicationName: siteName,
    alternates: buildAlternates(locale, "/"),
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: buildAlternates(locale, "/").canonical as string,
      locale: OG_LOCALE[locale] ?? "ko_KR",
      alternateLocale: routing.locales
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALE[l] ?? l),
      // og:image is supplied automatically by app/[locale]/opengraph-image.tsx
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // twitter:image is supplied automatically by app/[locale]/twitter-image.tsx
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    },
    other: {
      "content-language": LANGUAGE_TAG[locale] ?? "ko-KR",
    },
  };
}

export const viewport: Viewport = {
  // Matches the app's permanent dark Stage background (globals.css --color-bg).
  themeColor: "#04040a",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "h-full",
        "dark",
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
        <Analytics />
      </body>
    </html>
  );
}
