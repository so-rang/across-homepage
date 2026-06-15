import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.youtube-nocookie.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.resend.com https://*.supabase.co wss://*.supabase.co",
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow local images with no query (default) AND the ?v=N cache-bust used by
    // the clients marquee (busts stale /_next/image cache when a logo asset's
    // content changes but its path stays the same). Bump in BOTH places together.
    localPatterns: [
      { pathname: "/**" },
      { pathname: "/**", search: "?v=6" },
    ],
    remotePatterns: [
      // YouTube thumbnails ship from i.ytimg.com AND i1-i4.ytimg.com
      // depending on which CDN edge the RSS feed points to.
      { protocol: "https", hostname: "**.ytimg.com" },
      { protocol: "https", hostname: "ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async headers() {
    const longCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable",
      },
    ];
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
      // Earth hero assets — versioned filenames (.v2 / fixed names), so
      // immutable caching is safe. Bump the suffix when re-encoding.
      { source: "/earth_2.v2.mp4", headers: longCache },
      { source: "/earth_2.v2.tablet.mp4", headers: longCache },
      { source: "/earth_2.mobile.mp4", headers: longCache },
      { source: "/earth_2.poster.jpg", headers: longCache },
    ];
  },
};

export default withNextIntl(nextConfig);
