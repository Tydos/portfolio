import Redis from "ioredis";
import { config } from "../config";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;
  try {
    redis = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
    return redis;
  } catch {
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;
  try {
    if (client.status !== "ready") await client.connect();
    const val = await client.get(key);
    return val ? (JSON.parse(val) as T) : null;
  } catch {
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds = 60,
): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    if (client.status !== "ready") await client.connect();
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // cache is best-effort
  }
}

export async function cacheInvalidate(pattern: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    if (client.status !== "ready") await client.connect();
    const keys = await client.keys(pattern);
    if (keys.length) await client.del(...keys);
  } catch {
    // ignore
  }
}

export async function pingRedis(): Promise<boolean> {
  const client = getRedis();
  if (!client) return false;
  try {
    if (client.status !== "ready") await client.connect();
    return (await client.ping()) === "PONG";
  } catch {
    return false;
  }
}
