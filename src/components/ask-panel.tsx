"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/site.config";
import type { ProjectSummary } from "@/lib/projects";
import { CloseIcon } from "./icons";
import type { AskEvent } from "@/lib/ask-events";
import { findCommand, matchCommands } from "./ask-commands";
import { addEvent, textOf, Trace, type Part } from "./ask-trace";
import { openContact } from "./contact-popup";
import { useIsMac } from "./use-is-mac";

/**
 * A line in the log: a question or command, an answer with its tool steps, or what a slash command
 * printed. An answer's `secs` is set when it finishes, which folds its steps away.
 */
type Entry =
  | { role: "user"; content: string }
  | { role: "assistant"; parts: Part[]; secs?: number }
  | { role: "output"; node: React.ReactNode };

const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

/**
 * The "Ask about me" chat as a terminal drawer across the bottom of the screen, like an editor's
 * terminal pane. Always dark, matching the project popup's terminal mode.
 */
export function AskPanel({ projects, onClose }: { projects: ProjectSummary[]; onClose: () => void }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [frame, setFrame] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Set while an answer streams in, so Ctrl+C can stop it.
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      // Esc closes an open popup first (like the resume from /resume); only the next Esc closes the drawer.
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) onClose();
      // Ctrl, not ⌘, on a Mac too, like a terminal. ⌘L belongs to the address bar and ⌘C is copy.
      if (!e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toLowerCase();
      // Ctrl+L clears the screen.
      if (key === "l") {
        e.preventDefault();
        abortRef.current?.abort();
        setEntries([]);
        inputRef.current?.focus();
      }
      // Ctrl+C stops the answer that's streaming in, or else drops what's typed. On Windows it's
      // also copy, so it does nothing while any text is selected.
      if (key === "c" && !hasSelection(inputRef.current)) {
        if (abortRef.current) {
          e.preventDefault();
          abortRef.current.abort();
        } else if (inputRef.current?.value) {
          e.preventDefault();
          const typed = inputRef.current.value;
          setInput("");
          setEntries((prev) => [...prev, { role: "output", node: <Interrupted text={typed} /> }]);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [entries, busy]);

  // Spin the braille dots only while waiting for an answer.
  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => setFrame((f) => (f + 1) % SPINNER.length), 80);
    return () => clearInterval(t);
  }, [busy]);

  const ask = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    // A long chat costs more with every question, so after a while it asks for a fresh one. This is
    // for visitors; the server's own rate limits are what stop scripts.
    const asked = entries.filter((e) => e.role === "user" && !e.content.startsWith("/")).length;
    if (asked >= site.assistant.maxQuestions) {
      setInput("");
      setEntries((prev) => [
        ...prev,
        { role: "user", content: q },
        {
          role: "output",
          node: (
            <p className="text-[#6b7280]">
              This chat has reached {site.assistant.maxQuestions} questions. Type{" "}
              <span className="text-[#e8eaee]">/clear</span> to start a new one.
            </p>
          ),
        },
      ]);
      return;
    }
    // The model only sees the conversation: questions and the words of its answers, not commands,
    // what they printed, or the tool steps.
    const chat = [...entries, { role: "user", content: q } as Entry].flatMap((e) =>
      e.role === "user" && !e.content.startsWith("/")
        ? [{ role: "user", content: e.content }]
        : e.role === "assistant"
          ? [{ role: "assistant", content: textOf(e.parts) }]
          : [],
    );
    setEntries((prev) => [...prev, { role: "user", content: q }, { role: "assistant", parts: [] }]);
    setInput("");
    setBusy(true);

    // Every event updates the answer at the end of the log.
    const apply = (update: (parts: Part[]) => Part[]) =>
      setEntries((prev) => {
        const last = prev[prev.length - 1];
        return last?.role === "assistant" ? [...prev.slice(0, -1), { role: "assistant", parts: update(last.parts) }] : prev;
      });
    const offline = (parts: Part[]) => (textOf(parts) ? parts : addEvent(parts, { type: "text", delta: site.assistant.offline }));
    const started = performance.now();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chat }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      // The answer streams as one JSON event per line. A read can end mid-line, so keep the tail for the next one.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.trim()) apply((parts) => addEvent(parts, JSON.parse(line) as AskEvent));
        }
      }
      // A stream that ended without a word of answer gets the offline message instead of a blank.
      apply(offline);
    } catch {
      // A stop from Ctrl+C isn't a failure: keep what arrived, without the offline message.
      if (!controller.signal.aborted) apply(offline);
    } finally {
      abortRef.current = null;
      const secs = (performance.now() - started) / 1000;
      setEntries((prev) => {
        const last = prev[prev.length - 1];
        return last?.role === "assistant" ? [...prev.slice(0, -1), { ...last, secs }] : prev;
      });
      // A terminal prints ^C where it stopped. Ctrl+L also aborts, but it has already emptied the log.
      if (controller.signal.aborted) {
        setEntries((prev) => (prev.length ? [...prev, { role: "output", node: <Interrupted /> }] : prev));
      }
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  // Slash commands answer in the browser from the config files: no API call, and they work offline.
  const run = (line: string) => {
    const q = line.trim();
    setInput("");
    const cmd = findCommand(q);
    const out = cmd
      ? cmd.run({ projects, clear: () => setEntries([]) })
      : <p className="text-[#6b7280]">command not found: {q}. Try /help</p>;
    // Commands that only act, like /clear, print nothing and leave no line behind.
    if (out == null) return;
    setEntries((prev) => [...prev, { role: "user", content: q }, { role: "output", node: out }]);
  };

  const submit = (line: string) => (line.trim().startsWith("/") ? run(line) : ask(line));
  const matches = busy ? [] : matchCommands(input);

  // "thinking…" fills the quiet gaps: before the first event, and after a step finishes while the
  // model reads its result. A running step has its own spinner, and streaming text shows itself.
  const lastEntry = entries[entries.length - 1];
  const lastPart = lastEntry?.role === "assistant" ? lastEntry.parts[lastEntry.parts.length - 1] : undefined;
  const waiting = busy && (!lastPart || (lastPart.kind === "step" && lastPart.status === "done"));

  const first = site.shortName.split(" ")[0].toLowerCase();
  const mac = useIsMac();

  // From 640px up the drawer is the page column's full 720px, so it overhangs the content by 24px
  // a side and reads as its own layer.
  return (
    <div
      id="ask-panel"
      role="dialog"
      aria-label={`Ask about ${site.shortName.split(" ")[0]}`}
      className="ask-drawer fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[min(400px,70dvh)] w-full flex-col rounded-t-[16px] border-t border-[#2a2e36] sm:max-w-[720px] sm:border-x bg-[#16181d] font-mono text-[13px] text-[#e8eaee] shadow-[0_-24px_60px_-20px_rgba(0,0,0,0.5)] sm:text-[14px]"
    >
      <header className="flex h-11 shrink-0 items-center gap-2 rounded-t-[16px] border-b border-[#2a2e36] bg-[#1b1e24] pl-4 pr-2">
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 border-b border-[#7d9bff] text-[11px] uppercase tracking-[0.08em]">ask</span>
        <span className="ml-3 hidden truncate text-[12px] text-[#8b93a1] sm:inline">{first}@portfolio: ~</span>
        {/* Phones have no keyboard shortcuts, so the hints only show from 640px up. */}
        <span className="ml-auto hidden text-[12px] text-[#6b7280] sm:inline">
          <kbd className="text-[#8b93a1]">{mac ? "⌃C" : "Ctrl C"}</kbd> stop ·{" "}
          <kbd className="text-[#8b93a1]">{mac ? "⌃L" : "Ctrl L"}</kbd> clear ·{" "}
          <kbd className="text-[#8b93a1]">esc</kbd> close
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="ml-auto grid h-8 w-8 place-items-center rounded-[8px] sm:ml-2 text-[#8b93a1] hover:bg-[#2a2e36] hover:text-[#e8eaee]"
        >
          <CloseIcon className="h-[18px] w-[18px]" />
        </button>
      </header>

      <div ref={listRef} className="flex-1 overflow-y-auto" aria-live="polite">
        <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
          {entries.length === 0 && (
            <>
            <p className="text-[#6b7280]">
              Type <span className="text-[#e8eaee]">/help</span> for commands, or try one of these:
            </p>
            <ol className="flex flex-col gap-1">
              {site.assistant.suggestions.map((s, i) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => ask(s)}
                    className="flex gap-3 text-left text-[#9db3ff] underline-offset-[3px] hover:text-[#c3d1ff] hover:underline"
                  >
                    <span className="text-[#6b7280]">{i + 1}</span>
                    {s}
                  </button>
                </li>
              ))}
            </ol>
            </>
          )}

          {entries.map((m, i) =>
            m.role === "output" ? (
              <div key={i}>{m.node}</div>
            ) : m.role === "user" ? (
              <p key={i} className="mt-1">
                <span aria-hidden className="text-[#7d9bff]">❯</span> {m.content}
              </p>
            ) : (
              <Trace key={i} parts={m.parts} spinner={SPINNER[frame]} secs={m.secs} />
            ),
          )}

          {waiting && (
            <p className="text-[#6b7280]">
              <span aria-hidden>{SPINNER[frame]}</span> thinking…
            </p>
          )}
        </div>
      </div>

      <form
        className="shrink-0 border-t border-[#2a2e36]"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
      >
        {/* Typing "/" lists the matching commands. Tab fills in the first one; a click runs it. */}
        {matches.length > 0 && (
          <ul id="ask-commands" className="flex flex-col border-b border-[#2a2e36] py-1.5">
            {matches.map((c, i) => (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => run(`/${c.name}`)}
                  className={`flex w-full gap-4 px-4 py-1 text-left hover:bg-[#1f232a] sm:px-5 ${i === 0 ? "bg-[#1b1e24]" : ""}`}
                >
                  <span className="w-28 shrink-0 text-[#e8eaee]">/{c.name}</span>
                  <span className="truncate text-[#6b7280]">{c.summary}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center gap-2 px-4 py-3 sm:px-5">
          <span aria-hidden className="text-[#7d9bff]">❯</span>
          <label htmlFor="ask-input" className="sr-only">
            Your question
          </label>
          <input
            id="ask-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab" && matches.length) {
                e.preventDefault();
                setInput(`/${matches[0].name}`);
              }
            }}
            aria-controls={matches.length ? "ask-commands" : undefined}
            placeholder="ask a question, or type / for commands"
            maxLength={500}
            autoComplete="off"
            disabled={busy}
            // A terminal has no input box, only the prompt. Inline so it beats the site-wide focus ring.
            style={{ outline: "none" }}
            className="h-8 min-w-0 flex-1 bg-transparent text-[16px] text-[#e8eaee] caret-[#e8eaee] placeholder:text-[#6b7280] sm:text-[14px]"
          />
          {/* Always here, so answers don't have to end by asking visitors to email. */}
          <button
            type="button"
            onClick={openContact}
            className="shrink-0 rounded-[4px] text-[13px] text-[#9db3ff] hover:text-[#c3d1ff]"
          >
            message {site.shortName.split(" ")[0]} →
          </button>
        </div>
      </form>
    </div>
  );
}

/** What a terminal prints for Ctrl+C: the line that was typed, if any, then ^C. */
function Interrupted({ text }: { text?: string }) {
  return (
    <p className="text-[#6b7280]">
      {text != null && (
        <>
          <span aria-hidden className="text-[#7d9bff]">❯</span> <span className="text-[#e8eaee]">{text}</span>
        </>
      )}
      ^C
    </p>
  );
}

/** Whether the visitor has text selected, on the page or inside the input, so Ctrl+C means copy. */
function hasSelection(input: HTMLInputElement | null) {
  if (input && input.selectionStart !== input.selectionEnd) return true;
  return !!window.getSelection()?.toString();
}
