import * as presence from "@zag-js/presence";
import { useMachine, normalizeProps } from "@zag-js/svelte";

/**
 * Keeps a node mounted through its exit animation. Gate rendering on `present`,
 * never on `api.open`, or [data-state="closed"] never gets a frame and every
 * exit animation silently does nothing.
 */
export function usePresence(props: () => { present: boolean }) {
  const service = useMachine(presence.machine, () => ({ present: props().present }));
  const api = $derived(presence.connect(service, normalizeProps));
  return {
    get present() {
      return api.present;
    },
    setNode: (el: HTMLElement | null) => api.setNode(el),
  };
}

/**
 * Hands the animated element to the presence machine.
 *
 * An action rather than `bind:this`, because the machine needs the node at
 * mount and null at teardown — which is exactly an action's lifecycle.
 *
 *   <div use:presenceNode={presence.setNode}>
 */
export function presenceNode(node: HTMLElement, setNode: (el: HTMLElement | null) => void) {
  setNode(node);
  return {
    destroy: () => setNode(null),
  };
}
