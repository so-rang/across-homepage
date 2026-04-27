import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");
const LOGO_DIR = path.join(PUBLIC, "logo");
const DARK_DIR = path.join(LOGO_DIR, "dark");

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

const SKIP_DARK_VARIANT = new Set(["logo_elice.png"]);
const STRIP_WHITE_BG = new Set();
const STRIP_OUTER_DARK = new Set(["logo_altosventures.png"]);

function isExcluded(name) {
  return EXCLUDE_PATTERNS.some((p) => p.test(name));
}

const DARK_LUMA_MAX = 110;
const DARK_SAT_MAX = 0.4;
const MIN_DARK_RATIO = 0.008;

async function processRaster(srcPath, dstPath, opts) {
  const { stripWhite, stripOuterDark } = opts;
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);
  const { width, height, channels } = info;

  if (stripOuterDark) {
    const visited = new Uint8Array(width * height);
    const stack = [];
    for (let x = 0; x < width; x++) {
      stack.push([x, 0]);
      stack.push([x, height - 1]);
    }
    for (let y = 0; y < height; y++) {
      stack.push([0, y]);
      stack.push([width - 1, y]);
    }
    while (stack.length) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const pi = y * width + x;
      if (visited[pi]) continue;
      const idx = pi * channels;
      const a = out[idx + 3];
      const r = out[idx];
      const g = out[idx + 1];
      const b = out[idx + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const isAlreadyTransparent = a < 32;
      const isDark = luma < 80 && sat < 0.32;
      if (!isAlreadyTransparent && !isDark) continue;
      visited[pi] = 1;
      out[idx + 3] = 0;
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }
  }

  let opaque = 0;
  let converted = 0;
  for (let i = 0; i < out.length; i += channels) {
    const r = out[i];
    const g = out[i + 1];
    const b = out[i + 2];
    const a = out[i + 3];
    if (a < 32) continue;
    opaque += 1;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const isUltraDark = luma < 55;
    const isDarkMono = luma < DARK_LUMA_MAX && sat < DARK_SAT_MAX;
    if (isUltraDark || isDarkMono) {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
      converted += 1;
    } else if (stripWhite && luma > 200 && sat < 0.15) {
      out[i + 3] = 0;
    }
  }
  const ratio = opaque ? converted / opaque : 0;
  if (ratio < MIN_DARK_RATIO) return null;
  await sharp(out, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toFile(dstPath);
  return { ratio, width: info.width, height: info.height };
}

async function processSvg(srcPath, dstPath) {
  const text = await fs.readFile(srcPath, "utf-8");
  let converted = 0;
  const next = text.replace(/#([0-9a-fA-F]{3,8})\b/g, (m, hex) => {
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((c) => c + c)
            .join("")
        : hex.slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (luma < 55 || (luma < DARK_LUMA_MAX && sat < DARK_SAT_MAX)) {
      converted += 1;
      return "#ffffff";
    }
    return m;
  });
  if (converted === 0) return null;
  await fs.writeFile(dstPath, next, "utf-8");
  return { ratio: 1, svg: true };
}

await fs.mkdir(DARK_DIR, { recursive: true });

const files = await fs.readdir(LOGO_DIR);
const variants = {};
for (const f of files) {
  if (isExcluded(f)) continue;
  if (SKIP_DARK_VARIANT.has(f)) continue;
  const stat = await fs.stat(path.join(LOGO_DIR, f));
  if (!stat.isFile()) continue;
  const ext = path.extname(f).toLowerCase();
  if (ext === ".ico") continue;
  const srcPath = path.join(LOGO_DIR, f);
  const dstPath = path.join(DARK_DIR, f);
  let result;
  try {
    result =
      ext === ".svg"
        ? await processSvg(srcPath, dstPath)
        : await processRaster(srcPath, dstPath, {
          stripWhite: STRIP_WHITE_BG.has(f),
          stripOuterDark: STRIP_OUTER_DARK.has(f),
        });
  } catch (err) {
    console.error(`FAILED ${f}: ${err.message}`);
    continue;
  }
  if (result) {
    variants[f] = `(${(result.ratio * 100).toFixed(1)}%)`;
  }
}

console.log(`Generated ${Object.keys(variants).length} dark variants:`);
for (const [k, v] of Object.entries(variants)) {
  console.log(`  ${k} ${v}`);
}
