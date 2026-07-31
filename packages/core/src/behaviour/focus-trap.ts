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

/**
 * The active traps, newest last. Only the topmost handles Tab.
 *
 * A stack for the same reason `dismissable` has one, and it was missing here.
 * Each trap used to own a document-level keydown listener, and nothing removed
 * the outer one when an inner overlay opened — so with two dialogs open both
 * fired, outer first. The inner overlay marks the outer positioner `inert`, and
 * `isTabbable` rejects anything inside `[inert]`, so the outer trap saw an empty
 * container, took its "nothing to move to" branch and called `preventDefault()`
 * on every Tab. The inner trap then ran on an already-cancelled event and only
 * moved focus at its two wrap boundaries. Net effect in a browser: Tab from the
 * middle of a nested dialog did nothing at all, while Tab from the last element
 * still wrapped — which reads as intermittent rather than broken.
 *
 * One listener, shared, acting on the top of the stack. A trap below stands down
 * while a newer one is above it and resumes the moment that one leaves, with no
 * work at either site.
 */
interface ActiveTrap {
  container: () => HTMLElement | null;
  options: FocusTrapOptions;
}

const stack: ActiveTrap[] = [];

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== "Tab") return;
  const trap = stack[stack.length - 1];
  if (!trap) return;
  const node = trap.container();
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
    trap.options.onWrap?.("backward");
  } else if (!event.shiftKey && current === last) {
    event.preventDefault();
    focus(first);
    trap.options.onWrap?.("forward");
  }
}

/** How many traps are active. Exposed so tests can assert cleanup is balanced. */
export const focusTrapDepth = () => stack.length;

export function createFocusTrap(
  container: () => HTMLElement | null,
  options: FocusTrapOptions = {}
): FocusTrap {
  // Captured at `activate()`, not here.
  //
  // Adapters build the trap at mount — mandatory in Angular, where the machine
  // must be a field initializer — so capturing at construction records whatever
  // had focus when the component mounted, usually `<body>`, and closing the
  // dialog would send focus there instead of back to the trigger.
  let trigger: HTMLElement | null = null;
  let entry: ActiveTrap | null = null;

  return {
    activate() {
      if (entry) return;
      // Read before anything inside the trap takes focus.
      trigger = activeElement();
      entry = { container, options };
      // The listener exists only while a trap does, so a page with no overlay
      // open carries no document-level handler at all.
      if (stack.length === 0) {
        // Capture phase: a consumer's own keydown handler must not be able to
        // stop propagation and let Tab escape.
        document.addEventListener("keydown", onKeyDown, true);
      }
      stack.push(entry);

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
      if (!entry) return;
      // Spliced by identity, not popped: traps can close out of order, and
      // popping would remove whichever happened to be on top.
      const index = stack.indexOf(entry);
      entry = null;
      if (index !== -1) stack.splice(index, 1);
      if (stack.length === 0) document.removeEventListener("keydown", onKeyDown, true);

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
