import localFont from "next/font/local";
import {
  Cormorant_Garamond,
  JetBrains_Mono,
  Noto_Serif_KR,
} from "next/font/google";

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
export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  preload: false,
});

/**
 * Cormorant Garamond — classical serif wordmarks (e.g. GenRank).
 */
export const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
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
