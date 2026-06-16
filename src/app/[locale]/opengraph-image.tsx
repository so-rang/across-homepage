import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Across — AI Answer Optimization (AEO · GEO)";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Brand A-mark (icon.svg paths) rendered in Warm Cream, embedded as a data URI
// so Satori renders it as a plain <img> — no remote fetch, no font dependency.
const MARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<path fill="#f3ecde" d="M 47.5 14.9 L 36.84 51.03 L 23.9 86.4 L 34.56 50.27 Z"/>` +
    `<path fill="#f3ecde" d="M 47.5 14.9 L 62.72 50.21 L 75.7 86.4 L 60.48 51.09 Z"/>` +
    `<path fill="#f3ecde" d="M 62.5 31.3 L 63.4 54.2 L 61.3 84.0 L 61.6 54.2 Z"/>` +
    `<path fill="#f3ecde" d="M 47.4 54.2 L 62.5 53.5 L 80.1 54.2 L 62.5 54.9 Z"/>` +
    `</svg>`
)}`;

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const description = t("description");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(1100px 700px at 78% 12%, #14203f 0%, #070a16 55%, #04040a 100%)",
          color: "#f3ecde",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <img src={MARK_DATA_URI} width={96} height={96} alt="" />
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "0.14em",
            }}
          >
            ACROSS
          </div>
        </div>

        {/* Middle: tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: 60,
              fontWeight: 600,
              lineHeight: 1.18,
              maxWidth: 1000,
              letterSpacing: "-0.01em",
            }}
          >
            AI Answer Optimization
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              maxWidth: 980,
              color: "rgba(243,236,222,0.62)",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom: chips + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            {["AEO", "GEO", "AI SEO"].map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: "#9dc5d9",
                  border: "1px solid rgba(157,197,217,0.4)",
                  borderRadius: 999,
                  padding: "8px 24px",
                }}
              >
                {chip}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "rgba(243,236,222,0.85)",
            }}
          >
            across.cx
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
