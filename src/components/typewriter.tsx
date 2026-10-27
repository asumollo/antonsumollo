"use client";

import { useEffect, useState } from "react";

/** Types through each phrase, pauses, deletes, moves on. Static for reduced motion. */
export function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0] ?? "");

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let length = words[0].length;
    let deleting = true;
    let timer: number;

    const tick = () => {
      if (deleting) {
        length -= 1;
        setText(words[index].slice(0, length));
        if (length === 0) {
          deleting = false;
          index = (index + 1) % words.length;
          timer = window.setTimeout(tick, 300);
          return;
        }
        timer = window.setTimeout(tick, 30);
      } else {
        length += 1;
        setText(words[index].slice(0, length));
        if (length === words[index].length) {
          deleting = true;
          timer = window.setTimeout(tick, 2400);
          return;
        }
        timer = window.setTimeout(tick, 65);
      }
    };

    timer = window.setTimeout(tick, 2600);
    return () => window.clearTimeout(timer);
  }, [words]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {text}
        <span className="caret" />
      </span>
    </>
  );
}
