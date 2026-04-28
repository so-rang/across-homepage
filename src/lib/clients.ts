export type ClientId =
  | "altosventures"
  | "ascent"
  | "backpacker"
  | "beautyselection"
  | "bhsn"
  | "bttr"
  | "carrot"
  | "cellmeat"
  | "channeltalk"
  | "cheongyeon"
  | "crowdpic"
  | "deepstudio"
  | "elice"
  | "elysium"
  | "fastcampus"
  | "finda"
  | "gcoo"
  | "granter"
  | "greeting"
  | "heartsaver"
  | "homefit"
  | "imweb"
  | "kakaostyle"
  | "kmong"
  | "listly"
  | "liveanywhere"
  | "lunchlab"
  | "lycle"
  | "makestar"
  | "mathplat"
  | "medistream"
  | "meight"
  | "modusign"
  | "moin"
  | "myrealtrip"
  | "pickle"
  | "pilyze"
  | "plab"
  | "purespace"
  | "rael"
  | "rapportlabs"
  | "saeteuk"
  | "spaceadd"
  | "specter"
  | "spoonlabs"
  | "stipop"
  | "stylemate"
  | "sweetspot"
  | "trazy"
  | "trevari"
  | "ugleelab"
  | "voyagerx"
  | "whatap"
  | "wippy"
  | "wiseapp"
  | "wiselyco";

export type Client = {
  id: ClientId;
  name: string;
  src: string;
  darkSrc: string | null;
  width: number;
  height: number;
  /** Optional explicit pixel height to override aspect-ratio default. */
  displayHeight?: number;
  /** Public homepage; logo becomes a clickable link when set. */
  href?: string;
  /** Apply `invert` filter in dark mode. Use only for monochrome
   *  wordmarks/marks that have no `darkSrc` variant — colored logos
   *  will distort. */
  invertOnDark?: boolean;
  /** Boost brightness/saturation in dark mode for pale-color logos
   *  whose anti-aliased edges blend into a dark background and read
   *  as a darker hue (e.g., light-blue marks shifting to navy). */
  brightenOnDark?: boolean;
};

