/**
 * Theme bootstrap — runs synchronously before first paint to set the
 * `dark` / `light` class on <html>, preventing FOUC on reload and honoring
 * the user's stored preference or system `prefers-color-scheme`.
 *
 * Resolution order:
 *   1. localStorage("across.theme") → "dark" | "light"
 *   2. matchMedia("(prefers-color-scheme: light)") → "light" else "dark"
 *   3. fallback → "dark"
 */
export const THEME_STORAGE_KEY = "across.theme";
export type Theme = "dark" | "light";

export const THEME_BOOTSTRAP = `!function(){try{var k="${THEME_STORAGE_KEY}",s=localStorage.getItem(k),t=s==="light"||s==="dark"?s:(window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.classList.add(t)}catch(e){document.documentElement.classList.add("dark")}}();`;
