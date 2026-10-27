"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (old browser or insecure page): open their mail app instead.
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy email"}
      title={copied ? "Copied" : "Copy email"}
      className="grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-surface text-ink hover:border-muted/50"
    >
      {copied ? <CheckIcon className="h-[18px] w-[18px] text-ok" /> : <CopyIcon className="h-[18px] w-[18px]" />}
    </button>
  );
}