export const CLIENTS: readonly Client[] = [
  {
    id: "altosventures",
    name: "Altos Ventures",
    src: "/logo/logo_altosventures.png",
    darkSrc: null,
    width: 1000,
    height: 411,
    displayHeight: 50,
    href: "https://altos.vc",
    invertOnDark: true,
  },
  {
    id: "ascent",
    name: "Ascent",
    src: "/logo/logo_ascent.png",
    darkSrc: "/logo/dark/logo_ascent.png",
    width: 640,
    height: 158,
    href: "https://www.ascentkorea.com",
  },
  {
    id: "backpacker",
    name: "Backpackr",
    src: "/logo/logo_backpacker.png",
    darkSrc: "/logo/dark/logo_backpacker.png",
    width: 863,
    height: 152,
    href: "https://team.idus.com",
  },
  {
    id: "beautyselection",
    name: "Beauty Selection",
    src: "/logo/logo_beautyselection.png",
    darkSrc: "/logo/dark/logo_beautyselection.png",
    width: 759,
    height: 167,
    displayHeight: 32,
    href: "https://www.beautyselection.co.kr",
  },
  {
    id: "bhsn",
    name: "BHSN",
    src: "/logo/logo_bhsn.svg",
    darkSrc: null,
    width: 760,
    height: 248,
    href: "https://www.bhsn.ai",
  },
  {
    id: "bttr",
    name: "BTTR",
    src: "/logo/logo_bttr.png",
    darkSrc: null,
    width: 640,
    height: 353,
    displayHeight: 32,
    href: "https://bttr.co.kr",
    brightenOnDark: true,
  },
  {
    id: "carrot",
    name: "Carrot",
    src: "/logo/logo_carrot.svg",
    darkSrc: null,
    width: 850,
    height: 238,
    href: "https://www.carrotins.com",
  },
  {
    id: "cellmeat",
    name: "Cellmeat",
    src: "/logo/logo_cellmeat.png",
    darkSrc: "/logo/dark/logo_cellmeat.png",
    width: 750,
    height: 195,
    href: "https://www.thecellmeat.com",
  },
  {
    id: "channeltalk",
    name: "Channel Talk",
    src: "/logo/logo_channeltalk.png",
    darkSrc: "/logo/dark/logo_channeltalk.png",
    width: 870,
    height: 480,
    displayHeight: 64,
    href: "https://channel.io",
  },
  {
    id: "cheongyeon",
    name: "Cheongyeon",
    src: "/logo/logo_cheongyeon.png",
    darkSrc: null,
    width: 465,
    height: 160,
    href: "https://www.chyeon.com",
  },
  {
    id: "crowdpic",
    name: "Crowdpic",
    src: "/logo/logo_crowdpic.png",
    darkSrc: null,
    width: 484,
    height: 100,
    href: "https://www.crowdpic.net",
    brightenOnDark: true,
  },
  {
    id: "deepstudio",
    name: "Deep Studio",
    src: "/logo/logo_deepstudio.webp",
    darkSrc: "/logo/dark/logo_deepstudio.webp",
    width: 1000,
    height: 319,
    href: "https://www.deepstudio.io",
  },
  {
    id: "elice",
    name: "Elice",
    src: "/logo/logo_elice.png",
    darkSrc: null,
    width: 2000,
    height: 593,
    href: "https://elice.io",
  },
  {
    id: "elysium",
    name: "Elysium",
    src: "/logo/logo_elysium.png",
    darkSrc: null,
    width: 660,
    height: 138,
    href: "https://www.teamelysium.kr/ko",
  },
  {
    id: "fastcampus",
    name: "Fast Campus",
    src: "/logo/logo_fastcampus.avif",
    darkSrc: "/logo/dark/logo_fastcampus.avif",
    width: 864,
    height: 246,
    displayHeight: 42,
    href: "https://fastcampus.co.kr",
  },
  {
    id: "finda",
    name: "Finda",
    src: "/logo/logo_finda.png",
    darkSrc: null,
    width: 555,
    height: 177,
    href: "https://finda.co.kr",
  },
  {
    id: "gcoo",
    name: "Gcoo",
    src: "/logo/logo_gcoo.svg",
    darkSrc: null,
    width: 694,
    height: 168,
    href: "https://gcoo.io",
  },
  {
    id: "granter",
    name: "Granter",
    src: "/logo/logo_granter.png",
    darkSrc: "/logo/dark/logo_granter.png",
    width: 600,
    height: 140,
    href: "https://granter.biz",
  },
  {
    id: "greeting",
    name: "Greeting",
    src: "/logo/logo_greeting.png",
    darkSrc: "/logo/dark/logo_greeting.png",
    width: 961,
    height: 216,
    href: "https://www.greetinghr.com",
  },
  {
    id: "heartsaver",
    name: "Heartsaver",
    src: "/logo/logo_heartsaver.png",
    darkSrc: "/logo/dark/logo_heartsaver.png",
    width: 1136,
    height: 181,
    displayHeight: 22,
    href: "https://heartsaver.kr",
  },
  {
    id: "homefit",
    name: "Homefit",
    src: "/logo/logo_homefit.png",
    darkSrc: "/logo/dark/logo_homefit.png",
    width: 600,
    height: 315,
    displayHeight: 88,
    href: "https://homefit.co.kr",
  },
  {
    id: "imweb",
    name: "Imweb",
    src: "/logo/logo_imweb.png",
    darkSrc: "/logo/dark/logo_imweb.png",
    width: 1280,
    height: 443,
    displayHeight: 44,
    href: "https://imweb.me",
  },
  {
    id: "kakaostyle",
    name: "Kakao Style",
    src: "/logo/logo_kakaostyle.png",
    darkSrc: "/logo/dark/logo_kakaostyle.png",
    width: 898,
    height: 188,
    href: "https://kakaostyle.com",
  },
  {
    id: "kmong",
    name: "Kmong",
    src: "/logo/logo_kmong.png",
    darkSrc: "/logo/dark/logo_kmong.png",
    width: 750,
    height: 253,
    href: "https://kmong.com",
  },
  {
    id: "listly",
    name: "Listly",
    src: "/logo/logo_listly.png",
    darkSrc: null,
    width: 250,
    height: 200,
    displayHeight: 70,
    href: "https://www.listly.io",
  },
  {
    id: "liveanywhere",
    name: "Live Anywhere",
    src: "/logo/logo_liveanywhere.png",
    darkSrc: "/logo/dark/logo_liveanywhere.png",
    width: 2260,
    height: 298,
    href: "https://www.liveanywhere.me",
  },
  {
    id: "lunchlab",
    name: "Lunchlab",
    src: "/logo/logo_lunchlab.png",
    darkSrc: null,
    width: 428,
    height: 118,
    href: "https://www.lunchlab.me",
  },
  {
    id: "lycle",
    name: "Lycle",
    src: "/logo/logo_lycle.png",
    darkSrc: "/logo/dark/logo_lycle.png",
    width: 3080,
    height: 764,
    href: "https://www.lycle.kr",
  },
  {
    id: "makestar",
    name: "Makestar",
    src: "/logo/logo_makestar.png",
    darkSrc: "/logo/dark/logo_makestar.png",
    width: 2728,
    height: 368,
    href: "https://www.makestar.com",
  },
  {
    id: "mathplat",
    name: "Mathplat",
    src: "/logo/logo_mathplat.webp",
    darkSrc: null,
    width: 1000,
    height: 273,
    href: "https://mathflat.com",
  },
  {
    id: "medistream",
    name: "Medistream",
    src: "/logo/logo_medistream.png",
    darkSrc: "/logo/dark/logo_medistream.png",
    width: 320,
    height: 59,
    displayHeight: 28,
    href: "https://medistream.co.kr",
  },
  {
    id: "meight",
    name: "Meight",
    src: "/logo/logo_meight.png",
    darkSrc: "/logo/dark/logo_meight.png",
    width: 800,
    height: 271,
    href: "https://getm8.ai",
  },
  {
    id: "modusign",
    name: "Modusign",
    src: "/logo/logo_modusign.png",
    darkSrc: "/logo/dark/logo_modusign.png",
    width: 835,
    height: 116,
    href: "https://modusign.co.kr",
  },
  {
    id: "moin",
    name: "Moin",
    src: "/logo/logo_moin.ico",
    darkSrc: null,
    width: 64,
    height: 64,
    displayHeight: 36,
    href: "https://www.themoin.com",
  },
  {
    id: "myrealtrip",
    name: "My Real Trip",
    src: "/logo/logo_myrealtrip.png",
    darkSrc: "/logo/dark/logo_myrealtrip.png",
    width: 458,
    height: 183,
    displayHeight: 50,
    href: "https://www.myrealtrip.com",
  },
  {
    id: "pickle",
    name: "Pickle",
    src: "/logo/logo_pickle.png",
    darkSrc: "/logo/dark/logo_pickle.png",
    width: 514,
    height: 163,
    href: "https://pickle.plus",
  },
  {
    id: "pilyze",
    name: "Pilyze",
    src: "/logo/logo_pilyze.png",
    darkSrc: null,
    width: 965,
    height: 253,
    displayHeight: 54,
    href: "https://www.pillyze.com",
  },
  {
    id: "plab",
    name: "Plab",
    src: "/logo/logo_plab.png",
    darkSrc: "/logo/dark/logo_plab.png",
    width: 742,
    height: 329,
    href: "https://plabfootball.com",
  },
  {
    id: "purespace",
    name: "Purespace",
    src: "/logo/logo_purespace.png",
    darkSrc: "/logo/dark/logo_purespace.png",
    width: 960,
    height: 204,
    href: "https://purespace.io",
  },
  {
    id: "rael",
    name: "Rael",
    src: "/logo/logo_rael.avif",
    darkSrc: "/logo/dark/logo_rael.avif",
    width: 256,
    height: 256,
    href: "https://getrael.co.kr",
  },
  {
    id: "rapportlabs",
    name: "Rapport Labs",
    src: "/logo/logo_rapportlabs.png",
    darkSrc: null,
    width: 1000,
    height: 1000,
    displayHeight: 110,
    href: "https://rapportlabs.kr",
  },
  {
    id: "saeteuk",
    name: "Saeteuk",
    src: "/logo/logo_saeteuk.png",
    darkSrc: "/logo/dark/logo_saeteuk.png",
    width: 657,
    height: 123,
    href: "https://www.getwashswat.com",
  },
  {
    id: "spaceadd",
    name: "Space Add",
    src: "/logo/logo_spaceadd.png",
    darkSrc: "/logo/dark/logo_spaceadd.png",
    width: 700,
    height: 190,
    href: "https://spaceadd.com",
  },
  {
    id: "specter",
    name: "Specter",
    src: "/logo/logo_specter.png",
    darkSrc: "/logo/dark/logo_specter.png",
    width: 226,
    height: 86,
    displayHeight: 50,
    href: "https://www.specter.co.kr",
  },
  {
    id: "spoonlabs",
    name: "Spoon Labs",
    src: "/logo/logo_spoonlabs.png",
    darkSrc: "/logo/dark/logo_spoonlabs.png",
    width: 1400,
    height: 232,
    href: "https://www.spoonlabs.com",
  },
  {
    id: "stipop",
    name: "Stipop",
    src: "/logo/logo_stipop.png",
    darkSrc: "/logo/dark/logo_stipop.png",
    width: 1200,
    height: 398,
    displayHeight: 34,
    href: "https://stipop.io",
  },
  {
    id: "stylemate",
    name: "Stylemate",
    src: "/logo/logo_stylemate.png",
    darkSrc: "/logo/dark/logo_stylemate.png",
    width: 935,
    height: 126,
    href: "https://www.stylemate.co.kr",
  },
  {
    id: "sweetspot",
    name: "Sweetspot",
    src: "/logo/logo_sweetspot.png",
    darkSrc: "/logo/dark/logo_sweetspot.png",
    width: 1604,
    height: 693,
    displayHeight: 50,
    href: "https://www.sweetspot.co.kr",
  },
  {
    id: "trazy",
    name: "Trazy",
    src: "/logo/logo_trazy.png",
    darkSrc: "/logo/dark/logo_trazy.png",
    width: 601,
    height: 282,
    displayHeight: 46,
    href: "https://www.trazy.com",
  },
  {
    id: "trevari",
    name: "Trevari",
    src: "/logo/logo_trevari.png",
    darkSrc: null,
    width: 800,
    height: 144,
    href: "https://trevari.co.kr",
  },
  {
    id: "ugleelab",
    name: "Ugleelab",
    src: "/logo/logo_ugleelab.png",
    darkSrc: "/logo/dark/logo_ugleelab.png",
    width: 779,
    height: 198,
    href: "https://www.sugeo.onl",
  },
  {
    id: "voyagerx",
    name: "VoyagerX",
    src: "/logo/logo_voyagerx.png",
    darkSrc: "/logo/dark/logo_voyagerx.png",
    width: 440,
    height: 56,
    displayHeight: 24,
    href: "https://www.voyagerx.com",
  },
  {
    id: "whatap",
    name: "Whatap",
    src: "/logo/logo_whatap.png",
    darkSrc: null,
    width: 637,
    height: 224,
    displayHeight: 50,
    href: "https://whatap.io",
  },
  {
    id: "wippy",
    name: "Wippy",
    src: "/logo/logo_wippy.png",
    darkSrc: "/logo/dark/logo_wippy.png",
    width: 800,
    height: 587,
    displayHeight: 44,
    href: "https://wippy.io",
  },
  {
    id: "wiseapp",
    name: "Wiseapp",
    src: "/logo/logo_wiseapp.png",
    darkSrc: null,
    width: 201,
    height: 32,
    displayHeight: 18,
    href: "https://www.wiseapp.co.kr",
  },
  {
    id: "wiselyco",
    name: "Wisely",
    src: "/logo/logo_wiselyco.png",
    darkSrc: "/logo/dark/logo_wiselyco.png",
    width: 1875,
    height: 500,
    displayHeight: 34,
    href: "https://wiselycompany.com",
  },
];
