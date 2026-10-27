const MAX_MESSAGE = 5000;
const MAX_FIELD = 200;
/** A person takes longer than this to write a message. Bots usually submit instantly. */
const MIN_FILL_MS = 3000;
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

/** Sends per IP in the current window. In memory, so it's per server instance: a speed bump, not a wall. */
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) return true;
  recent.set(ip, [...hits, now]);
  return false;
}

/**
 * Forwards the contact form to the "Web contact" Apps Script, which mails it to Anton.
 * The script URL and secret stay on the server. Setup: docs/contact-form.md.
 */
export async function POST(req: Request) {
  const url = process.env.CONTACT_SCRIPT_URL;
  const secret = process.env.CONTACT_SECRET;
  if (!url || !secret) return Response.json({ ok: false, error: "offline" }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  const field = (key: string, max: number) => (typeof body[key] === "string" ? body[key].trim().slice(0, max) : "");

  // Honeypot or too fast: answer as if it worked, so the bot has nothing to learn from.
  const elapsed = Date.now() - Number(body.startedAt);
  if (field("website", MAX_FIELD) || !(elapsed >= MIN_FILL_MS)) return Response.json({ ok: true });

  const message = field("message", MAX_MESSAGE);
  if (!message) return Response.json({ ok: false, error: "empty" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false, error: "rate" }, { status: 429 });

  try {
    // Apps Script answers with a redirect; fetch follows it as a GET, which is what it expects.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        name: field("name", MAX_FIELD),
        email: field("email", MAX_FIELD),
        message,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = res.ok ? await res.json() : null;
    if (data?.ok === true) return Response.json({ ok: true });
    return Response.json({ ok: false, error: data?.error ?? "failed" }, { status: 502 });
  } catch {
    return Response.json({ ok: false, error: "failed" }, { status: 502 });
  }
}
