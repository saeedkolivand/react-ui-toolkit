// Keeps a node mounted through its exit animation so CSS can key off
// [data-state="closed"]. Without it the node unmounts the instant `open` flips
// false and every exit animation silently does nothing — which is what makes
// "framer-motion is deleted" true rather than "deleted, and exit animations gone".
import {
  computed,
  DestroyRef,
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
    present: computed(() => api().present),
    setNode: (el: HTMLElement | null) => api().setNode(el),
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
    inject(DestroyRef).onDestroy(() => this.ckPresenceNode()(null));
  }
}
