/**
 * Rate limiter with an abstract interface for swappable implementations.
 *
 * TODO: PRODUCTION — The InMemoryRateLimiter resets on every Vercel
 * serverless cold start. On Vercel, cold starts are frequent enough
 * that this provides MINIMAL real protection from day one. Order-creation
 * abuse protection is NOT production-ready until this is replaced with
 * a persistent store (e.g. @upstash/ratelimit with Upstash Redis).
 * Swapping requires only changing the getRateLimiter() function below.
 */

// ── Public interface ─────────────────────────────────────────

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterMs: number };

export interface RateLimiter {
  /**
   * Check if the key has exceeded its rate limit.
   * @returns allowed: true if under limit, allowed: false with retryAfterMs if over.
   */
  check(key: string): Promise<RateLimitResult>;
}

// ── In-memory sliding-window implementation ──────────────────

const DEFAULT_MAX_REQUESTS = 5;
const DEFAULT_WINDOW_MS = 60_000; // 1 minute

class InMemoryRateLimiter implements RateLimiter {
  private readonly windows = new Map<string, number[]>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = DEFAULT_MAX_REQUESTS, windowMs = DEFAULT_WINDOW_MS) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get or create the timestamps array for this key
    const timestamps = this.windows.get(key) ?? [];

    // Filter to only timestamps within the current window
    const recent = timestamps.filter((t) => t > windowStart);

    if (recent.length >= this.maxRequests) {
      // Find when the earliest timestamp in the window will expire
      const oldestInWindow = recent[0]!;
      const retryAfterMs = oldestInWindow + this.windowMs - now;
      return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
    }

    // Under limit — record this request
    recent.push(now);
    this.windows.set(key, recent);

    return { allowed: true };
  }
}

// ── Factory ──────────────────────────────────────────────────
// Change this single function to swap implementations.

let instance: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!instance) {
    // TODO: PRODUCTION — Replace with Upstash Redis implementation:
    // import { Ratelimit } from '@upstash/ratelimit';
    // import { Redis } from '@upstash/redis';
    // instance = new UpstashRateLimiter(...)
    instance = new InMemoryRateLimiter(DEFAULT_MAX_REQUESTS, DEFAULT_WINDOW_MS);
  }
  return instance;
}

/**
 * Create a rate limiter with custom settings.
 * Use for flows that need different limits than the default (e.g. password reset).
 */
export function createRateLimiter(maxRequests: number, windowMs: number): RateLimiter {
  return new InMemoryRateLimiter(maxRequests, windowMs);
}
