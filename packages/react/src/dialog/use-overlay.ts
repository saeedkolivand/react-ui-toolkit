"use client";

/**
 * The wiring every modal-style overlay needs, over the primitives in `core`.
 *
 * Modal and Drawer differ by about fifteen lines of markup and nothing else, so
 * this is where all the behaviour lives: presence gating, focus trap,
 * dismissable layer, scroll lock, background inert, and the ids that tie the
 * content to its title and description.
 *
 * It returns plain objects rather than rendering anything, so the two callers
 * spread them onto whatever markup they need — and cannot drift apart in the
 * attributes that matter.
 */

import { useCallback, useEffect, useId, useRef, useState, type HTMLAttributes } from "react";
import {
  ariaAttr,
  createFocusTrap,
  createPresence,
  dataAttr,
  lockScroll,
  pushDismissable,
  type Presence,
} from "@crosskit-ui/core";

export interface OverlayOptions {
  /** Controlled. Leave undefined and the overlay manages its own state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  /**
   * Every route out that the user initiated — Escape, a press outside — before
   * the overlay closes. The caller's own Cancel button calls the same function,
   * so a consumer has one place to handle "the user backed out".
   */
  onDismiss?: () => void;
  role?: "dialog" | "alertdialog";
  /** Traps focus, locks scroll and makes the background inert. */
  modal?: boolean;
  closeOnEscape?: boolean;
  /** Defaults to false for `alertdialog`, which must be answered rather than dismissed. */
  closeOnInteractOutside?: boolean;
  id?: string;
  hasTitle?: boolean;
  hasDescription?: boolean;
}

type Div = HTMLAttributes<HTMLElement> & Record<`data-${string}`, string | undefined>;

export interface Overlay {
  /** Whether to render at all. Gates on presence, never on `open`. */
  present: boolean;
  open: boolean;
  close: () => void;
  setOpen: (open: boolean) => void;
  backdropProps: Div;
  positionerProps: Div;
  contentProps: Div & { ref: (node: HTMLElement | null) => void; tabIndex: number };
  titleProps: Div;
  descriptionProps: Div;
}

/**
 * Everything outside the overlay, hidden from assistive technology.
 *
 * `inert` rather than `aria-hidden`: it removes the subtree from the
 * accessibility tree *and* stops it receiving focus or clicks, so a screen
 * reader's own navigation — which does not use Tab and therefore never meets
 * the focus trap — cannot walk out of the dialog into the page behind it.
 *
 * Applied to body children rather than to one wrapper, because the overlay is
 * portalled and is therefore a sibling of the app root, not a descendant.
 *
 * That sweeps up the overlay's own backdrop, which is a body child that does not
 * contain the content. Harmless rather than intended: the backdrop holds nothing
 * and the positioner covers it anyway. Give the backdrop content one day and this
 * needs an exclusion.
 */
function inertBackground(content: HTMLElement): () => void {
  const changed: HTMLElement[] = [];
  for (const child of [...document.body.children]) {
    if (!(child instanceof HTMLElement) || child.contains(content) || child.inert) continue;
    child.inert = true;
    changed.push(child);
  }
  return () => {
    for (const child of changed) child.inert = false;
  };
}

