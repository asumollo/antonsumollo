"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * Whether this is a Mac, iPhone or iPad. navigator.platform is deprecated, but its replacement
 * (userAgentData) is Chromium-only, and platform still works in every browser.
 */
function onMac() {
  return /Mac|iPhone|iPad/.test(navigator.platform);
}

/**
 * Whether to label shortcuts ⌘ instead of Ctrl. The server can't know, so it renders the Ctrl
 * labels and the browser swaps them in after hydrating.
 */
export function useIsMac() {
  return useSyncExternalStore(noop, onMac, () => false);
}

/** True for ⌘ on a Mac and Ctrl elsewhere: the key the platform uses for app shortcuts. */
export function isModKey(e: KeyboardEvent) {
  return onMac() ? e.metaKey : e.ctrlKey;
}
