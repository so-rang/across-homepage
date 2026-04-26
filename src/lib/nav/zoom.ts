export const ZOOM_IN_MS = 800;
export const ZOOM_OUT_MS = 600;
export const ZOOM_LATERAL_MS = 800;

/**
 * Feature-detect the View Transitions API. `startViewTransition` became
 * stable in Chromium-based browsers and Safari 18+, otherwise we fall back
 * to simple scale/translate keyframes.
 */
export function supportsViewTransitions(): boolean {
  return (
    typeof document !== "undefined" &&
    typeof (document as unknown as { startViewTransition?: unknown })
      .startViewTransition === "function"
  );
}

type ViewTransitionHost = Document & {
  startViewTransition: (cb: () => Promise<void> | void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

/**
 * Wrap a navigation callback in a View Transition when available.
 * Returns a promise that resolves after the transition settles (or immediately
 * on unsupported browsers after the callback runs).
 */
export async function withZoomTransition(
  cb: () => void | Promise<void>
): Promise<void> {
  if (!supportsViewTransitions()) {
    await cb();
    return;
  }
  const host = document as ViewTransitionHost;
  const t = host.startViewTransition(cb);
  await t.finished.catch(() => undefined);
}
