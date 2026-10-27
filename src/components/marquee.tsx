"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A row that drifts sideways on its own and can still be scrolled by hand.
 * The content is rendered twice so the scroll position can wrap without a visible jump.
 */
export function Marquee({ children, reverse = false, speed = 28 }: { children: ReactNode; reverse?: boolean; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const loop = () => el.scrollWidth / 2;
    let pos = reverse ? loop() : 0;
    let last = performance.now();
    let resumeAt = 0;
    let raf = 0;
    el.scrollLeft = pos;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (now < resumeAt) {
        // The visitor is in control: follow their position, and wrap it so they never hit an end.
        if (el.scrollLeft >= loop()) el.scrollLeft -= loop();
        else if (el.scrollLeft <= 0) el.scrollLeft += loop();
        pos = el.scrollLeft;
      } else {
        pos += ((reverse ? -1 : 1) * speed * dt) / 1000;
        if (pos >= loop()) pos -= loop();
        if (pos <= 0) pos += loop();
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };

    // Touch and wheel scrolling pause the drift for a moment after the last input.
    const nudge = () => (resumeAt = performance.now() + 1500);

    el.addEventListener("wheel", nudge, { passive: true });
    el.addEventListener("touchmove", nudge, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("wheel", nudge);
      el.removeEventListener("touchmove", nudge);
    };
  }, [reverse, speed]);

  return (
    <div
      ref={ref}
      className="overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="flex w-max gap-2">
        <ul className="flex gap-2">{children}</ul>
        <ul className="flex gap-2" aria-hidden>
          {children}
        </ul>
      </div>
    </div>
  );
}
