import { Fragment } from "react";

/** Turns **bold** and ==highlight== markers into elements. Nothing else is parsed. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-bold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("==") && part.endsWith("==")) {
          return <mark key={i}>{part.slice(2, -2)}</mark>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function plainText(text: string) {
  return text.replace(/\*\*|==/g, "");
}
