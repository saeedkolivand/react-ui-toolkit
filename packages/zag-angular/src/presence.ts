// Keeps a node mounted through its exit animation, so CSS can key off
// [data-state="closed"]. Without this the node unmounts the instant `open`
// flips false and every exit animation in the library silently does nothing.
import { computed, Injector } from "@angular/core";
import * as presence from "@zag-js/presence";
import { useMachine } from "./machine";
import { normalizeProps } from "./normalize-props";

export function usePresence(props: () => { present: boolean }, _injector?: Injector) {
  const service = useMachine(presence.machine, () => ({ present: props().present }));
  const api = computed(() => presence.connect(service, normalizeProps));
  return {
    present: computed(() => api().present),
    setNode: (el: HTMLElement | null | undefined) => api().setNode(el ?? null),
  };
}
