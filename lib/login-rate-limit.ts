import { kv } from "@vercel/kv";
import { createHash } from "node:crypto";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 900;

function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

const CHECK_SCRIPT = `
  local key = KEYS[1]
  local window = tonumber(ARGV[1])
  local max = tonumber(ARGV[2])

  local count = tonumber(redis.call("GET", key) or "0")

  if count == 0 then
    return {0, 0, 0}
  end

  local remaining = redis.call("TTL", key)

  if remaining == -1 then
    redis.call("EXPIRE", key, window)
    remaining = window
  end

  local blocked = 0
  if count > max then
    blocked = 1
  end

  return {count, remaining, blocked}
`;

const FAIL_SCRIPT = `
  local key = KEYS[1]
  local ttl = tonumber(ARGV[1])
  local max = tonumber(ARGV[2])

  local count = redis.call("INCR", key)
  local remaining = redis.call("TTL", key)

  if count == 1 or remaining == -1 then
    redis.call("EXPIRE", key, ttl)
    remaining = ttl
  end

  if remaining < 1 then remaining = 1 end

  local blocked = 0
  if count > max then
    blocked = 1
  end

  return {count, remaining, blocked}
`;

export async function checkLoginRateLimit(
  ip: string | null,
  normalizedUsername: string
): Promise<RateLimitResult> {
  const userKey = `rate-limit:login:user:${hashValue(normalizedUsername)}`;

  const keys: string[] = [userKey];
  if (ip) keys.push(`rate-limit:login:ip:${ip}`);

  try {
    const results = await Promise.all(
      keys.map((key) =>
        kv.eval<[number, number], [number, number, number]>(
          CHECK_SCRIPT,
          [key],
          [RATE_LIMIT_WINDOW, RATE_LIMIT_MAX]
        )
      )
    );

    const blockedResults = results.filter(([, , b]) => b === 1);
    if (blockedResults.length > 0) {
      const retryAfter = Math.max(...blockedResults.map(([, r]) => r), 1);
      return { blocked: true, retryAfter };
    }

    return { blocked: false };
  } catch {
    throw new RateLimitUnavailableError();
  }
}

export async function recordFailedLoginAttempt(
  ip: string | null,
  normalizedUsername: string
): Promise<RateLimitResult> {
  const userKey = `rate-limit:login:user:${hashValue(normalizedUsername)}`;

  const keys: string[] = [userKey];
  if (ip) keys.push(`rate-limit:login:ip:${ip}`);

  try {
    const results = await Promise.all(
      keys.map((key) =>
        kv.eval<[number, number], [number, number, number]>(
          FAIL_SCRIPT,
          [key],
          [RATE_LIMIT_WINDOW, RATE_LIMIT_MAX]
        )
      )
    );

    const blocked = results.some(([, , b]) => b === 1);
    const retryAfter = Math.max(...results.map(([, r]) => r), 1);

    return { blocked, retryAfter };
  } catch {
    throw new RateLimitUnavailableError();
  }
}

export async function clearUserRateLimit(
  normalizedUsername: string
): Promise<void> {
  const userKey = `rate-limit:login:user:${hashValue(normalizedUsername)}`;
  try {
    await kv.del(userKey);
  } catch {
    // No impedir el login si Redis falla aquí
  }
}

export interface RateLimitResult {
  blocked: boolean;
  retryAfter?: number;
}

export class RateLimitUnavailableError extends Error {
  constructor() {
    super("Rate limit service unavailable");
    this.name = "RateLimitUnavailableError";
  }
}
