import localFont from "next/font/local";
import { Noto_Serif_KR } from "next/font/google";

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

  ⚠️ `Noto_Serif_KR` below stays on `next/font/google` and remains exposed to
     this failure. It is Korean: Google splits it into 372 unicode-range
     chunks, which is what keeps the payload sane. Vendoring it would mean one
     multi-megabyte file per weight, or subsetting to the exact glyphs in the
     copy — which silently breaks the moment the copy is edited. Neither trade
     is worth it for one blockquote face that already falls back through
     "Nanum Myeongjo" / "AppleMyungjo" in `globals.css`.
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

/**
 * Noto Serif KR — Korean 명조체 for editorial quotes (e.g. CEO blockquote).
 */
export const notoSerifKr = Noto_Serif_KR({
  variable: "--font-serif-kr",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
  preload: false,
});
