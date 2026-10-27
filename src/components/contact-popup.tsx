"use client";

import { site } from "@/site.config";
import { ContactForm } from "./contact-form";
import { CopyEmail } from "./copy-email";
import { Modal } from "./modal";

const ID = "contact-popup";

/** Opens the contact popup. Falls back to the visitor's mail app if the popup isn't on the page. */
export function openContact() {
  const popup = document.getElementById(ID);
  if (popup instanceof HTMLDialogElement) popup.showModal();
  else window.location.href = `mailto:${site.email}`;
}

/**
 * The contact form in a popup, for the Ask drawer. Visitors can message Anton without closing the
 * drawer, so the conversation is still there when they're done.
 */
export function ContactPopup() {
  return (
    <Modal id={ID} label={`Message ${site.shortName.split(" ")[0]}`}>
      <div className="flex flex-col gap-4 p-6">
        <div className="pr-10">
          <h2 className="text-[18px] font-semibold">Message {site.shortName.split(" ")[0]}</h2>
          <p className="mt-1 text-[14px] text-muted">
            It goes straight to my inbox at {site.email}, and I&apos;ll reply there.
          </p>
        </div>
        <ContactForm>
          <CopyEmail email={site.email} />
        </ContactForm>
      </div>
    </Modal>
  );
}
