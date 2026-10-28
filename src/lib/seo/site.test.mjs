import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("../../", import.meta.url));
const SELF = fileURLToPath(import.meta.url);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|mjs|json)$/.test(name) && p !== SELF) out.push(p);
  }
  return out;
}

/** Drop block comments and full-line `//` comments; keep string literals intact. */
function withoutComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

test("SITE_URL falls back to the host that actually serves the site", () => {
  const source = readFileSync(join(SRC, "lib/seo/site.ts"), "utf8");
  const fallback = source.match(
    /NEXT_PUBLIC_SITE_URL\s*\?\?\s*"([^"]+)"/
  )?.[1];
  assert.equal(fallback, "https://www.across.center");
});

// across.cx now 308-redirects to www.across.center. If any SEO surface
// (canonical, og:url, hreflang, sitemap, robots host, OG image copy) names
// the old host again, crawlers see a canonical that redirects elsewhere and
// homepage readers such as GPTO refuse the page.
test("no source file emits the legacy across.cx host", () => {
  const offenders = walk(SRC)
    .filter((p) => withoutComments(readFileSync(p, "utf8")).includes("across.cx"))
    .map((p) => p.slice(SRC.length));
  assert.deepEqual(offenders, []);
});
