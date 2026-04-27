import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, "..", "public", "logo", "logo_origin", "logo_altosventures.webp");
const DST = path.join(__dirname, "..", "public", "logo", "logo_altosventures.png");

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

function isWhite(idx) {
  const r = data[idx];
  const g = data[idx + 1];
  const b = data[idx + 2];
  const a = data[idx + 3];
  if (a < 32) return false;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma > 200 && sat < 0.15;
}

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

const out = Buffer.from(data);
let stripped = 0;
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || x >= width || y < 0 || y >= height) continue;
  const pi = y * width + x;
  if (visited[pi]) continue;
  const idx = pi * channels;
  if (!isWhite(idx)) continue;
  visited[pi] = 1;
  out[idx + 3] = 0;
  stripped += 1;
  stack.push([x + 1, y]);
  stack.push([x - 1, y]);
  stack.push([x, y + 1]);
  stack.push([x, y - 1]);
}

await sharp(out, {
  raw: { width, height, channels },
})
  .png()
  .toFile(DST);

console.log(`flood-filled ${stripped} outer-white pixels, saved to ${path.basename(DST)}`);
