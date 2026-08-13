import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /*
          `/admin` is a publicly reachable login screen carrying a Google
          sign-in button, on a domain registered 2026-04. That shape — branded
          credential entry on a young low-reputation TLD — is what phishing
          classifiers score, and it has no reason to be in anyone's crawl
          surface. `admin/layout.tsx` already sends `noindex`; that keeps it out
          of the index but not out of the fetch, so the two work together.

          This is hygiene, not a remedy: security crawlers are free to ignore
          robots.txt, so do not treat this line as protection against a
          Safe Browsing listing.
        */
        disallow: "/admin",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
