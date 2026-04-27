import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "public", "logo", "logo_modusign.png");

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

const colAlpha = new Array(width).fill(0);
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const a = data[(y * width + x) * channels + 3];
    if (a > 32) colAlpha[x] += 1;
  }
}

const ALPHA_THRESHOLD = Math.max(1, Math.round(height * 0.02));
const MIN_GAP_WIDTH = Math.round(width * 0.025);

let gapStart = -1;
let gapLen = 0;
let cutAt = width;
let inText = false;

for (let x = 0; x < width; x++) {
  const isEmpty = colAlpha[x] <= ALPHA_THRESHOLD;
  if (!isEmpty) inText = true;
  if (!inText) continue;
  if (isEmpty) {
    if (gapStart === -1) gapStart = x;
    gapLen += 1;
  } else {
    if (gapLen >= MIN_GAP_WIDTH && gapStart > width * 0.4) {
      cutAt = gapStart;
      break;
    }
    gapStart = -1;
    gapLen = 0;
  }
}

console.log(`width=${width} height=${height} cutAt=${cutAt}`);

if (cutAt < width) {
  const stage1 = await sharp(SRC)
    .extract({ left: 0, top: 0, width: cutAt, height })
    .png()
    .toBuffer();
  const trimmed = await sharp(stage1)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png()
    .toBuffer();
  await sharp(trimmed).toFile(SRC);
  const meta = await sharp(SRC).metadata();
  console.log(`new size: ${meta.width}x${meta.height}`);
} else {
  console.log("no gap detected; not modified");
}
