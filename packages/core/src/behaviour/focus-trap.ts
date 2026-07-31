/**
 * Focus trapping.
 *
 * The whole job is three things: put focus somewhere sensible on open, stop Tab
 * leaving, and put focus back where it was on close. Each is short; getting any
 * of them wrong is the difference between a dialog that works with a keyboard
 * and one that does not.
 *
 * Tab is handled on `keydown` rather than by sentinel elements at each end.
 * Sentinels are the other common approach and they leak: a browser's own
 * chrome, an extension, or a `tabindex` change between renders moves focus
 * without any key event, and the sentinel never fires.
 */

import { activeElement, contains, getTabbables } from "./dom";

export interface FocusTrapOptions {
  /** Where focus goes on activation. Defaults to the first tabbable element. */
  initialFocus?: HTMLElement | (() => HTMLElement | null) | null;
  /**
   * Where focus returns on deactivation. Defaults to whatever had focus when
   * the trap was created — captured then, not on deactivate, by which time it
   * has already moved into the trap.
   */
  returnFocus?: HTMLElement | (() => HTMLElement | null) | null;
  /** Called when Tab would leave the trap and is wrapped instead. */
  onWrap?: (direction: "forward" | "backward") => void;
}

export interface FocusTrap {
  activate(): void;
  deactivate(): void;
}

const resolve = (target: FocusTrapOptions["initialFocus"]): HTMLElement | null =>
  typeof target === "function" ? target() : (target ?? null);

/**
 * Focus without scrolling.
 *
 * `preventScroll` matters because the element being focused is usually inside a
 * container that just appeared: scrolling to it yanks the page behind the
 * overlay, which is visible the moment the overlay closes.
 */
const focus = (element: HTMLElement | null) => element?.focus({ preventScroll: true });

export function createFocusTrap(
  container: () => HTMLElement | null,
  options: FocusTrapOptions = {}
): FocusTrap {
  // Captured at creation, before anything inside the trap has taken focus.
  const trigger = activeElement();
  let active = false;

  const onKeyDown = (event: KeyboardEvent) => {
    if (!active || event.key !== "Tab") return;
    const node = container();
    if (!node) return;

    const tabbables = getTabbables(node);
    if (tabbables.length === 0) {
      // Nothing to move to, so Tab must not escape. The container itself holds
      // focus — an empty dialog is still a trap.
      event.preventDefault();
      focus(node);
      return;
    }

    const first = tabbables[0]!;
    const last = tabbables[tabbables.length - 1]!;
    const current = activeElement();

    // Focus already outside — a stray programmatic move, or the trap opening
    // while focus sat elsewhere. Pull it back rather than letting Tab continue
    // from wherever it is.
    if (!contains(node, current)) {
      event.preventDefault();
      focus(event.shiftKey ? last : first);
      return;
    }

    if (event.shiftKey && current === first) {
      event.preventDefault();
      focus(last);
      options.onWrap?.("backward");
    } else if (!event.shiftKey && current === last) {
      event.preventDefault();
      focus(first);
      options.onWrap?.("forward");
    }
  };

  return {
    activate() {
      if (active) return;
      active = true;
      // Capture phase: a consumer's own keydown handler must not be able to
      // stop propagation and let Tab escape.
      document.addEventListener("keydown", onKeyDown, true);

      const node = container();
      if (!node) return;
      const explicit = resolve(options.initialFocus);
      if (explicit) return void focus(explicit);
      const [firstTabbable] = getTabbables(node);
      if (firstTabbable) return void focus(firstTabbable);
      // Nothing focusable inside: focus the container so the trap still holds
      // and a screen reader lands in the right place. It needs a tabindex,
      // which the adapter renders.
      focus(node);
    },

    deactivate() {
      if (!active) return;
      active = false;
      document.removeEventListener("keydown", onKeyDown, true);

      const target = options.returnFocus === undefined ? trigger : resolve(options.returnFocus);
      // Only restore if focus is still inside the trap. If something else has
      // deliberately taken focus during close, stealing it back is worse than
      // doing nothing.
      const node = container();
      if (node && !contains(node, activeElement())) return;
      if (target?.isConnected) focus(target);
    },
  };
}
