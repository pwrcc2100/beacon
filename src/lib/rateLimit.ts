// src/lib/rateLimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

type RateLimitResult = { success: boolean; remaining?: number };
type RateLimiter = { limit: (key: string) => Promise<RateLimitResult> };

export const rlSubmit: RateLimiter = isRedisConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 writes/min per IP
      analytics: true
    })
  : {
      // No-op limiter for local/dev without Redis
      async limit() {
        return { success: true, remaining: 999 };
      }
    };

