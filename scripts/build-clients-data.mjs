import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");
const LOGO_DIR = path.join(PUBLIC, "logo");

const EXCLUDE_PATTERNS = [
  /^logo_origin$/,
  /^genrank_rock\./,
  /^logo_across_/,
  /^logo_genrank/,
  /^logo_naeo/,
  /^logo_gpto_white/,
  /^logo_hashed/,
  /^logo_primer/,
  /^logo_hkgpto_hk/,
  /^logo_medi_trans/,
  /^logo_client_eye/,
];

const BRAND_NAMES = {
  altosventures: "Altos Ventures",
  ascent: "Ascent",
  backpacker: "Backpackr",
  beautyselection: "Beauty Selection",
  bhsn: "BHSN",
  bttr: "BTTR",
  carrot: "Carrot",
  cellmeat: "Cellmeat",
  channeltalk: "Channel Talk",
  cheongyeon: "Cheongyeon",
  crowdpic: "Crowdpic",
  deepstudio: "Deep Studio",
  elice: "Elice",
  elysium: "Elysium",
  fastcampus: "Fast Campus",
  finda: "Finda",
  gcoo: "Gcoo",
  granter: "Granter",
  greeting: "Greeting",
  heartsaver: "Heartsaver",
  homefit: "Homefit",
  imweb: "Imweb",
  kakaostyle: "Kakao Style",
  kmong: "Kmong",
  listly: "Listly",
  liveanywhere: "Live Anywhere",
  lunchlab: "Lunchlab",
  lycle: "Lycle",
  makestar: "Makestar",
  mathplat: "Mathplat",
  medistream: "Medistream",
  meight: "Meight",
  modusign: "Modusign",
  moin: "Moin",
  myrealtrip: "My Real Trip",
  pickle: "Pickle",
  pilyze: "Pilyze",
  plab: "Plab",
  purespace: "Purespace",
  rael: "Rael",
  rapportlabs: "Rapport Labs",
  saeteuk: "Saeteuk",
  spaceadd: "Space Add",
  specter: "Specter",
  spoonlabs: "Spoon Labs",
  stipop: "Stipop",
  stylemate: "Stylemate",
  sweetspot: "Sweetspot",
  thegrainbank: "The Grain Bank",
  trazy: "Trazy",
  trevari: "Trevari",
  ugleelab: "Ugleelab",
  voyagerx: "VoyagerX",
  whatap: "Whatap",
  wippy: "Wippy",
  wiseapp: "Wiseapp",
  wiselyco: "Wisely",
};

function shouldExclude(name) {
  return EXCLUDE_PATTERNS.some((p) => p.test(name));
}

function idFromFile(name) {
  return name.replace(/^logo_/, "").replace(/\.[^.]+$/, "");
}


async function getDimensions(filepath, ext) {
  if (ext === ".svg") {
    const text = await fs.readFile(filepath, "utf-8");
    const widthAttr = text.match(/\bwidth\s*=\s*"([0-9.]+)/);
    const heightAttr = text.match(/\bheight\s*=\s*"([0-9.]+)/);
    const viewBox = text.match(/\bviewBox\s*=\s*"([^"]+)"/);
    if (widthAttr && heightAttr) {
      return {
        width: Math.round(parseFloat(widthAttr[1])),
        height: Math.round(parseFloat(heightAttr[1])),
      };
    }
    if (viewBox) {
      const parts = viewBox[1].trim().split(/\s+/).map(Number);
      if (parts.length === 4) {
        return { width: Math.round(parts[2]), height: Math.round(parts[3]) };
      }
    }
    return { width: 200, height: 60 };
  }
  if (ext === ".ico") {
    return { width: 64, height: 64 };
  }
  const meta = await sharp(filepath).metadata();
  return { width: meta.width ?? 200, height: meta.height ?? 60 };
}

const files = await fs.readdir(LOGO_DIR);
const results = [];
for (const f of files) {
  if (shouldExclude(f)) continue;
  const stat = await fs.stat(path.join(LOGO_DIR, f));
  if (!stat.isFile()) continue;
  const ext = path.extname(f).toLowerCase();
  const filepath = path.join(LOGO_DIR, f);
  const id = idFromFile(f);
  const name = BRAND_NAMES[id] ?? id;
  const { width, height } = await getDimensions(filepath, ext);
  const darkPath = path.join(LOGO_DIR, "dark", f);
  let darkSrc = null;
  try {
    await fs.access(darkPath);
    darkSrc = `/logo/dark/${f}`;
  } catch {}
  results.push({
    id,
    name,
    src: `/logo/${f}`,
    width,
    height,
    darkSrc,
  });
}
results.sort((a, b) => a.name.localeCompare(b.name));
console.log(JSON.stringify(results, null, 2));
console.error(`Total: ${results.length}`);
