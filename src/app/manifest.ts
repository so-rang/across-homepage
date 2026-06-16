import type { MetadataRoute } from "next";

// Web App Manifest — improves "Add to Home Screen", mobile chrome, and is a
// positive signal for mobile/PWA classification. Icons reuse the file-convention
// routes (icon.svg vector + apple-icon raster).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Across — AI Answer Optimization",
    short_name: "Across",
    description:
      "Across Inc. — Answer & Generative Engine Optimization (AEO·GEO).",
    start_url: "/",
    display: "standalone",
    background_color: "#04040a",
    theme_color: "#04040a",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
