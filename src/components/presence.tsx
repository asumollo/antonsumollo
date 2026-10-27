"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BEAT_MS = 20_000;
const FACES = 3;
/** Avatar seeds for the one extra "visitor" always added to the count, so the dock never looks empty. */
const EXTRA_SEEDS = ["3f9a1c07b2e4", "a71d5e90c3f8", "5c2b8e14d9a6", "e04f7a3b61c2", "9b6d2f8c05e1", "71e3a9c4b8d0"];

type Presence = { path: string; count: number; faces: string[] };

/** One random ID per browser, so two tabs count as one visitor. Nothing ties it to a person. */
function visitorId() {
  try {
    const saved = localStorage.getItem("visitor");
    if (saved) return saved;
    const id = crypto.randomUUID();
    localStorage.setItem("visitor", id);
    return id;
  } catch {
    return crypto.randomUUID(); // storage blocked: a fresh ID for this visit
  }
}

const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}&backgroundColor=c0aede,d1d4f9,ffd5dc,ffdfbf,b6e3f4`;

/**
 * Counts visitors on the current page. Beats while the tab is visible, and leaves when it's hidden,
 * closed, or the visitor moves to another page.
 */
function usePresence() {
  const path = usePathname();
  const [state, setState] = useState<Presence | null>(null);

  useEffect(() => {
    const id = visitorId();
    const body = JSON.stringify({ id, path });
    // A new extra face on each page, but the same one for the whole visit to that page.
    const extra = EXTRA_SEEDS[Math.floor(Math.random() * EXTRA_SEEDS.length)];
    let timer: ReturnType<typeof setInterval> | undefined;

    const beat = () =>
      fetch("/api/presence", { method: "POST", body })
        .then((r) => (r.ok ? r.json() : null))
        .then(
          (data) => data && setState({ path, count: data.count + 1, faces: [extra, ...data.faces].slice(0, FACES) }),
        )
        .catch(() => {});
    const leave = () => fetch("/api/presence", { method: "DELETE", body, keepalive: true }).catch(() => {});

    const start = () => {
      beat();
      timer = setInterval(beat, BEAT_MS);
    };
    const stop = () => {
      clearInterval(timer);
      leave();
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", leave);
    return () => {
      clearInterval(timer);
      leave();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", leave);
    };
  }, [path]);

  // Until the new page answers, don't show the old page's count.
  return state?.path === path ? state : null;
}

/** At least one other visitor on this page, or null. The dock hides the presence UI when this is null. */
export function useOthersHere() {
  const presence = usePresence();
  return presence && presence.count > 1 ? presence : null;
}

/** "● (faces)³" slot inside the dock: the count sits as a badge on the last face. Display only; the full sentence shows in a tooltip on hover. */
export function PresenceSlot({ count, faces }: { count: number; faces: string[] }) {
  const label = `${count} viewing the same page now`;
  return (
    <>
      <span className="mx-1 h-6 w-px bg-line" aria-hidden />
      <span role="status" aria-label={label} className="group relative inline-flex h-11 items-center gap-2 pl-2.5 pr-3">
        <LiveDot />
        <span className="relative flex">
          <Faces seeds={faces} />
          <span
            aria-hidden
            className="absolute -bottom-0.5 -right-2 grid h-4 min-w-4 place-items-center rounded-full border-2 border-surface bg-ink px-1 font-mono text-[10px] font-medium leading-none tabular-nums text-paper"
          >
            {count}
          </span>
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 font-mono text-[11px] text-paper opacity-0 transition-opacity group-hover:opacity-100"
        >
          {label}
        </span>
      </span>
    </>
  );
}

function LiveDot() {
  return (
    <span className="relative grid h-2 w-2 place-items-center" aria-hidden>
      <span className="absolute h-full w-full rounded-full bg-ok opacity-60 motion-safe:animate-ping" />
      <span className="h-2 w-2 rounded-full bg-ok" />
    </span>
  );
}

function Faces({ seeds }: { seeds: string[] }) {
  return (
    <span className="inline-flex items-center" aria-hidden>
      {seeds.map((s) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={s}
          src={avatar(s)}
          alt=""
          className="-ml-[7px] h-[22px] w-[22px] rounded-full border-2 border-surface bg-paper first:ml-0 motion-safe:animate-[face-in_300ms_ease-out]"
        />
      ))}
    </span>
  );
}
