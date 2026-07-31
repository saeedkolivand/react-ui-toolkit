/**
 * Keeping a node mounted through its exit animation.
 *
 * Without this, a component unmounts the instant `open` flips, `data-state`
 * never gets a frame at `"closed"`, and every exit animation silently does
 * nothing — the failure CONTRIBUTING calls out, and the reason "no animation
 * library" is a real claim rather than "no exit animations".
 *
 * The contract is one boolean: `present` stays true after `open` goes false,
 * until the animation actually ends.
 */

export interface PresenceOptions {
  /** Notified whenever `present` changes. */
  onChange?: (present: boolean) => void;
  /**
   * Upper bound on how long to wait for an animation that may never fire.
   * A node that is `display: none` at close time, a browser that drops the
   * event, or `prefers-reduced-motion` collapsing the duration to zero would
   * otherwise leave the node mounted forever.
   */
  timeout?: number;
}

export interface Presence {
  /** Whether the node should be in the document. */
  readonly present: boolean;
  /** Call when `open` changes. */
  setOpen(open: boolean): void;
  /** Call when the node mounts or unmounts. */
  setNode(node: HTMLElement | null): void;
  destroy(): void;
}

const DEFAULT_TIMEOUT = 1000;

export function createPresence(open: boolean, options: PresenceOptions = {}): Presence {
  let present = open;
  let node: HTMLElement | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  /**
   * Bumped whenever a pending exit stops being valid.
   *
   * The scheduled frame cannot be cancelled by checking `present`: an exit is
   * the only thing that sets it false, so it is always still true when the
   * frame runs. Reopening inside the same frame — routine for a tooltip, and
   * what a double-invoked effect produces — therefore let the callback attach
   * to the *enter* animation and unmount the node when that finished.
   */
  let generation = 0;

  const set = (next: boolean) => {
    if (present === next) return;
    present = next;
    options.onChange?.(next);
  };

  const clear = () => {
    // Invalidates any frame already scheduled, as well as the timer.
    generation++;
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    node?.removeEventListener("animationend", onEnd);
    node?.removeEventListener("transitionend", onEnd);
    node?.removeEventListener("animationcancel", onEnd);
  };

  function onEnd(event: Event) {
    // Only the element's own animation ends the exit. A child's finishing
    // first would unmount the parent mid-animation, which reads as a flicker.
    if (event.target !== node) return;
    clear();
    set(false);
  }

  const beginExit = () => {
    clear();
    if (!node) return void set(false);
    const exit = ++generation;

    // Read after a frame: the adapter has to render `data-state="closed"`
    // before the animation it triggers can be observed, and asking now would
    // always see the enter animation or nothing at all.
    requestAnimationFrame(() => {
      if (!node || exit !== generation) return;
      // Optional, not assumed. Without the guard this throws wherever
      // `getAnimations` is missing — jsdom, and any embedded engine — and the
      // throw happens inside a rAF callback, so nothing catches it and the node
      // stays mounted forever. Absent means "cannot be animating", which is the
      // safe reading: unmount now rather than never.
      const animated = node
        .getAnimations?.({ subtree: false })
        .some(animation => animation.playState === "running");

      if (!animated) return void set(false);

      node.addEventListener("animationend", onEnd);
      node.addEventListener("transitionend", onEnd);
      node.addEventListener("animationcancel", onEnd);
      timer = setTimeout(() => {
        clear();
        set(false);
      }, options.timeout ?? DEFAULT_TIMEOUT);
    });
  };

  return {
    get present() {
      return present;
    },

    setOpen(next: boolean) {
      if (next) {
        clear();
        set(true);
      } else if (present) {
        beginExit();
      }
    },

    setNode(next: HTMLElement | null) {
      node = next;
    },

    destroy() {
      clear();
      node = null;
    },
  };
}
