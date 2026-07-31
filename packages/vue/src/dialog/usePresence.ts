import { computed, type Ref } from "vue";
import * as presence from "@zag-js/presence";
import { useMachine, normalizeProps } from "@zag-js/vue";

/**
 * Keeps a node mounted through its exit animation. Gate rendering on `present`,
 * never on `api.open`, or [data-state="closed"] never gets a frame and every
 * exit animation silently does nothing.
 */
export function usePresence(present: Ref<boolean> | (() => boolean)) {
  const read = typeof present === "function" ? present : () => present.value;
  // A computed, not a bare getter: @zag-js/vue's useMachine takes MaybeRef, and
  // a computed satisfies it while staying reactive to prop changes.
  const machineProps = computed(() => ({ present: read() }));
  const service = useMachine(presence.machine, machineProps);
  const api = computed(() => presence.connect(service, normalizeProps));
  return {
    present: computed(() => api.value.present),
    setNode: (el: HTMLElement | null) => api.value.setNode(el),
  };
}
