import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");
const ORIGIN = path.join(PUBLIC, "logo", "logo_origin");
const TARGET = path.join(PUBLIC, "logo");

const PASSTHROUGH_EXT = new Set([".svg", ".ico"]);
const RASTER_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif"]);

const TOLERANCE = 18;
const FEATHER = 32;

function colorDistance(c1, c2) {
  const dr = c1[0] - c2[0];
  const dg = c1[1] - c2[1];
  const db = c1[2] - c2[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function sampleCornerColor(data, width, height, channels) {
  const samples = [];
  const offsets = [0, 1, 2];
  for (const ox of offsets) {
    for (const oy of offsets) {
      samples.push([ox, oy]);
      samples.push([width - 1 - ox, oy]);
      samples.push([ox, height - 1 - oy]);
      samples.push([width - 1 - ox, height - 1 - oy]);
    }
  }
  let r = 0,
    g = 0,
    b = 0,
    a = 0;
  for (const [x, y] of samples) {
    const idx = (y * width + x) * channels;
    r += data[idx];
    g += data[idx + 1];
    b += data[idx + 2];
    a += data[idx + 3];
  }
  const n = samples.length;
  return [r / n, g / n, b / n, a / n];
}

function isNearWhite(c) {
  return c[0] >= 235 && c[1] >= 235 && c[2] >= 235;
}

function isNearBlack(c) {
  return c[0] <= 20 && c[1] <= 20 && c[2] <= 20;
}

/**
 * White-bg removal via per-pixel unpremultiply: alpha = 1 - min(R,G,B)/255 and
 * restore the original color by removing the white contamination from each
 * channel. This eliminates the visible halo that distance thresholds leave
 * around antialiased edges (e.g., a black glyph's gray transition pixels).
 */
function applyWhiteBgRemoval(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const m = Math.min(data[i], data[i + 1], data[i + 2]);
    const a = (255 - m) / 255;
    if (a < 0.012) {
      data[i + 3] = 0;
      continue;
    }
    const inv = 1 - a;
    const r = (data[i] - 255 * inv) / a;
    const g = (data[i + 1] - 255 * inv) / a;
    const b = (data[i + 2] - 255 * inv) / a;
    data[i] = Math.max(0, Math.min(255, Math.round(r)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
    data[i + 3] = Math.round(255 * a);
  }
}

/** Black-bg removal symmetric to white: alpha = max(R,G,B)/255. */
function applyBlackBgRemoval(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const m = Math.max(data[i], data[i + 1], data[i + 2]);
    const a = m / 255;
    if (a < 0.012) {
      data[i + 3] = 0;
      continue;
    }
    const r = data[i] / a;
    const g = data[i + 1] / a;
    const b = data[i + 2] / a;
    data[i] = Math.max(0, Math.min(255, Math.round(r)));
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
    data[i + 3] = Math.round(255 * a);
  }
}

function applyDistanceThreshold(data, channels, corner) {
  for (let i = 0; i < data.length; i += channels) {
    const dist = colorDistance(
      [data[i], data[i + 1], data[i + 2]],
      [corner[0], corner[1], corner[2]]
    );
    if (dist <= TOLERANCE) {
      data[i + 3] = 0;
    } else if (dist < TOLERANCE + FEATHER) {
      data[i + 3] = Math.round((255 * (dist - TOLERANCE)) / FEATHER);
    }
  }
}

async function processRaster(inputPath, outputBaseName) {
  const img = sharp(inputPath).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const corner = sampleCornerColor(data, width, height, channels);

  // Already transparent at corners → just copy as PNG (or keep original format)
  if (corner[3] < 80) {
    const ext = path.extname(inputPath).toLowerCase();
    const outName = ext === ".jpg" || ext === ".jpeg" ? outputBaseName + ".png" : path.basename(inputPath);
    await fs.copyFile(inputPath, path.join(TARGET, outName));
    return { skipped: true, name: outName, mode: "passthrough" };
  }

  let mode;
  if (isNearWhite(corner)) {
    applyWhiteBgRemoval(data, channels);
    mode = "white";
  } else if (isNearBlack(corner)) {
    applyBlackBgRemoval(data, channels);
    mode = "black";
  } else {
    applyDistanceThreshold(data, channels, corner);
    mode = "distance";
  }

  const outName = outputBaseName + ".png";
  await sharp(data, { raw: { width, height, channels } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .png()
    .toFile(path.join(TARGET, outName));

  return { skipped: false, name: outName, mode };
}

const files = (await fs.readdir(ORIGIN)).sort();
let processed = 0;
let copied = 0;
let skipped = 0;
let failed = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const inputPath = path.join(ORIGIN, file);

  try {
    if (PASSTHROUGH_EXT.has(ext)) {
      await fs.copyFile(inputPath, path.join(TARGET, file));
      console.log(`  copy   ${file}`);
      copied++;
    } else if (RASTER_EXT.has(ext)) {
      const result = await processRaster(inputPath, base);
      if (result.skipped) {
        console.log(`  skip   ${file} (already transparent) → ${result.name}`);
        skipped++;
      } else {
        console.log(`  cutout[${result.mode}] ${file} → ${result.name}`);
        processed++;
      }
    } else {
      console.warn(`  ?      ${file} (unknown ext)`);
      await fs.copyFile(inputPath, path.join(TARGET, file));
      copied++;
    }
  } catch (err) {
    console.error(`  FAIL   ${file}: ${err.message}`);
    failed++;
  }
}

console.log(
  `\nTotal: ${files.length} | cutout: ${processed} | copied: ${copied} | already-transparent: ${skipped} | failed: ${failed}`
);
