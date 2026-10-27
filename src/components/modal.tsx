"use client";

import { useRef } from "react";
import { CloseIcon } from "./icons";

/**
 * A button that opens its children in a popup. Esc, the close button or a click outside closes it.
 * Leave out `triggerClassName` for a popup with no button of its own, opened elsewhere by its `id`.
 */
export function Modal({
  id,
  label,
  trigger,
  triggerLabel,
  triggerClassName,
  size = "default",
  children,
}: {
  /** Set on the popup itself, so other code can open it with showModal(). */
  id?: string;
  /** Name of the popup for screen readers. */
  label: string;
  trigger?: React.ReactNode;
  /** Name of the trigger button, for when `trigger` has no visible text. */
  triggerLabel?: string;
  triggerClassName?: string;
  /** "wide" is a tall, near-full-screen popup for documents like the resume. */
  size?: "default" | "wide";
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      {triggerClassName && (
        <button
          type="button"
          onClick={() => ref.current?.showModal()}
          aria-haspopup="dialog"
          aria-label={triggerLabel}
          className={triggerClassName}
        >
          {trigger}
        </button>
      )}

      <dialog
        id={id}
        ref={ref}
        aria-label={label}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
        className={`m-auto overflow-hidden ${
          size === "wide"
            ? "h-[min(90vh,1100px)] max-h-[90vh] w-[min(900px,calc(100vw-32px))]"
            : "max-h-[min(80vh,720px)] w-[min(640px,calc(100vw-32px))]"
        } rounded-[20px] border border-line bg-surface p-0 text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] backdrop:bg-[rgba(10,12,16,0.45)] backdrop:backdrop-blur-[2px]`}
      >
        <div className={`relative flex max-h-[inherit] flex-col ${size === "wide" ? "h-full" : ""}`}>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface text-muted hover:bg-paper hover:text-ink"
          >
            <CloseIcon className="h-[18px] w-[18px]" />
          </button>
          <div className={`overflow-y-auto ${size === "wide" ? "flex-1" : ""}`}>{children}</div>
        </div>
      </dialog>
    </>
  );
}
