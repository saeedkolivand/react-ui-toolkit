"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  children: ReactNode;
  /** Defaults to `document.body`, which is the only target that reliably works. */
  container?: HTMLElement | null;
}

/**
 * Renders into `document.body` rather than in place.
 *
 * Not a convenience. An anchored overlay's positioner writes viewport
 * coordinates and sets `position: fixed`, and `fixed` is captured by any
 * ancestor with a `transform`, `filter`, `perspective`, `backdrop-filter`,
 * `contain: paint`, or a `will-change` naming one of those — that ancestor
 * becomes the containing block and the popup lands somewhere else entirely.
 * Nothing in `core` can detect or prevent that, so portalling is the fix, and
 * it has to happen at the adapter.
 *
 * React-only, deliberately. Vue has `<Teleport>` and Svelte has an action, both
 * better than a component wrapping them, so this is not the missing quarter of a
 * four-adapter component — it is the React idiom for a thing the other three
 * already express natively.
 *
 * Nothing renders until after hydration, so the server and the first client
 * render agree — `document` does not exist during SSR, and portalling on the
 * hydration pass produces a mismatch.
 *
 * `useSyncExternalStore` rather than an effect that calls `setState`: it has a
 * server snapshot built in, so this is one render rather than a render, an
 * effect and a second render — and it is the state React itself already tracks,
 * not a copy of it kept in sync.
 */
const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function Portal({ children, container }: PortalProps) {
  const hydrated = useSyncExternalStore(subscribe, onClient, onServer);
  if (!hydrated) return null;
  return createPortal(children, container ?? document.body);
}
