"use client";

import { useTheme } from "./use-theme";

/** A wall light switch in the hero corner. Flipping it toggles the theme. */
export function LightSwitch() {
  const { theme, toggle } = useTheme();
  const on = theme === "light";

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={on ? "Lights on. Switch to dark mode" : "Lights off. Switch to light mode"}
        onClick={toggle}
        className="group relative grid h-[76px] w-[52px] cursor-pointer place-items-center rounded-[10px] border border-line bg-surface shadow-[0_1px_0_var(--line),0_6px_14px_-8px_rgba(20,23,28,0.35)]"
      >
        {/* screws */}
        <span className="absolute top-[6px] h-[4px] w-[4px] rounded-full bg-line" />
        <span className="absolute bottom-[6px] h-[4px] w-[4px] rounded-full bg-line" />
        {/* rocker */}
        <span className="relative h-[40px] w-[24px] overflow-hidden rounded-[5px] border border-line bg-paper [perspective:80px]">
          <span
            className="rocker absolute inset-0 rounded-[4px]"
            style={{
              transform: on ? "rotateX(14deg)" : "rotateX(-14deg)",
              background: on
                ? "linear-gradient(to bottom, var(--surface) 0%, var(--surface) 50%, var(--line) 50%, var(--grid) 100%)"
                : "linear-gradient(to bottom, var(--grid) 0%, var(--line) 50%, var(--surface) 50%, var(--surface) 100%)",
            }}
          />
          <span
            className="absolute left-1/2 h-[3px] w-[8px] -translate-x-1/2 rounded-full transition-[top,background-color] duration-200"
            style={{ top: on ? 7 : 30, background: on ? "var(--accent)" : "var(--muted)" }}
          />
        </span>
      </button>
      <span className="font-hand text-[19px] leading-none text-muted" aria-hidden>
        {on ? "lights off?" : "lights on?"}
      </span>
    </div>
  );
}
