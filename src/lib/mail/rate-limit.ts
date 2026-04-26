type Bucket = { count: number; resetAt: number };

/**
 * Minimal in-memory sliding window rate limit.
 * Good enough for single-region deploys (Vercel Edge/Node per-region instance).
 * For multi-region, swap to Upstash via `UPSTASH_REDIS_REST_*`.
 */
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, resetAt: now + windowMs };
  }

  if (existing.count >= max) {
    return { allowed: false, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, resetAt: existing.resetAt };
}
