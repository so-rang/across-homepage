export type ClientId =
  | "altosventures"
  | "beautyselection"
  | "cellmeat"
  | "cheongyeon"
  | "crowdpic"
  | "elice"
  | "granter"
  | "greeting"
  | "kmong"
  | "liveanywhere"
  | "lunchlab"
  | "lycle"
  | "makestar"
  | "mathplat"
  | "medistream"
  | "meight"
  | "myrealtrip"
  | "pickle"
  | "plab"
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
  | "voyagerx"
  | "whatap"
  | "wippy"
  | "ameli"
  | "artitude"
  | "banlife"
  | "beaurit"
  | "brandazine"
  | "burnfit"
  | "cacheby"
  | "cheotjang"
  | "cinamon"
  | "concept-b"
  | "curapulse"
  | "demadog"
  | "dorosiwa"
  | "drivingteacher"
  | "edusync"
  | "glam"
  | "grayscale"
  | "gyulmedal"
  | "honestseoul"
  | "hookable"
  | "hwang"
  | "karetrip"
  | "kyyb"
  | "langflix"
  | "leesol"
  | "lghello"
  | "livet"
  | "meditherapy"
  | "melting"
  | "mineis"
  | "mongtan"
  | "muinlab"
  | "newndy"
  | "newparadigminvestment"
  | "noblelogis"
  | "novarex"
  | "oneul"
  | "pcpstandard"
  | "penovis"
  | "pomchecker"
  | "savenote"
  | "shortt"
  | "sleepus"
  | "ssupport"
  | "tounou"
  | "uniqlo"
  | "videostew";

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
    src: "/logo/customers/altosventures.webp",
    darkSrc: null,
    width: 1000,
    height: 411,
    displayHeight: 56,
    href: "https://altos.vc",
    invertOnDark: true,
  },
      {
    id: "beautyselection",
    name: "Beauty Selection",
    src: "/logo/customers/beautyselection_bk.png",
    darkSrc: "/logo/customers/beautyselection_wh.png",
    width: 640,
    height: 164,
    displayHeight: 44,
    href: "https://www.beautyselection.co.kr",
  },
        {
    id: "cellmeat",
    name: "Cellmeat",
    src: "/logo/customers/cellmeat_bk.png",
    darkSrc: "/logo/customers/cellmeat_wh.png",
    width: 750,
    height: 195,
    href: "https://www.thecellmeat.com",
  },
    {
    id: "cheongyeon",
    name: "Cheongyeon",
    src: "/logo/customers/chengyeon.png",
    darkSrc: null,
    width: 465,
    height: 160,
    displayHeight: 34,
    href: "https://www.chyeon.com",
  },
  {
    id: "crowdpic",
    name: "Crowdpic",
    src: "/logo/customers/crowdpic.png",
    darkSrc: null,
    width: 484,
    height: 100,
    displayHeight: 32,
    href: "https://www.crowdpic.net",
    brightenOnDark: true,
  },
    {
    id: "elice",
    name: "Elice",
    src: "/logo/customers/elice.png",
    darkSrc: null,
    width: 2000,
    height: 593,
    href: "https://elice.io",
  },
          {
    id: "granter",
    name: "Granter",
    src: "/logo/customers/granter_bk.png",
    darkSrc: "/logo/customers/granter_wh.png",
    width: 600,
    height: 140,
    displayHeight: 34,
    href: "https://granter.biz",
  },
  {
    id: "greeting",
    name: "Greeting",
    src: "/logo/customers/greeting_bk.png",
    darkSrc: "/logo/customers/greeting_wh.png",
    width: 961,
    height: 216,
    href: "https://www.greetinghr.com",
  },
          {
    id: "kmong",
    name: "Kmong",
    src: "/logo/customers/kmong_bk.png",
    darkSrc: "/logo/customers/kmong_wh.png",
    width: 750,
    height: 250,
    displayHeight: 42,
    href: "https://kmong.com",
  },
    {
    id: "liveanywhere",
    name: "Live Anywhere",
    src: "/logo/customers/liveanywhere_bk.png",
    darkSrc: "/logo/customers/liveanywhere_wh.png",
    width: 2260,
    height: 298,
    displayHeight: 26,
    href: "https://www.liveanywhere.me",
  },
  {
    id: "lunchlab",
    name: "Lunchlab",
    src: "/logo/customers/lunchlab.png",
    darkSrc: null,
    width: 428,
    height: 118,
    href: "https://www.lunchlab.me",
  },
  {
    id: "lycle",
    name: "Lycle",
    src: "/logo/customers/lycle_bk.png",
    darkSrc: "/logo/customers/lycle_wh.png",
    width: 3080,
    height: 764,
    displayHeight: 30,
    href: "https://www.lycle.kr",
  },
  {
    id: "makestar",
    name: "Makestar",
    src: "/logo/customers/makestar_bk.png",
    darkSrc: "/logo/customers/makestar_wh.png",
    width: 2810,
    height: 444,
    href: "https://www.makestar.com",
  },
  {
    id: "mathplat",
    name: "Mathplat",
    src: "/logo/customers/mathflat.webp",
    darkSrc: null,
    width: 1000,
    height: 273,
    href: "https://mathflat.com",
  },
  {
    id: "medistream",
    name: "Medistream",
    src: "/logo/customers/medistream_bk.png",
    darkSrc: "/logo/customers/medistream_wh.png",
    width: 2048,
    height: 373,
    href: "https://medistream.co.kr",
  },
  {
    id: "meight",
    name: "Meight",
    src: "/logo/customers/meight_bk.png",
    darkSrc: "/logo/customers/meight_wh.png",
    width: 800,
    height: 271,
    displayHeight: 36,
    href: "https://getm8.ai",
  },
      {
    id: "myrealtrip",
    name: "My Real Trip",
    src: "/logo/customers/myrealtrip_bk.png",
    darkSrc: "/logo/customers/myrealtrip_wh.png",
    width: 458,
    height: 112,
    href: "https://www.myrealtrip.com",
  },
  {
    id: "pickle",
    name: "Pickle",
    src: "/logo/customers/pickle_bk.png",
    darkSrc: "/logo/customers/pickle_wh.png",
    width: 514,
    height: 163,
    displayHeight: 36,
    href: "https://pickle.plus",
  },
    {
    id: "plab",
    name: "Plab",
    src: "/logo/customers/plab_bk.png",
    darkSrc: "/logo/customers/plab_wh.png",
    width: 465,
    height: 214,
    displayHeight: 34,
    href: "https://plabfootball.com",
  },
    {
    id: "rael",
    name: "Rael",
    src: "/logo/customers/rael_bk.avif",
    darkSrc: "/logo/customers/rael_wh.avif",
    width: 256,
    height: 130,
    displayHeight: 42,
    href: "https://getrael.co.kr",
  },
  {
    id: "rapportlabs",
    name: "Rapport Labs",
    src: "/logo/customers/rapportlabs.png",
    darkSrc: null,
    width: 824,
    height: 262,
    displayHeight: 46,
    href: "https://rapportlabs.kr",
  },
  {
    id: "saeteuk",
    name: "Saeteuk",
    src: "/logo/customers/saeteuk_bk.png",
    darkSrc: "/logo/customers/saeteuk_wh.png",
    width: 657,
    height: 123,
    href: "https://www.getwashswat.com",
  },
  {
    id: "spaceadd",
    name: "Space Add",
    src: "/logo/customers/spaceadd_bk.png",
    darkSrc: "/logo/customers/spaceadd_wh.png",
    width: 700,
    height: 177,
    href: "https://spaceadd.com",
  },
  {
    id: "specter",
    name: "Specter",
    src: "/logo/customers/specter_bk.png",
    darkSrc: "/logo/customers/specter_wh.png",
    width: 1044,
    height: 415,
    href: "https://www.specter.co.kr",
  },
  {
    id: "spoonlabs",
    name: "Spoon Labs",
    src: "/logo/customers/spoonlabs_bk.png",
    darkSrc: "/logo/customers/spoonlabs_wh.png",
    width: 1400,
    height: 232,
    href: "https://www.spoonlabs.com",
  },
  {
    id: "stipop",
    name: "Stipop",
    src: "/logo/customers/stipop_bk.png",
    darkSrc: "/logo/customers/stipop_wh.png",
    width: 1200,
    height: 398,
    displayHeight: 40,
    href: "https://stipop.io",
  },
  {
    id: "stylemate",
    name: "Stylemate",
    src: "/logo/customers/stylemate_bk.png",
    darkSrc: "/logo/customers/stylemate_wh.png",
    width: 935,
    height: 126,
    displayHeight: 30,
    href: "https://www.stylemate.co.kr",
  },
  {
    id: "sweetspot",
    name: "Sweetspot",
    src: "/logo/customers/sweetspot_bk.png",
    darkSrc: "/logo/customers/sweetspot_wh.png",
    width: 1576,
    height: 310,
    href: "https://www.sweetspot.co.kr",
  },
  {
    id: "trazy",
    name: "Trazy",
    src: "/logo/customers/trazy.png",
    darkSrc: null,
    width: 182,
    height: 80,
    href: "https://www.trazy.com",
  },
  {
    id: "trevari",
    name: "Trevari",
    src: "/logo/customers/trevari.png",
    darkSrc: null,
    width: 800,
    height: 144,
    displayHeight: 28,
    href: "https://trevari.co.kr",
  },
    {
    id: "voyagerx",
    name: "VoyagerX",
    src: "/logo/customers/voyagerx_bk.png",
    darkSrc: "/logo/customers/voyagerx_wh.png",
    width: 691,
    height: 100,
    displayHeight: 30,
    href: "https://www.voyagerx.com",
  },
  {
    id: "whatap",
    name: "Whatap",
    src: "/logo/customers/whatap.png",
    darkSrc: null,
    width: 473,
    height: 99,
    displayHeight: 36,
    href: "https://whatap.io",
  },
  {
    id: "wippy",
    name: "Wippy",
    src: "/logo/customers/erise.png",
    darkSrc: null,
    width: 800,
    height: 587,
    href: "https://wippy.io",
  },
      {
    id: "ameli",
    name: "Ameli",
    src: "/logo/customers/ameli_bk.png",
    darkSrc: "/logo/customers/ameli_wh.png",
    width: 715,
    height: 232,
    displayHeight: 34,
    href: "https://ameli.co.kr",
  },
  {
    id: "artitude",
    name: "Artitude",
    src: "/logo/customers/artitude_bk.png",
    darkSrc: "/logo/customers/artitude_wh.png",
    width: 537,
    height: 227,
    displayHeight: 34,
    href: "https://lukt.co.kr",
  },
  {
    id: "banlife",
    name: "Banlife",
    src: "/logo/customers/banlife.png",
    darkSrc: null,
    width: 615,
    height: 169,
    href: "https://www.ban-life.com",
  },
  {
    id: "beaurit",
    name: "Beaurit",
    src: "/logo/customers/beaurit.png",
    darkSrc: null,
    width: 500,
    height: 106,
    displayHeight: 32,
    href: "https://beaurit.net",
  },
  {
    id: "brandazine",
    name: "Brandazine",
    src: "/logo/customers/brandazine_bk.png",
    darkSrc: "/logo/customers/brandazine_wh.png",
    width: 656,
    height: 125,
    displayHeight: 40,
    href: "https://www.brandazine.com",
  },
  {
    id: "burnfit",
    name: "Burnfit",
    src: "/logo/customers/burnfit.png",
    darkSrc: null,
    width: 836,
    height: 150,
    displayHeight: 32,
    href: "https://burnfit.io",
  },
  {
    id: "cacheby",
    name: "Cacheby",
    src: "/logo/customers/cacheby.png",
    darkSrc: null,
    width: 446,
    height: 113,
    href: "https://cacheby.com",
  },
  {
    id: "cheotjang",
    name: "Cheotjang",
    src: "/logo/customers/cheotjang_bk.png",
    darkSrc: "/logo/customers/cheotjang_wh.png",
    width: 354,
    height: 214,
    displayHeight: 38,
    href: "https://cheotjang.com",
  },
  {
    id: "cinamon",
    name: "Cinamon",
    src: "/logo/customers/cinamon.png",
    darkSrc: null,
    width: 512,
    height: 74,
    displayHeight: 26,
    href: "https://cinev.com",
  },
  {
    id: "concept-b",
    name: "Concept B",
    src: "/logo/customers/concept-b_bk.png",
    darkSrc: "/logo/customers/concept-b_wh.png",
    width: 1552,
    height: 305,
    displayHeight: 40,
    href: "https://concept-b.co.kr",
  },
  {
    id: "curapulse",
    name: "Curapulse",
    src: "/logo/customers/curapulse_bk.png",
    darkSrc: "/logo/customers/curapulse_wh.png",
    width: 219,
    height: 28,
    displayHeight: 26,
    href: "https://cura-pulse.com",
  },
  {
    id: "demadog",
    name: "Demadog",
    src: "/logo/customers/demadog_bk.png",
    darkSrc: "/logo/customers/demadog_wh.png",
    width: 161,
    height: 29,
    displayHeight: 32,
    href: "https://dermadog.co.kr",
  },
  {
    id: "dorosiwa",
    name: "Dorosiwa",
    src: "/logo/customers/dorosiwa_bk.png",
    darkSrc: "/logo/customers/dorosiwa_wh.png",
    width: 476,
    height: 167,
    href: "https://dorosiwa.co.kr",
  },
  {
    id: "drivingteacher",
    name: "Drivingteacher",
    src: "/logo/customers/drivingteacher.svg",
    darkSrc: "/logo/customers/drivingteacher_wh.svg",
    width: 405,
    height: 112,
    href: "https://drivingteacher.co.kr",
  },
  {
    id: "edusync",
    name: "Edusync",
    src: "/logo/customers/edusync_bk.png",
    darkSrc: "/logo/customers/edusync_wh.png",
    width: 347,
    height: 323,
    displayHeight: 62,
    href: "https://edusync.kr",
  },
  {
    id: "glam",
    name: "Glam",
    src: "/logo/customers/glam.png",
    darkSrc: null,
    width: 394,
    height: 178,
    displayHeight: 48,
    href: "https://www.cupist.com",
  },
  {
    id: "grayscale",
    name: "Grayscale",
    src: "/logo/customers/grayscale_bk.png",
    darkSrc: "/logo/customers/grayscale_wh.png",
    width: 1055,
    height: 200,
    displayHeight: 42,
    href: "https://www.greymall.co.kr",
  },
  {
    id: "gyulmedal",
    name: "Gyulmedal",
    src: "/logo/customers/gyulmedal.png",
    darkSrc: null,
    width: 1564,
    height: 515,
    displayHeight: 36,
    href: "https://gyulmedal.com",
  },
  {
    id: "honestseoul",
    name: "Honestseoul",
    src: "/logo/customers/honestseoul_bk.png",
    darkSrc: "/logo/customers/honestseoul_wh.png",
    width: 503,
    height: 169,
    href: "https://honestseoul.com",
  },
  {
    id: "hookable",
    name: "Hookable",
    src: "/logo/customers/hookable_bk.avif",
    darkSrc: "/logo/customers/hookable_wh.png",
    width: 892,
    height: 191,
    displayHeight: 38,
    href: "https://www.hookable.ai",
  },
  {
    id: "hwang",
    name: "Hwang",
    src: "/logo/customers/hwang_bk.png",
    darkSrc: "/logo/customers/hwang_wh.png",
    width: 354,
    height: 138,
    href: "https://hwangon.com",
  },
  {
    id: "karetrip",
    name: "Karetrip",
    src: "/logo/customers/karetrip_bk.png",
    darkSrc: "/logo/customers/karetrip_wh.png",
    width: 1248,
    height: 272,
    displayHeight: 32,
    href: "https://karetrip.ai",
  },
  {
    id: "kyyb",
    name: "Kyyb",
    src: "/logo/customers/kyyb_bk.png",
    darkSrc: "/logo/customers/kyyb_wh.png",
    width: 165,
    height: 49,
    displayHeight: 32,
    href: "https://kyyb.co.kr",
  },
  {
    id: "langflix",
    name: "Langflix",
    src: "/logo/customers/langflix.png",
    darkSrc: null,
    width: 1211,
    height: 331,
    href: "https://www.langflix.io",
  },
  {
    id: "leesol",
    name: "Leesol",
    src: "/logo/customers/leesol_bk.png",
    darkSrc: "/logo/customers/leesol_wh.png",
    width: 1143,
    height: 611,
    href: "https://leesolbrain.com",
  },
  {
    id: "lghello",
    name: "Lghello",
    src: "/logo/customers/lghello.png",
    darkSrc: null,
    width: 1280,
    height: 191,
    href: "https://rental.lghellovision.net",
  },
  {
    id: "livet",
    name: "Livet",
    src: "/logo/customers/livet_bk.png",
    darkSrc: null,
    width: 1131,
    height: 295,
    displayHeight: 34,
    href: "https://www.livet.co.kr/",
  },
  {
    id: "meditherapy",
    name: "Meditherapy",
    src: "/logo/customers/meditherapy.png",
    darkSrc: null,
    width: 8192,
    height: 1256,
    displayHeight: 32,
    href: "https://meditherapy.co.kr",
  },
  {
    id: "melting",
    name: "Melting",
    src: "/logo/customers/melting_bk.png",
    darkSrc: "/logo/customers/melting_wh.png",
    width: 2474,
    height: 523,
    displayHeight: 42,
    href: "https://melting.chat/ko",
  },
  {
    id: "mineis",
    name: "Mineis",
    src: "/logo/customers/mineis.png",
    darkSrc: null,
    width: 1350,
    height: 625,
    displayHeight: 40,
    href: "https://www.mineis.io",
  },
  {
    id: "mongtan",
    name: "Mongtan",
    src: "/logo/customers/mongtan_bk.png",
    darkSrc: "/logo/customers/mongtan_wh.png",
    width: 893,
    height: 994,
    displayHeight: 60,
    href: "https://mongtan.co.kr",
  },
  {
    id: "muinlab",
    name: "Muinlab",
    src: "/logo/customers/muinlab.png",
    darkSrc: null,
    width: 148,
    height: 80,
    displayHeight: 50,
    href: "https://muinlab.io/",
  },
  {
    id: "newndy",
    name: "Newndy",
    src: "/logo/customers/newndy_bk.png",
    darkSrc: "/logo/customers/newndy_wh.png",
    width: 1490,
    height: 317,
    displayHeight: 32,
    href: "https://veasly.com",
  },
  {
    id: "newparadigminvestment",
    name: "Newparadigminvestment",
    src: "/logo/customers/newparadigminvestment_bk.png",
    darkSrc: "/logo/customers/newparadigminvestment_wh.png",
    width: 1076,
    height: 262,
    displayHeight: 48,
    href: "https://npinvestment.co.kr",
  },
  {
    id: "noblelogis",
    name: "Noblelogis",
    src: "/logo/customers/noblelogis.png",
    darkSrc: null,
    width: 1137,
    height: 834,
    displayHeight: 64,
    href: "https://noblestorage.co.kr",
  },
  {
    id: "novarex",
    name: "Novarex",
    src: "/logo/customers/novarex_bk.png",
    darkSrc: "/logo/customers/novarex_wh.png",
    width: 1078,
    height: 191,
    href: "https://novarex.co.kr",
  },
  {
    id: "oneul",
    name: "Oneul",
    src: "/logo/customers/oneul.png",
    darkSrc: null,
    width: 308,
    height: 144,
    displayHeight: 48,
    href: "https://www.sugeo.onl",
  },
  {
    id: "pcpstandard",
    name: "Pcpstandard",
    src: "/logo/customers/pcpstandard_bk.png",
    darkSrc: "/logo/customers/pcpstandard_wh.png",
    width: 1025,
    height: 119,
    displayHeight: 30,
    href: "https://pcpstandard.com",
  },
  {
    id: "penovis",
    name: "Penovis",
    src: "/logo/customers/penovis_bk.png",
    darkSrc: "/logo/customers/penovis_wh.png",
    width: 600,
    height: 129,
    displayHeight: 32,
    href: "https://penovis.com",
  },
  {
    id: "pomchecker",
    name: "Pomchecker",
    src: "/logo/customers/pomchecker_bk.png",
    darkSrc: "/logo/customers/pomchecker_wh.png",
    width: 318,
    height: 156,
    displayHeight: 46,
    href: "https://www.pomchecker.com",
  },
  {
    id: "savenote",
    name: "Savenote",
    src: "/logo/customers/savenote_bk.png",
    darkSrc: "/logo/customers/savenote_wh.png",
    width: 1287,
    height: 315,
    displayHeight: 42,
    href: "https://savenote.co.kr",
  },
  {
    id: "shortt",
    name: "Shortt",
    src: "/logo/customers/shortt_bk.png",
    darkSrc: "/logo/customers/shortt_wh.png",
    width: 1088,
    height: 336,
    displayHeight: 34,
    href: "https://shortt.kr",
  },
  {
    id: "sleepus",
    name: "Sleepus",
    src: "/logo/customers/sleepus.png",
    darkSrc: null,
    width: 408,
    height: 97,
    displayHeight: 40,
    href: "https://www.sleepus.co.kr",
  },
  {
    id: "ssupport",
    name: "Ssupport",
    src: "/logo/customers/ssupport.png",
    darkSrc: null,
    width: 453,
    height: 244,
    displayHeight: 40,
    href: "https://www.ssupport.co.kr",
  },
  {
    id: "tounou",
    name: "Tounou",
    src: "/logo/customers/tounou_bk.webp",
    darkSrc: "/logo/customers/tounou_wh.webp",
    width: 1000,
    height: 204,
    displayHeight: 32,
    href: "https://tounou.co.kr",
  },
  {
    id: "uniqlo",
    name: "Uniqlo",
    src: "/logo/customers/uniqlo.svg",
    darkSrc: null,
    width: 203,
    height: 203,
    href: "https://www.uniqlo.com/kr/ko/",
  },
  {
    id: "videostew",
    name: "Videostew",
    src: "/logo/customers/videostew.png",
    darkSrc: null,
    width: 722,
    height: 100,
    displayHeight: 30,
    href: "https://videostew.com",
  },
];
