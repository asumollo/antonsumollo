"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/site.config";
import type { ProjectSummary } from "@/lib/projects";
import { AskPanel } from "./ask-panel";
import { ContactPopup } from "./contact-popup";
import { FolderIcon, HomeIcon, LaptopIcon, SparkIcon } from "./icons";
import { PresenceSlot, useOthersHere } from "./presence";
import { isModKey, useIsMac } from "./use-is-mac";

const item =
  "grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-paper hover:text-ink";

/** Floating bar at the bottom of every page. */
export function Dock({ projects }: { projects: ProjectSummary[] }) {
  const [askOpen, setAskOpen] = useState(false);
  const others = useOthersHere();
  const mac = useIsMac();

  // ⌘K on a Mac, Ctrl+K elsewhere, opens or closes the drawer from anywhere on the page.
  useEffect(() => {
    if (!site.assistant.enabled) return;
    const onKey = (e: KeyboardEvent) => {
      // A popup like the resume is on top; the drawer would open behind it.
      if (e.key.toLowerCase() !== "k" || !isModKey(e) || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      setAskOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav
        aria-label="Quick links"
        className="fixed left-1/2 z-40 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-line bg-surface/90 p-1.5 shadow-[0_10px_30px_-12px_rgba(20,23,28,0.35)] backdrop-blur-md"
        style={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))" }}
      >
        <Link href="/#top" className={item} aria-label="Back to top" title="Home">
          <HomeIcon />
        </Link>
        <Link href="/#projects" className={item} aria-label="Projects" title="Projects">
          <FolderIcon />
        </Link>
        <Link href="/#gear" className={item} aria-label="Gear" title="Gear">
          <LaptopIcon />
        </Link>

        {others && <PresenceSlot count={others.count} faces={others.faces} />}

        {site.assistant.enabled && (
          <>
            <span className="mx-1 h-6 w-px bg-line" aria-hidden />
            <span className="ask-ring">
              <button
                type="button"
                onClick={() => setAskOpen((v) => !v)}
                aria-expanded={askOpen}
                aria-controls="ask-panel"
                aria-keyshortcuts={mac ? "Meta+K" : "Control+K"}
                title={mac ? "Ask about me (⌘K)" : "Ask about me (Ctrl+K)"}
                className="inline-flex h-[42px] items-center gap-2 rounded-full bg-surface pl-3.5 pr-4 text-[15px] font-semibold text-ink transition-colors hover:bg-paper focus-visible:[outline-offset:-4px]"
              >
                <SparkIcon className="h-[18px] w-[18px] text-accent" />
                <span className="hidden sm:inline">Ask about me</span>
                <span className="sm:hidden">Ask</span>
                {/* Phones have no keyboard, so the shortcut only shows from 640px up. */}
                <kbd
                  aria-hidden
                  className="hidden rounded-[6px] border border-line px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted sm:inline"
                >
                  {mac ? "⌘K" : "Ctrl K"}
                </kbd>
              </button>
            </span>
          </>
        )}
      </nav>

      {askOpen && <AskPanel projects={projects} onClose={() => setAskOpen(false)} />}
      {/* Outside the drawer so it doesn't pick up the drawer's terminal font. */}
      {site.assistant.enabled && <ContactPopup />}
    </>
  );
}
