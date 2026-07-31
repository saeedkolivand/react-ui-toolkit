// Keeps a node mounted through its exit animation so CSS can key off
// [data-state="closed"]. Without it the node unmounts the instant `open` flips
// false and every exit animation silently does nothing — which is what makes
// "framer-motion is deleted" true rather than "deleted, and exit animations gone".
import {
  computed,
  Directive,
  ElementRef,
  inject,
  Injector,
  input,
  type Signal,
} from "@angular/core";
import * as presence from "@zag-js/presence";
import { useMachine } from "./machine";
import { normalizeProps } from "./normalize-props";

export interface PresenceApi {
  present: Signal<boolean>;
  setNode: (el: HTMLElement | null) => void;
}

export function usePresence(props: () => { present: boolean }, _injector?: Injector): PresenceApi {
  const service = useMachine(presence.machine, () => ({ present: props().present }));
  const api = computed(() => presence.connect(service, normalizeProps));
  return {
    // The OR with the raw input is load-bearing on entry, and it is what fixed
    // the intermittent "dialog opens but Escape does nothing".
    //
    // Reaching the presence machine's `mounted` state costs two Angular ticks:
    // a `track` effect has to observe `present` and send PRESENCE.CHANGED, then
    // the template has to render. Meanwhile the *dialog* machine's entry effects
    // — the focus trap and the dismissable-element listener that handles Escape
    // — defer by exactly one requestAnimationFrame and then resolve their target
    // element, bailing SILENTLY if it is null. Whether the node won that race was
    // a coin flip, which is why it failed on a different iteration every run
    // while ARIA stayed perfectly correct.
    //
    // Reading the input directly means the node is in the template on the very
    // first flush, so there is no race left. The machine's own `present` still
    // governs the exit, which is the half that actually needs a state machine.
    present: computed(() => props().present || api().present),
    // Never forwards null. Angular can construct the next node's directive
    // before destroying the previous one's, so a teardown that nulls
    // unconditionally can wipe the node the machine has only just been handed —
    // and zag's effects then bail silently on the null. A new element always
    // replaces the old one, so clearing is unnecessary; at most one detached
    // node is held, until the next open.
    setNode: (el: HTMLElement | null) => {
      if (el) api().setNode(el);
    },
  };
}

/**
 * Hands the animated element to a presence machine.
 *
 * A directive rather than viewChild + effect, because the machine needs the node
 * before it can do anything useful: `setupNode` captures
 * getComputedStyle(node), and on exit `syncPresence` reads those styles to
 * decide whether to unmount immediately or suspend for the animation. If the
 * node never arrives, BOTH paths misbehave — a null style set reports animation
 * "none" so it unmounts instantly (killing the animation), while
 * `trackAnimationEvents` bails on a null node so once suspended it never
 * unmounts at all. Those were the exact two symptoms observed. A directive's
 * element exists at construction, which removes the timing question entirely.
 *
 *   <div [ckPresenceNode]="presence.setNode" ...>
 */
@Directive({ selector: "[ckPresenceNode]", standalone: true })
export class CkPresenceNode {
  readonly ckPresenceNode = input.required<(el: HTMLElement | null) => void>();

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    // Deferred by a microtask so the required input is bound before we read it.
    queueMicrotask(() => this.ckPresenceNode()(el));
  }
}
