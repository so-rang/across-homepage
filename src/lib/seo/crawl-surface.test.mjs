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

test("llms.txt is a static text/plain route", () => {
  const route = src("app/llms.txt/route.ts");
  assert.match(route, /export const dynamic = "force-static";/);
  assert.match(route, /"content-type": "text\/plain; charset=utf-8"/);
  assert.doesNotMatch(route, /across\.cx/);
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
