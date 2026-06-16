import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSupabaseSession } from "@/lib/supabase/proxy";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_PUBLIC_PATHS = ["/admin/login", "/admin/auth/callback"];

// Locale-segment metadata image routes (app/[locale]/opengraph-image.tsx etc).
// next-intl's as-needed prefix would 307-redirect the default-locale variant
// (/ko/opengraph-image → /opengraph-image), which some link-preview crawlers
// (e.g. KakaoTalk) refuse to follow — breaking the shared thumbnail. Serve
// these prerendered routes directly so og:image/twitter:image return 200.
const LOCALE_METADATA_FILE = /^\/(?:ko|en|ja|zh)\/(?:opengraph-image|twitter-image)\/?$/;

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (LOCALE_METADATA_FILE.test(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const { response, user } = await updateSupabaseSession(request);

    if (ADMIN_PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
      return response;
    }

    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
    "/admin/:path*",
  ],
};
