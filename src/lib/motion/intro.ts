/**
 * Hero intro timeline constants (DESIGN.md §5 / plan T10).
 * Shared by the inline bootstrap script, IntroRunner, and globals.css.
 */
export const INTRO_STORAGE_KEY = "across.introSeen";
export const INTRO_FULL_DURATION_MS = 2720;
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
 */
export const INTRO_BOOTSTRAP = `!function(){try{var d=document.documentElement;if(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="reduced";return}d.dataset.intro="first";try{performance.mark("${INTRO_PERF_START}")}catch(e){}}catch(e){}}();`;
