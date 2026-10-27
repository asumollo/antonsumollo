import { createHash } from "node:crypto";
import { redis } from "@/lib/redis";

/** One sorted set per page, e.g. "presence:/projects". */
const keyFor = (path: string) => `presence:${path}`;
/** A visitor counts as gone this long after their last heartbeat. The client beats every 20s. */
const TTL_MS = 45_000;
const FACES = 3;
const ID = /^[0-9a-f-]{36}$/;
const PATH = /^\/[a-z0-9\-/]{0,80}$/i;

/** Visitors only ever see a hash of each other's ID, so nobody can send a "leave" for someone else. */
const seed = (id: string) => createHash("sha256").update(id).digest("hex").slice(0, 12);

async function read(req: Request) {
  try {
    const { id, path } = await req.json();
    if (typeof id !== "string" || !ID.test(id) || typeof path !== "string" || !PATH.test(path)) return null;
    return { id, key: keyFor(path) };
  } catch {
    return null;
  }
}

/**
 * Heartbeat for one page. Marks the visitor as on it, drops anyone who stopped beating, and returns the count plus
 * avatar seeds for the newest few. Without Redis configured it reports just the visitor, so the dock hides it.
 */
export async function POST(req: Request) {
  const visitor = await read(req);
  if (!visitor) return Response.json({ error: "bad request" }, { status: 400 });
  const { id, key } = visitor;
  if (!redis) return Response.json({ count: 1, faces: [seed(id)] });

  const now = Date.now();
  const tx = redis.multi();
  tx.zadd(key, { score: now, member: id });
  tx.zremrangebyscore(key, 0, now - TTL_MS);
  tx.zcard(key);
  tx.zrange(key, 0, FACES - 1, { rev: true });
  tx.pexpire(key, TTL_MS * 2); // the set disappears once the page goes quiet
  const [, , count, newest] = (await tx.exec()) as [unknown, unknown, number, string[], unknown];

  return Response.json({ count, faces: newest.map(seed) });
}

/** Sent when the tab is hidden or closed or the visitor changes page, so the count drops right away. */
export async function DELETE(req: Request) {
  const visitor = await read(req);
  if (visitor && redis) await redis.zrem(visitor.key, visitor.id);
  return new Response(null, { status: 204 });
}
