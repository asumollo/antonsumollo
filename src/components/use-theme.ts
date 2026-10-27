"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

function read(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Current theme plus a toggle. Every component using it stays in sync. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, read, () => "light");

  const toggle = useCallback(() => {
    const next: Theme = read() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // storage blocked; the theme still changes for this visit
    }
  }, []);

  return { theme, toggle };
}