export function useOverlay(options: OverlayOptions): Overlay {
  const {
    open: controlled,
    defaultOpen = false,
    onOpenChange,
    onDismiss,
    role = "dialog",
    modal = true,
    closeOnEscape = true,
    closeOnInteractOutside = role !== "alertdialog",
    hasTitle = false,
    hasDescription = false,
  } = options;

  const generatedId = useId();
  const id = options.id ?? generatedId;
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = controlled ?? uncontrolled;

  const [content, setContent] = useState<HTMLElement | null>(null);
  const [present, setPresent] = useState(open);

  // Built once and kept, so an exit already in flight is not restarted by a
  // re-render. `useState`'s initialiser rather than a ref, which would run
  // `createPresence` on every render only to discard the result.
  const [presence] = useState<Presence>(() => createPresence(open, { onChange: setPresent }));

  // Held in a ref and read at call time, so `setOpen` and `close` keep a stable
  // identity across renders.
  //
  // Without this the setup effect below depends transitively on `onOpenChange`,
  // and an inline arrow — the idiomatic way to write it — is a new identity every
  // render. The effect then tore down and rebuilt the trap, the layer, the lock
  // and the inert background on *every render while open*: focus jumped to the
  // first tabbable mid-typing, the layer was re-pushed to the top of the stack so
  // Escape closed the wrong dialog, and the body scroll position was restored and
  // re-taken each time.
  const callbacksRef = useRef({ onOpenChange, onDismiss });
  // Written in an effect, not during render: a ref must not be mutated while
  // rendering. Nothing reads it before then — every reader is a DOM event
  // handler, which cannot fire until after the commit.
  useEffect(() => {
    callbacksRef.current = { onOpenChange, onDismiss };
  });

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next);
      callbacksRef.current.onOpenChange?.({ open: next });
    },
    [controlled]
  );
  const close = useCallback(() => setOpen(false), [setOpen]);

  // What the user backing out runs: the caller's handler first, then the close.
  const dismiss = useCallback(() => {
    callbacksRef.current.onDismiss?.();
    setOpen(false);
  }, [setOpen]);

  useEffect(() => presence.setNode(content), [presence, content]);
  useEffect(() => presence.setOpen(open), [presence, open]);
  useEffect(() => () => presence.destroy(), [presence]);

  // Everything here is torn down in the reverse of the order it was set up:
  // focus must return to the trigger *after* the background stops being inert,
  // or the element it returns to is still unfocusable.
  useEffect(() => {
    if (!open || !content) return;

    const trap = modal ? createFocusTrap(() => content) : null;
    const uninert = modal ? inertBackground(content) : null;
    const unlock = modal ? lockScroll() : null;
    trap?.activate();

    const removeLayer = pushDismissable(() => content, {
      onDismiss: dismiss,
      escape: closeOnEscape,
      outside: closeOnInteractOutside,
      // A trapped layer cannot lose focus outward on its own, so a focusin
      // outside it is never the user leaving. It is, routinely, the layer above
      // restoring focus to its trigger as it closes — which used to dismiss this
      // one in the same tick, closing two nested dialogs on one Escape.
      focus: !modal,
    });

    return () => {
      removeLayer();
      unlock?.();
      uninert?.();
      trap?.deactivate();
    };
  }, [open, content, modal, closeOnEscape, closeOnInteractOutside, dismiss]);

  const state = open ? "open" : "closed";
  const scope = { "data-scope": "dialog", "data-state": state } as const;

  return {
    present,
    open,
    close,
    setOpen,
    backdropProps: { ...scope, "data-part": "backdrop" },
    positionerProps: { ...scope, "data-part": "positioner" },
    contentProps: {
      ...scope,
      "data-part": "content",
      ref: setContent,
      role,
      // `ariaAttr`, not a raw boolean: aria-* takes the string "true" or nothing
      // at all. Only claimed when it is true, too — a non-modal dialog that says
      // `aria-modal` makes a screen reader ignore the rest of the page for no
      // reason.
      "aria-modal": ariaAttr(modal),
      "aria-labelledby": hasTitle ? `${id}:title` : undefined,
      "aria-describedby": hasDescription ? `${id}:description` : undefined,
      // So the trap has somewhere to put focus when the dialog holds nothing
      // focusable — otherwise focus stays on the trigger behind the backdrop.
      tabIndex: -1,
      "data-modal": dataAttr(modal),
    },
    titleProps: { ...scope, "data-part": "title", id: `${id}:title` },
    descriptionProps: { ...scope, "data-part": "description", id: `${id}:description` },
  };
}
