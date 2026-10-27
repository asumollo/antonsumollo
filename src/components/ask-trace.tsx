import { useId, useState } from "react";
import { site } from "@/site.config";
import type { AskEvent } from "@/lib/ask-events";
import { openContact } from "./contact-popup";

/** One piece of an answer in the Ask drawer: a paragraph of text, or a tool step. */
export type Part =
  | { kind: "text"; text: string }
  | {
      kind: "step";
      id: string;
      name: string;
      status: "running" | "done";
      summary?: string;
      args?: string;
      preview?: string[];
      more?: number;
    };

/** Folds one streamed event into an answer's parts. Pure, so it's safe inside a state updater. */
export function addEvent(parts: Part[], e: AskEvent): Part[] {
  if (e.type === "text") {
    const last = parts[parts.length - 1];
    // Text right after text is the same paragraph still streaming in.
    if (last?.kind === "text") return [...parts.slice(0, -1), { kind: "text", text: last.text + e.delta }];
    return [...parts, { kind: "text", text: e.delta }];
  }
  // A "done" event replaces the "running" step with the same id.
  const step: Part = {
    kind: "step",
    id: e.id,
    name: e.name,
    status: e.status,
    ...(e.status === "done" && { summary: e.summary, args: e.args, preview: e.preview, more: e.more }),
  };
  const i = parts.findIndex((p) => p.kind === "step" && p.id === e.id);
  return i === -1 ? [...parts, step] : parts.map((p, j) => (j === i ? step : p));
}

/** Just the words of an answer, for sending the conversation back to the model. */
export function textOf(parts: Part[]) {
  return parts.flatMap((p) => (p.kind === "text" ? [p.text.trim()] : [])).join("\n\n");
}

type Step = Extract<Part, { kind: "step" }>;

/**
 * An answer as the drawer prints it. While it streams, the work shows in full: the "Checking…"
 * line, then each tool step with the first lines of what it returned. Once the answer is done
 * (`secs` is set), that work folds into one line like `✓ checked 2 sources · 2.1s ▸`, and only
 * the answer stays open.
 */
export function Trace({ parts, spinner, secs }: { parts: Part[]; spinner: string; secs?: number }) {
  const [open, setOpen] = useState(false);
  const bodyId = useId();

  // Everything up to the last step is the work; the text after it is the answer.
  const lastStep = parts.findLastIndex((p) => p.kind === "step");
  const work = parts.slice(0, lastStep + 1);
  const answer = parts.slice(lastStep + 1);
  const steps = work.filter((p): p is Step => p.kind === "step");
  const folded = secs != null && steps.length > 0;

  return (
    <div className="flex flex-col gap-1.5">
      {folded && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={bodyId}
          className="self-start rounded-[4px] text-left text-[#6b7280] hover:text-[#e8eaee]"
        >
          <span aria-hidden className="text-[#45c085]">✓</span> checked {steps.length} source{steps.length > 1 ? "s" : ""} ·{" "}
          {secs.toFixed(1)}s <span aria-hidden>{open ? "▾" : "▸"}</span>
        </button>
      )}
      {work.length > 0 && (
        <div id={bodyId} className={`ask-fold ${folded && !open ? "" : "open"}`}>
          <div className={`flex flex-col gap-0.5 ${folded ? "pl-[2ch]" : ""}`}>
            {work.map((p, i) =>
              p.kind === "text" ? (
                <p key={i} className="whitespace-pre-wrap text-[#c4cad4]">
                  {p.text.trim()}
                </p>
              ) : (
                <StepLine key={p.id} step={p} spinner={spinner} />
              ),
            )}
          </div>
        </div>
      )}
      {answer.map((p, i) =>
        p.kind === "text" ? (
          <p key={i} className="whitespace-pre-wrap text-[#c4cad4]">
            <Linked text={p.text.trim()} />
          </p>
        ) : null,
      )}
    </div>
  );
}

const link = "text-[#9db3ff] underline-offset-[3px] hover:text-[#c3d1ff] hover:underline";

/** Anton's email, or a web address. Splitting on this puts the matches at the odd indexes. */
const linkable = new RegExp(`(${site.email.replace(/[.+]/g, "\\$&")}|https?://[^\\s]+)`, "gi");

/**
 * Answer text with its links made clickable. Anton's email opens the contact popup, so the
 * conversation stays put; web addresses open in a new tab.
 */
function Linked({ text }: { text: string }) {
  return text.split(linkable).map((piece, i) => {
    if (i % 2 === 0) return piece;
    if (piece.toLowerCase() === site.email.toLowerCase()) {
      return (
        <button key={i} type="button" onClick={openContact} className={link}>
          {piece}
        </button>
      );
    }
    // A sentence often ends right after a URL. Keep that full stop or comma out of the link.
    const url = piece.replace(/[.,;:!?)]+$/, "");
    return (
      <span key={i}>
        <a href={url} target="_blank" rel="noreferrer" className={link}>
          {url.replace(/^https?:\/\/(www\.)?/, "")} ↗
        </a>
        {piece.slice(url.length)}
      </span>
    );
  });
}

/** `✓ get_projects(slug: "x")  1 project`, then the first lines of the raw result, dimmed. */
function StepLine({ step, spinner }: { step: Step; spinner: string }) {
  const done = step.status === "done";
  return (
    <div className="pl-[2ch]">
      <p className="truncate">
        <span aria-hidden className={done ? "text-[#45c085]" : "text-[#9db3ff]"}>
          {done ? "✓" : spinner}
        </span>{" "}
        <span className="text-[#9db3ff]">{step.name}</span>
        <span className="text-[#6b7280]">({step.args ?? ""})</span>{" "}
        <span className="text-[#6b7280]">{done ? step.summary : "…"}</span>
      </p>
      {done && !!step.preview?.length && (
        <div className="pl-[4ch] text-[#6b7280]">
          {step.preview.map((line, i) => (
            <p key={i} className="truncate">
              {line}
            </p>
          ))}
          {!!step.more && (
            <p className="italic">
              … +{step.more} line{step.more > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
