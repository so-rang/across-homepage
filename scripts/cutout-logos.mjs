import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");

async function cutout(input, output, { threshold, feather }) {
  const img = sharp(path.join(PUBLIC, input)).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.max(data[i], data[i + 1], data[i + 2]);
    if (lum <= threshold) {
      data[i + 3] = 0;
    } else if (lum < threshold + feather) {
      data[i + 3] = Math.round((255 * (lum - threshold)) / feather);
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png()
    .toFile(path.join(PUBLIC, output));

  console.log(`wrote ${output}`);
}

await cutout("naeo_logo.png", "naeo_logo_cutout.png", {
  threshold: 30,
  feather: 25,
});
await cutout("GenRank.png", "genrank_logo_cutout.png", {
  threshold: 70,
  feather: 30,
});
