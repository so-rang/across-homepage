import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const src = (rel) =>
  readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");

// What crawlers and LLM readers see is the server HTML. These guard the fixes
// that made that HTML say what the page says.

test("unknown [locale] segments 404 instead of rendering (dotted paths used to 500)", () => {
  assert.match(src("app/[locale]/layout.tsx"), /export const dynamicParams = false;/);
});

test("llms.txt, llms-full.txt and humans.txt are static text/plain routes", () => {
  for (const rel of ["app/llms.txt/route.ts", "app/llms-full.txt/route.ts", "app/humans.txt/route.ts"]) {
    const route = src(rel);
    assert.match(route, /export const dynamic = "force-static";/, rel);
    assert.match(route, /"content-type": "text\/plain; charset=utf-8"/, rel);
  }
  assert.doesNotMatch(src("lib/seo/llms-text.ts"), /across\.cx/);
});

test("favicon.ico is a real multi-size icon (browsers request it on every visit)", () => {
  const ico = readFileSync(fileURLToPath(new URL("../../app/favicon.ico", import.meta.url)));
  assert.deepEqual([...ico.subarray(0, 4)], [0, 0, 1, 0], "ICO magic");
  assert.ok(ico.readUInt16LE(4) >= 3, "expected 16/32/48(/64) entries");
});

test("root metadata routes bypass the intl proxy (apple-touch-icon used to 404)", () => {
  assert.match(src("proxy.ts"), /ROOT_METADATA_FILE = \/\^\\\/\(\?:apple-icon\|icon\)/);
});

test("CountUp server-renders the final value, not the 0 the tween starts from", () => {
  const countUp = src("components/motion/count-up.tsx");
  assert.match(countUp, /useState\(to\)/);
  assert.doesNotMatch(countUp, /useState\(0\)/);
});

test("client logos emit a 1x/2x srcset (no `sizes` → no per-device-width list)", () => {
  assert.doesNotMatch(src("components/sections/clients-marquee.tsx"), /\bsizes=/);
});

test("Organization JSON-LD carries the published company facts", () => {
  const home = src("app/[locale]/(marketing)/page.tsx");
  for (const key of ["legalName", "taxID", "founder", "email"]) {
    assert.match(home, new RegExp(`\\b${key}:`), `${key} missing from Organization JSON-LD`);
  }
  assert.doesNotMatch(home, /"ask@across\.center"/, "email should come from COMPANY, not a literal");
});
