import rateLimit from "express-rate-limit";
import type { Options } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { config } from "../config";
import { getRedis } from "../services/cache";

function makeStore(prefix: string) {
  const redis = getRedis();
  if (!redis) return undefined;
  return new RedisStore({
    sendCommand: (...args: string[]) =>
      redis.call(...(args as [string, ...string[]])) as Promise<number>,
    prefix,
  });
}

function createLimiter(options: Partial<Options>) {
  return rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => config.disableRateLimit,
    ...options,
  });
}

export const publicReadLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 100,
  store: makeStore("rl:read:"),
  message: { detail: "Too many requests, please try again later." },
});

export const uploadLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  store: makeStore("rl:upload:"),
  message: { detail: "Upload rate limit exceeded." },
});

export const authLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 20,
  store: makeStore("rl:auth:"),
  message: { detail: "Too many auth attempts." },
});
