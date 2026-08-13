import localFont from "next/font/local";

/*
  Why the latin faces are vendored instead of pulled from `next/font/google`
  ─────────────────────────────────────────────────────────────────────────
  `next/font/google` resolves the gstatic URLs at build time and Next caches
  that resolution. Google rotated the JetBrains Mono files, the cached URLs
  went 404, and production failed to build on 2026-08-13:

    requested  tDbv2o-…yKwBNntkaToggR7BYaTNPx7cwgknk-6nFg.woff2  → 404
    current    tDbY2o-…                                          → 200

  `--force` cleared it, but only until the next rotation. Vendoring removes
  the build-time dependency on fonts.gstatic.com entirely.

  Both files are the variable font Google itself serves for the latin subset,
  one file per family covering the whole weight range — Google emits separate
  `@font-face` blocks per weight but points them at the same woff2.

  Nothing here reaches out to Google any more. Noto Serif KR used to, and it
  was the last one — see the `--font-serif` comment in `globals.css` for why
  it went. ⛔ Do not reintroduce `next/font/google`: a CJK face here costs
  ~124 build-time fetches and re-arms the failure above.
*/

/**
 * Pretendard Variable — single voice for the entire site.
 * Latin + CJK coverage in one file, weight axis 45–920.
 * Display vs body character comes from weight/size, not family.
 */
export const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
  preload: true,
});

/**
 * JetBrains Mono — numerics / code only. Minimal usage.
 */
export const jetbrainsMono = localFont({
  src: "../../public/fonts/JetBrainsMonoVariable.latin.woff2",
  variable: "--font-jetbrains",
  display: "swap",
  weight: "400 500",
  preload: false,
});

/**
 * Cormorant Garamond — classical serif wordmarks (e.g. GenRank).
 */
export const cormorant = localFont({
  src: "../../public/fonts/CormorantGaramondVariable.latin.woff2",
  variable: "--font-cormorant",
  display: "swap",
  weight: "500 600",
  preload: false,
});
