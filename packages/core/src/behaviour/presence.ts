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

  const set = (next: boolean) => {
    if (present === next) return;
    present = next;
    options.onChange?.(next);
  };

  const clear = () => {
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

    // Read after a frame: the adapter has to render `data-state="closed"`
    // before the animation it triggers can be observed, and asking now would
    // always see the enter animation or nothing at all.
    requestAnimationFrame(() => {
      if (!node || present === false) return;
      const animated = node.getAnimations({ subtree: false }).some(a => a.playState === "running");

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
