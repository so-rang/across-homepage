import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

const INPUT = path.join(PUBLIC, "logo/logo_origin/logo_elice.webp");
const OUTPUT = path.join(PUBLIC, "logo/logo_elice.png");

const img = sharp(INPUT).ensureAlpha();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// Flood fill from edges → mark bg pixels (only the white region connected to
// the canvas border). Interior white pockets stay opaque.
const isBg = new Uint8Array(width * height);
const stack = [];

const FLOOD_LUM = 210;

function pushIfWhite(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const pi = y * width + x;
  if (isBg[pi]) return;
  const idx = pi * channels;
  const lum = Math.min(data[idx], data[idx + 1], data[idx + 2]);
  if (lum < FLOOD_LUM) return;
  isBg[pi] = 1;
  stack.push(x, y);
}

for (let x = 0; x < width; x++) {
  pushIfWhite(x, 0);
  pushIfWhite(x, height - 1);
}
for (let y = 0; y < height; y++) {
  pushIfWhite(0, y);
  pushIfWhite(width - 1, y);
}

while (stack.length > 0) {
  const y = stack.pop();
  const x = stack.pop();
  pushIfWhite(x + 1, y);
  pushIfWhite(x - 1, y);
  pushIfWhite(x, y + 1);
  pushIfWhite(x, y - 1);
}

// Within bg region: apply unpremultiply for clean antialiased edges.
// Outside: keep original (preserves interior white).
for (let pi = 0; pi < width * height; pi++) {
  if (!isBg[pi]) continue;
  const idx = pi * channels;
  const m = Math.min(data[idx], data[idx + 1], data[idx + 2]);
  const a = (255 - m) / 255;
  if (a < 0.012) {
    data[idx + 3] = 0;
    continue;
  }
  const inv = 1 - a;
  const r = (data[idx] - 255 * inv) / a;
  const g = (data[idx + 1] - 255 * inv) / a;
  const b = (data[idx + 2] - 255 * inv) / a;
  data[idx] = Math.max(0, Math.min(255, Math.round(r)));
  data[idx + 1] = Math.max(0, Math.min(255, Math.round(g)));
  data[idx + 2] = Math.max(0, Math.min(255, Math.round(b)));
  data[idx + 3] = Math.round(255 * a);
}

await sharp(data, { raw: { width, height, channels } })
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
  .png()
  .toFile(OUTPUT);

console.log(`wrote ${OUTPUT}`);
