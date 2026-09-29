import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "");

/** Declarations inside every `@theme` / `@theme inline` block, in source order. */
function themeDeclarations(source) {
  const decls = [];
  for (const match of source.matchAll(/@theme\b[^{]*\{/g)) {
    let depth = 1;
    let i = match.index + match[0].length;
    const start = i;
    while (depth > 0 && i < source.length) {
      if (source[i] === "{") depth++;
      if (source[i] === "}") depth--;
      i++;
    }
    const body = source.slice(start, i - 1);
    for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
      decls.push({ name, value: value.trim() });
    }
  }
  return decls;
}

test("no custom property references itself", () => {
  const cycles = [...css.matchAll(/(--[\w-]+)\s*:\s*[^;]*var\(\s*\1\s*[,)]/g)]
    .map((m) => m[0]);
  assert.deepEqual(cycles, []);
});

test("the effective --font-sans theme value leads with Pretendard", () => {
  const fontSans = themeDeclarations(css).filter((d) => d.name === "--font-sans");
  assert.ok(fontSans.length > 0, "--font-sans is not declared in any @theme");
  assert.match(fontSans.at(-1).value, /^var\(--font-pretendard\)/);
});
