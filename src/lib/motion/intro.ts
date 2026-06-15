/**
 * Hero intro timeline constants (DESIGN.md §5 / plan T10).
 * Shared by the inline bootstrap script, IntroRunner, and globals.css.
 */
export const INTRO_STORAGE_KEY = "across.introSeen";
export const INTRO_FULL_DURATION_MS = 2050;
export const INTRO_SHORT_DURATION_MS = 400;
export const INTRO_PERF_START = "across:intro:start";
export const INTRO_PERF_END = "across:intro:end";
export const INTRO_PERF_MEASURE = "across:intro";

export type IntroState = "first" | "short" | "reduced" | "done";

/**
 * Minified inline script injected at the top of <body>. Must run synchronously
 * before first paint so CSS rules keyed off `html[data-intro]` apply without FOUC.
 * Always replays the full intro (sessionStorage shortcut disabled during
 * iteration per user feedback — the intro should always feel present).
 *
 * Also pins scroll to the top on a hard reload (so the intro always plays from
 * the top instead of the browser restoring a mid-page scroll). Back/forward
 * navigations keep native scroll restoration ("auto").
 */
export const INTRO_BOOTSTRAP = `!function(){try{var n=(performance.getEntriesByType&&performance.getEntriesByType("navigation")[0])||{};if(n.type==="reload"){try{if(history.scrollRestoration)history.scrollRestoration="manual"}catch(e){}var t=function(){try{window.scrollTo(0,0)}catch(e){}};addEventListener("DOMContentLoaded",t);addEventListener("load",t)}else{try{if(history.scrollRestoration)history.scrollRestoration="auto"}catch(e){}}}catch(e){}try{var d=document.documentElement;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="reduced";return}d.dataset.intro="first";try{performance.mark("${INTRO_PERF_START}")}catch(e){}}catch(e){}}();`;
