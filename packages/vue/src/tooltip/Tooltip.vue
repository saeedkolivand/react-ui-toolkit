<script setup lang="ts">
import { computed, useId } from "vue";
import * as tooltip from "@zag-js/tooltip";
import { useMachine, normalizeProps } from "@zag-js/vue";
import {
  isFocusVisible,
  resolvePlacement,
  type LegacyPlacement,
  type Placement,
} from "@crosskit-ui/core";
import { usePresence } from "../usePresence";

const props = withDefaults(
  defineProps<{
    content?: string;
    /** Accepts the canonical names and v0's corner names (`topLeft`, `rightBottom`, …). */
    placement?: Placement | LegacyPlacement;
    open?: boolean;
    defaultOpen?: boolean;
    openDelay?: number;
    closeDelay?: number;
    disabled?: boolean;
    contentClass?: string;
    id?: string;
  }>(),
  {}
);

const emit = defineEmits<{ "update:open": [boolean]; openChange: [{ open: boolean }] }>();

const autoId = useId();

// @zag-js/vue takes a GETTER, not an object, so prop changes stay reactive.
const machineProps = computed(() => ({
  id: props.id ?? autoId,
  open: props.open,
  defaultOpen: props.defaultOpen,
  openDelay: props.openDelay,
  closeDelay: props.closeDelay,
  disabled: props.disabled,
  positioning: { placement: resolvePlacement(props.placement) },
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("openChange", details);
  },
}));
const service = useMachine(tooltip.machine, machineProps);
const api = computed(() => tooltip.connect(service, normalizeProps));
const presence = usePresence(() => api.value.open);

// focus/blur do not bubble to a wrapper, so focusin/focusout stand in. React's
// synthetic events fake the bubbling and would have hidden this divergence.
function onFocusIn(event: FocusEvent) {
  if (isFocusVisible(event.target)) api.value.setOpen(true);
}
</script>

<template>
  <span v-bind="api.getTriggerProps()" @focusin="onFocusIn" @focusout="api.setOpen(false)">
    <slot />
  </span>
  <!-- Gate on presence, NEVER on api.open, or [data-state="closed"] never gets
       a frame and the exit animation silently does nothing. -->
  <Teleport v-if="presence.present.value" to="body">
    <div v-bind="api.getPositionerProps()">
      <div
        :ref="el => presence.setNode(el as HTMLElement | null)"
        v-bind="api.getContentProps()"
        :class="props.contentClass"
      >
        <slot name="content">{{ props.content }}</slot>
      </div>
    </div>
  </Teleport>
</template>
