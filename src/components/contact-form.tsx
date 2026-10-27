"use client";

import { useEffect, useRef, useState } from "react";
import { SendIcon } from "./icons";

type Toast = { text: string; ok: boolean } | null;

const input =
  "w-full rounded-[10px] border border-line bg-paper px-3.5 py-2.5 text-[15px] text-ink placeholder:text-muted focus:border-accent focus:outline-none";

/**
 * Sends a message to Anton's inbox through /api/contact. A failed send keeps what was typed.
 * `children` (the other ways to reach him) sit on the left of the Send button.
 */
export function ContactForm({ children }: { children?: React.ReactNode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const submit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || sending) return;
    setSending(true);
    const website = new FormData(e.currentTarget).get("website");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website, startedAt: startedAt.current }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setName("");
      setEmail("");
      setMessage("");
      setToast({ text: "Sent. Thank you! I'll reply soon.", ok: true });
    } catch (err) {
      const rate = err instanceof Error && err.message === "rate";
      setToast({
        text: rate ? "Too many messages. Try again in a few minutes." : "Couldn't send. Try again, or email me directly.",
        ok: false,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            aria-label="Your name"
            autoComplete="name"
            maxLength={200}
          />
          <input
            className={input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email, so I can reply"
            aria-label="Your email"
            autoComplete="email"
            maxLength={200}
          />
        </div>
        <textarea
          className={`${input} min-h-[120px] resize-y leading-relaxed`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          aria-label="Message"
          required
          maxLength={5000}
        />
        {/* Honeypot: hidden from people, filled in by bots. */}
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        <div className="flex flex-wrap items-center gap-2">
          {children}
          <button
            type="submit"
            disabled={!message.trim() || sending}
            className="ml-auto inline-flex h-10 items-center gap-2 rounded-[10px] bg-accent px-4 text-[15px] font-semibold text-accent-ink transition-opacity disabled:opacity-50"
          >
            <SendIcon className="h-[18px] w-[18px]" />
            {sending ? "Sending…" : "Send message"}
          </button>
        </div>
      </form>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border px-4 py-2 text-[14px] font-semibold shadow-lg ${
            toast.ok ? "border-line bg-surface text-ink" : "border-red-400/40 bg-surface text-red-400"
          }`}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}
