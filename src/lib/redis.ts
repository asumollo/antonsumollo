import { Redis } from "@upstash/redis";

// The Upstash Marketplace integration sets KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

/** The site's Redis, or null when it isn't configured. Everything that uses it has to work without it. */
export const redis = url && token ? new Redis({ url, token }) : null;
