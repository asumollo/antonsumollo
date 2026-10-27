import { createHash } from "node:crypto";
import { redis } from "./redis";

/** Questions one visitor can ask a minute, and a day. */
const PER_MINUTE = 10;
const PER_DAY = 50;
/** Questions the whole site answers a day, however many visitors ask them. Caps the API bill. */
const SITE_PER_DAY = 500;

/**
 * Counts a question against the limits. Returns "visitor" when this visitor is over theirs, "site"
 * when the site has answered its daily share, or "ok". Each counter is a Redis key that expires with
 * its window, so nothing needs cleaning up. Without Redis there are no limits.
 */
export async function countQuestion(ip: string): Promise<"ok" | "visitor" | "site"> {
  if (!redis) return "ok";
  // Store a hash, not the address itself.
  const who = createHash("sha256").update(ip).digest("hex").slice(0, 16);
  const minute = Math.floor(Date.now() / 60_000);
  const day = new Date().toISOString().slice(0, 10);

  try {
    const mine = redis.multi();
    mine.incr(`ask:min:${who}:${minute}`);
    mine.expire(`ask:min:${who}:${minute}`, 60);
    mine.incr(`ask:day:${who}:${day}`);
    mine.expire(`ask:day:${who}:${day}`, 86_400);
    const [perMinute, , perDay] = (await mine.exec()) as [number, unknown, number, unknown];
    if (perMinute > PER_MINUTE || perDay > PER_DAY) return "visitor";

    // Only questions that passed the visitor check count toward the site, so one visitor hammering
    // the endpoint can't use up everyone else's share.
    const site = `ask:site:${day}`;
    const total = await redis.incr(site);
    if (total === 1) await redis.expire(site, 86_400);
    return total > SITE_PER_DAY ? "site" : "ok";
  } catch (err) {
    // A Redis outage shouldn't take the assistant down with it. Auto-reload is off on the API
    // account, so the credit balance is still a hard ceiling.
    console.error("[ask] rate limit check failed", err);
    return "ok";
  }
}
