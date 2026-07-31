<script setup lang="ts">
import { computed, useId } from "vue";
import * as dialog from "@zag-js/dialog";
import { useMachine, normalizeProps } from "@zag-js/vue";
import { dataAttr, type ModalSize } from "@crosskit-ui/core";
import { usePresence } from "./usePresence";
import Button from "../button/Button.vue";

// Multi-root under <Teleport>: Vue warns and drops $attrs unless this is off.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    open?: boolean;
    defaultOpen?: boolean;
    size?: ModalSize;
    role?: "dialog" | "alertdialog";
    modal?: boolean;
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
    showCloseButton?: boolean;
    centered?: boolean;
    scrollable?: boolean;
    title?: string;
    description?: string;
    id?: string;
  }>(),
  { size: "md", showCloseButton: true, centered: true, scrollable: true }
);

const emit = defineEmits<{ "update:open": [boolean]; openChange: [{ open: boolean }] }>();

const autoId = useId();

// @zag-js/vue takes a GETTER, not an object, so prop changes stay reactive.
const machineProps = computed(() => ({
  id: props.id ?? autoId,
  open: props.open,
  defaultOpen: props.defaultOpen,
  role: props.role,
  modal: props.modal,
  closeOnEscape: props.closeOnEscape,
  closeOnInteractOutside: props.closeOnInteractOutside,
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("openChange", details);
  },
}));
const service = useMachine(dialog.machine, machineProps);

const api = computed(() => dialog.connect(service, normalizeProps));
const presence = usePresence(() => api.value.open);
</script>

<template>
  <Teleport to="body">
    <template v-if="presence.present.value">
      <div v-bind="api.getBackdropProps()" data-ck="modal" />
      <div v-bind="api.getPositionerProps()" data-ck="modal" :data-centered="dataAttr(centered)">
        <div
          :ref="el => presence.setNode(el as HTMLElement | null)"
          v-bind="{ ...api.getContentProps(), ...$attrs }"
          data-ck="modal"
          :data-size="props.size"
          :data-scrollable="dataAttr(props.scrollable)"
        >
          <h2 v-if="props.title || $slots.title" v-bind="api.getTitleProps()">
            <slot name="title">{{ props.title }}</slot>
          </h2>
          <p v-if="props.description || $slots.description" v-bind="api.getDescriptionProps()">
            <slot name="description">{{ props.description }}</slot>
          </p>
          <div data-scope="dialog" data-part="body" data-ck="modal"><slot /></div>
          <div v-if="$slots.footer" data-scope="dialog" data-part="footer" data-ck="modal">
            <slot name="footer" />
          </div>
          <Button
            v-if="props.showCloseButton"
            variant="ghost"
            size="sm"
            icon="close"
            data-part="close-trigger"
            aria-label="Close"
          />
        </div>
      </div>
    </template>
  </Teleport>
</template>
