import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../node_modules/.pnpm/sharp@0.34.5/node_modules/sharp/lib/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, "..", "public");
const LOGO = path.join(PUBLIC, "logo");
const DARK = path.join(LOGO, "dark");
const ORIGIN = path.join(LOGO, "logo_origin");

await fs.mkdir(DARK, { recursive: true });

function lumaSat(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return { luma, sat };
}

async function loadRaw(srcPath) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { buf: Buffer.from(data), info };
}

async function saveRaw(buf, info, dstPath) {
  await sharp(buf, {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .png()
    .toFile(dstPath);
}

function stripBgInBuf(buf, info, mode) {
  const { width, height, channels } = info;
  const stack = [];
  const visited = new Uint8Array(width * height);
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
    const a = buf[idx + 3];
    if (a < 32) {
      visited[pi] = 1;
      stack.push([x + 1, y]); stack.push([x - 1, y]);
      stack.push([x, y + 1]); stack.push([x, y - 1]);
      continue;
    }
    const r = buf[idx], g = buf[idx + 1], b = buf[idx + 2];
    const { luma, sat } = lumaSat(r, g, b);
    let isBg = false;
    if (mode === "white") isBg = luma > 240 && sat < 0.06;
    else if (mode === "black") isBg = luma < 25 && sat < 0.15;
    else if (mode === "blue") {
      isBg = b > 180 && b > r + 30 && b > g + 20;
    }
    if (!isBg) continue;
    visited[pi] = 1;
    buf[idx + 3] = 0;
    stack.push([x + 1, y]); stack.push([x - 1, y]);
    stack.push([x, y + 1]); stack.push([x, y - 1]);
  }
}

function invertWhiteToBlackInBuf(buf, info, satKeep = 0.18) {
  const { channels } = info;
  let converted = 0;
  for (let i = 0; i < buf.length; i += channels) {
    const a = buf[i + 3];
    if (a < 32) continue;
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    const { luma, sat } = lumaSat(r, g, b);
    const minRGB = Math.min(r, g, b);
    const isNearWhite = minRGB > 235;
    if (!isNearWhite && sat >= satKeep) continue;
    if (luma > 200 || isNearWhite) {
      buf[i] = 0; buf[i + 1] = 0; buf[i + 2] = 0;
      converted++;
    }
  }
  return converted;
}

function findIconRightEdge(buf, info, satThreshold = 0.35, minPerCol = 4) {
  const { width, height, channels } = info;
  const counts = new Int32Array(width);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const a = buf[idx + 3];
      if (a < 32) continue;
      const { sat } = lumaSat(buf[idx], buf[idx + 1], buf[idx + 2]);
      if (sat >= satThreshold) counts[x]++;
    }
  }
  let iconStart = -1;
  for (let x = 0; x < width; x++) {
    if (counts[x] >= minPerCol) { iconStart = x; break; }
  }
  if (iconStart < 0) return -1;
  let iconEnd = iconStart;
  const gap = Math.max(8, Math.round(width * 0.02));
  for (let x = iconStart + 1; x < width; x++) {
    if (counts[x] >= minPerCol) iconEnd = x;
    else if (x - iconEnd > gap) break;
  }
  return iconEnd;
}

async function darkVariantTextOnly(lightSrc, darkDst) {
  const { buf, info } = await loadRaw(lightSrc);
  const { width, height, channels } = info;
  const iconRight = findIconRightEdge(buf, info, 0.35, 4);
  if (iconRight < 0) return console.warn(`  no icon found in ${lightSrc}`);
  const splitX = iconRight + Math.round(width * 0.01);
  let converted = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const a = buf[idx + 3];
      if (a < 32) continue;
      if (x <= splitX) continue;
      const { luma, sat } = lumaSat(buf[idx], buf[idx + 1], buf[idx + 2]);
      const isUltraDark = luma < 60;
      const isDarkMono = luma < 140 && sat < 0.4;
      if (isUltraDark || isDarkMono) {
        buf[idx] = 255; buf[idx + 1] = 255; buf[idx + 2] = 255;
        converted++;
      }
    }
  }
  await saveRaw(buf, info, darkDst);
  console.log(`  dark text-only: ${path.basename(darkDst)} (splitX=${splitX}, converted=${converted})`);
}

async function darkVariantPreserveSat(lightSrc, darkDst, satKeep = 0.18) {
  const { buf, info } = await loadRaw(lightSrc);
  const { channels } = info;
  let converted = 0;
  for (let i = 0; i < buf.length; i += channels) {
    const a = buf[i + 3];
    if (a < 32) continue;
    const r = buf[i], g = buf[i + 1], b = buf[i + 2];
    const { luma, sat } = lumaSat(r, g, b);
    const sumRGB = r + g + b;
    const isNearBlack = sumRGB < 30;
    if (!isNearBlack && sat >= satKeep) continue;
    if (luma < 140 || isNearBlack) {
      buf[i] = 255; buf[i + 1] = 255; buf[i + 2] = 255;
      converted++;
    }
  }
  await saveRaw(buf, info, darkDst);
  console.log(`  dark preserve-sat: ${path.basename(darkDst)} (converted=${converted})`);
}

async function whiteOriginToLightAndDark(originName, opts = {}) {
  const { stripBg = null, darkExt = ".png", lightExt = ".png" } = opts;
  const baseName = originName.replace(/\.[^.]+$/, "");
  const originPath = path.join(ORIGIN, originName);
  const darkDst = path.join(DARK, `${baseName}${darkExt}`);
  const lightDst = path.join(LOGO, `${baseName}${lightExt}`);

  const { buf, info } = await loadRaw(originPath);
  if (stripBg) stripBgInBuf(buf, info, stripBg);
  await saveRaw(buf, info, darkDst);
  const inverted = Buffer.from(buf);
  invertWhiteToBlackInBuf(inverted, info);
  await saveRaw(inverted, info, lightDst);
  console.log(`  ${baseName}: dark=${path.basename(darkDst)} light=${path.basename(lightDst)}`);
}

console.log("\n[1] beautyselection — text-only dark variant");
await darkVariantTextOnly(
  path.join(LOGO, "logo_beautyselection.png"),
  path.join(DARK, "logo_beautyselection.png")
);

console.log("\n[3] channeltalk — text-only dark variant");
await darkVariantTextOnly(
  path.join(LOGO, "logo_channeltalk.png"),
  path.join(DARK, "logo_channeltalk.png")
);

console.log("\n[8] makestar — preserve star color");
await darkVariantPreserveSat(
  path.join(LOGO, "logo_makestar.png"),
  path.join(DARK, "logo_makestar.png"),
  0.18
);

console.log("\n[5] heartsaver");
await whiteOriginToLightAndDark("logo_heartsaver.png");

console.log("\n[6] lycle (strip blue bg)");
await whiteOriginToLightAndDark("logo_lycle.png", { stripBg: "blue" });

console.log("\n[9] ascent (strip black bg)");
await whiteOriginToLightAndDark("logo_ascent.jpg", { stripBg: "black" });

console.log("\n[10] sweetspot (preserve blue triangle)");
await whiteOriginToLightAndDark("logo_sweetspot.png");

console.log("\n[11] stipop");
await whiteOriginToLightAndDark("logo_stipop.png");

console.log("\n[12] specter (strip black bg)");
await whiteOriginToLightAndDark("logo_specter.png", { stripBg: "black" });

console.log("\nDone.");
