"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Message, Step } from "@/lib/projects";
import { CollapseIcon, ExpandIcon } from "./icons";

type View = "system" | "sequence";

// Both diagrams are drawn on a 600-unit-wide canvas and scale with the popup.
const W = 600;

/**
 * The project's system and sequence diagrams under two tabs, plus a fullscreen view for reading
 * them large (and on phones, where the popup shrinks them). Esc leaves fullscreen first.
 */
export function Architecture({
  system,
  sequence,
  decisions,
}: {
  system: Step[][];
  sequence: Message[];
  decisions: string[];
}) {
  const views: View[] = [...(system.length ? ["system" as const] : []), ...(sequence.length ? ["sequence" as const] : [])];
  const [view, setView] = useState<View>(views[0] ?? "system");
  const [full, setFull] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasFull = useRef(false);

  // Move focus into fullscreen when it opens, and back to its button when it closes.
  useEffect(() => {
    if (full) closeRef.current?.focus();
    else if (wasFull.current) openRef.current?.focus();
    wasFull.current = full;
  }, [full]);

  if (views.length === 0) return null;

  const diagram = view === "system" ? <SystemDiagram columns={system} /> : <SequenceDiagram messages={sequence} />;

  const bar = (fullscreen: boolean) => (
    <div className="flex items-center justify-between gap-3">
      {views.length > 1 ? (
        <div role="tablist" aria-label="Diagram" className="flex gap-1 rounded-[11px] border border-line bg-paper p-1">
          {views.map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`h-[30px] rounded-[8px] px-3 font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
                view === v ? "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line)]" : "text-muted hover:text-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      ) : (
        <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{views[0]}</h3>
      )}
      <button
        ref={fullscreen ? closeRef : openRef}
        type="button"
        onClick={() => setFull(!fullscreen)}
        aria-label={fullscreen ? "Exit fullscreen" : "View fullscreen"}
        title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
        className="grid h-[34px] w-[34px] place-items-center rounded-[9px] border border-line bg-paper text-muted transition-colors hover:border-ink/30 hover:text-ink"
      >
        {fullscreen ? <CollapseIcon className="h-4 w-4" /> : <ExpandIcon className="h-4 w-4" />}
      </button>
    </div>
  );

  return (
    <section className="flex flex-col gap-4">
      {bar(false)}
      <div>{diagram}</div>

      {decisions.length > 0 && (
        <ul className="flex flex-col gap-2">
          {decisions.map((d) => (
            <li key={d} className="flex gap-2.5 text-[14px] leading-relaxed">
              <span aria-hidden className="text-accent">
                ◆
              </span>
              {d}
            </li>
          ))}
        </ul>
      )}

      {full && (
        // Inside the project popup, so it covers the page; Esc here must not close the popup too.
        <div
          role="dialog"
          aria-label="Diagram, fullscreen"
          onKeyDown={(e) => {
            if (e.key !== "Escape") return;
            e.preventDefault();
            e.stopPropagation();
            setFull(false);
          }}
          className="fixed inset-0 z-20 flex flex-col gap-4 bg-paper p-4 sm:p-8"
        >
          {bar(true)}
          {/* A minimum width keeps labels readable on a phone; swipe sideways to see the rest. */}
          <div className="grid flex-1 place-items-center overflow-auto">
            <div className="w-full min-w-[720px] max-w-[1200px]">{diagram}</div>
          </div>
        </div>
      )}
    </section>
  );
}

const NAME_BASE = 22; // name baseline, from the top of a box
const NOTE_BASE = 38; // first note line's baseline
const NOTE_LINE = 13;
const COL_GAP = 40;
const ROW_GAP = 14;

/** Splits a note into lines of at most `max` characters, at most three lines. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines.length > 3 ? [...lines.slice(0, 2), `${lines[2]}…`] : lines;
}

/** Components left to right; every box points to every box in the next column. */
function SystemDiagram({ columns }: { columns: Step[][] }) {
  const arrow = useId();
  const colW = (W - COL_GAP * (columns.length - 1)) / columns.length;
  // About 6.3 units per character at the note's 10.5px monospace.
  const maxChars = Math.floor((colW - 24) / 6.3);
  const notes = columns.map((col) => col.map((s) => (s.note ? wrap(s.note, maxChars) : [])));
  const lines = Math.max(0, ...notes.flat().map((n) => n.length));
  const boxH = lines ? NOTE_BASE + NOTE_LINE * (lines - 1) + 12 : 36;
  const height = Math.max(...columns.map((c) => c.length * boxH + (c.length - 1) * ROW_GAP));

  // Each column is centered vertically, so a single box sits level with a stacked pair.
  const boxes = columns.map((col, i) => {
    const top = (height - (col.length * boxH + (col.length - 1) * ROW_GAP)) / 2;
    return col.map((s, j) => ({ ...s, note: notes[i][j], x: i * (colW + COL_GAP), y: top + j * (boxH + ROW_GAP) }));
  });

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full overflow-visible" role="img" aria-label={describe(columns)}>
      <defs>
        <marker id={arrow} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L8 4L0 8z" className="fill-muted" />
        </marker>
      </defs>

      <g fill="none" strokeWidth="1.4" className="stroke-muted/70">
        {boxes.slice(0, -1).flatMap((col, i) =>
          col.flatMap((a) =>
            boxes[i + 1].map((b) => {
              const x1 = a.x + colW;
              const y1 = a.y + boxH / 2;
              const x2 = b.x - 2;
              const y2 = b.y + boxH / 2;
              const mid = (x1 + x2) / 2;
              return (
                <path
                  key={`${a.name}-${b.name}`}
                  d={`M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`}
                  markerEnd={`url(#${arrow})`}
                />
              );
            }),
          ),
        )}
      </g>

      {boxes.flat().map((b) => (
        <g key={b.name}>
          <rect x={b.x} y={b.y} width={colW} height={boxH} rx="12" className="fill-paper stroke-line" />
          <text x={b.x + 12} y={b.y + NAME_BASE} className="fill-ink text-[13px] font-semibold">
            {b.name}
          </text>
          {b.note.map((line, k) => (
            <text key={k} x={b.x + 12} y={b.y + NOTE_BASE + k * NOTE_LINE} className="fill-muted font-mono text-[10.5px]">
              {line}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

const HEAD_H = 30;
const FIRST_ROW = 66;
const ROW = 40;

/** One lifeline per component, in order of first appearance, and the messages between them top to bottom. */
function SequenceDiagram({ messages }: { messages: Message[] }) {
  const arrow = useId();
  const actors = [...new Set(messages.flatMap((m) => [m.from, m.to]))];
  const colW = W / actors.length;
  const cx = (name: string) => colW * (actors.indexOf(name) + 0.5);
  const headW = Math.min(colW - 10, 124);
  const height = FIRST_ROW + (messages.length - 1) * ROW + 26;

  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="h-auto w-full overflow-visible" role="img" aria-label={messages.map((m, i) => `${i + 1}. ${m.from} to ${m.to}: ${m.label}`).join(". ")}>
      <defs>
        <marker id={arrow} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L8 4L0 8z" className="fill-ink" />
        </marker>
      </defs>

      {actors.map((a) => (
        <g key={a}>
          <line x1={cx(a)} y1={HEAD_H} x2={cx(a)} y2={height} strokeDasharray="3 4" className="stroke-line" />
          <rect x={cx(a) - headW / 2} y="0" width={headW} height={HEAD_H} rx="8" className="fill-paper stroke-line" />
          <text x={cx(a)} y="19" textAnchor="middle" className="fill-ink text-[12px] font-semibold">
            {a}
          </text>
        </g>
      ))}

      {messages.map((m, i) => {
        const y = FIRST_ROW + i * ROW;
        const x1 = cx(m.from);
        const x2 = cx(m.to);
        const label = (
          <>
            <tspan className="fill-ink">{i + 1}</tspan> {m.label}
          </>
        );
        // A component calling itself: a small loop to the right of its lifeline.
        if (x1 === x2) {
          return (
            <g key={i}>
              <path d={`M${x1} ${y - 8}h22v14h-20`} fill="none" strokeWidth="1.4" className="stroke-ink/70" markerEnd={`url(#${arrow})`} />
              <text x={x1 + 30} y={y + 3} className="fill-muted font-mono text-[10.5px]">
                {label}
              </text>
            </g>
          );
        }
        const dir = Math.sign(x2 - x1);
        return (
          <g key={i}>
            <path d={`M${x1} ${y}H${x2 - dir * 2}`} strokeWidth="1.4" className="stroke-ink/70" markerEnd={`url(#${arrow})`} />
            <text x={Math.min(x1, x2) + 8} y={y - 7} className="fill-muted font-mono text-[10.5px]">
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function describe(columns: Step[][]): string {
  return columns.map((col) => col.map((s) => (s.note ? `${s.name} (${s.note})` : s.name)).join(" and ")).join(", then ");
}
