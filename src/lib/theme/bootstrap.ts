/**
 * Theme bootstrap — runs synchronously before first paint to set the
 * `dark` / `light` class on <html>, preventing FOUC on reload.
 *
 * Resolution order:
 *   1. cookie("across.theme") → "dark" | "light"
 *   2. localStorage("across.theme") → "dark" | "light"
 *   3. fallback → "dark"
 *
 * The site is dark-first by design — OS `prefers-color-scheme` is intentionally
 * ignored so visitors land on dark regardless of their system setting; light
 * mode only kicks in once the user toggles it explicitly.
 */
export const THEME_STORAGE_KEY = "across.theme";
export const THEME_COOKIE_KEY = "across.theme";
export type Theme = "dark" | "light";

export const THEME_BOOTSTRAP = `!function(){try{var k="${THEME_STORAGE_KEY}",c=document.cookie.match(/(?:^|; )across\\.theme=(light|dark)/),s=c?c[1]:localStorage.getItem(k),t=s==="light"||s==="dark"?s:"dark",r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);if(!c){document.cookie="across.theme="+t+"; path=/; max-age=31536000; samesite=lax"}}catch(e){document.documentElement.classList.add("dark")}}();`;
