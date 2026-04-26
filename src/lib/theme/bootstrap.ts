/**
 * Theme bootstrap — runs synchronously before first paint to set the
 * `dark` / `light` class on <html>, preventing FOUC on reload and honoring
 * the user's stored preference or system `prefers-color-scheme`.
 *
 * Resolution order:
 *   1. cookie("across.theme") → "dark" | "light"
 *   2. localStorage("across.theme") → "dark" | "light"
 *   3. matchMedia("(prefers-color-scheme: light)") → "light" else "dark"
 *   4. fallback → "dark"
 *
 * SSR also reads the cookie and renders the theme class on <html>, so soft
 * navigations between locales don't strip the class on React reconciliation.
 */
export const THEME_STORAGE_KEY = "across.theme";
export const THEME_COOKIE_KEY = "across.theme";
export type Theme = "dark" | "light";

export const THEME_BOOTSTRAP = `!function(){try{var k="${THEME_STORAGE_KEY}",c=document.cookie.match(/(?:^|; )across\\.theme=(light|dark)/),s=c?c[1]:localStorage.getItem(k),t=s==="light"||s==="dark"?s:(window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"),r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);if(!c){document.cookie="across.theme="+t+"; path=/; max-age=31536000; samesite=lax"}}catch(e){document.documentElement.classList.add("dark")}}();`;
