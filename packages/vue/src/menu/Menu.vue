<script setup lang="ts">
import { computed, useId } from "vue";
import * as menu from "@zag-js/menu";
import { useMachine, normalizeProps } from "@zag-js/vue";
import {
  dataAttr,
  resolvePlacement,
  type IconName,
  type LegacyPlacement,
  type Placement,
  type Size,
  type Variant,
} from "@crosskit-ui/core";
import Icon from "../icon/Icon.vue";
import { usePresence } from "../usePresence";

export interface MenuItem {
  /** v0 called this `key`. */
  value: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
  danger?: boolean;
}
export interface MenuSeparator {
  separator: true;
}
export type MenuEntry = MenuItem | MenuSeparator;

const props = withDefaults(
  defineProps<{
    items: MenuEntry[];
    /** Trigger *content*, not a trigger element — Menu renders the button. */
    trigger?: string;
    triggerVariant?: Variant;
    triggerSize?: Size;
    placement?: Placement | LegacyPlacement;
    open?: boolean;
    defaultOpen?: boolean;
    id?: string;
    contentClass?: string;
    triggerClass?: string;
  }>(),
  { triggerVariant: "secondary", triggerSize: "md" }
);

const emit = defineEmits<{
  select: [{ value: string }];
  "update:open": [boolean];
  openChange: [{ open: boolean }];
}>();

const isSeparator = (entry: MenuEntry): entry is MenuSeparator => "separator" in entry;
const rows = computed(() => props.items.filter((e): e is MenuItem => !isSeparator(e)));

const autoId = useId();
const machineProps = computed(() => ({
  id: props.id ?? autoId,
  open: props.open,
  defaultOpen: props.defaultOpen,
  positioning: { placement: resolvePlacement(props.placement, "bottom-start") },
  onSelect(details: { value: string }) {
    emit("select", details);
  },
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("openChange", details);
  },
}));
const service = useMachine(menu.machine, machineProps);
const api = computed(() => menu.connect(service, normalizeProps));
const presence = usePresence(() => api.value.open);
</script>

<template>
  <!-- Zag's own data-scope/data-part are replaced with Button's so the trigger
       simply IS a Button. Nothing in overlay.css targets
       [data-scope="menu"][data-part="trigger"], and the machine's data-state
       still lands, which is all the CSS needs. -->
  <button
    v-bind="api.getTriggerProps()"
    data-scope="button"
    data-part="root"
    :data-variant="props.triggerVariant"
    :data-size="props.triggerSize"
    data-menu-trigger=""
    :class="props.triggerClass"
  >
    <slot name="trigger">{{ props.trigger }}</slot>
  </button>
  <Teleport v-if="presence.present.value" to="body">
    <div v-bind="api.getPositionerProps()">
      <div
        :ref="el => presence.setNode(el as HTMLElement | null)"
        v-bind="api.getContentProps()"
        :class="props.contentClass"
      >
        <template v-for="(entry, index) in props.items">
          <hr v-if="isSeparator(entry)" :key="`sep-${index}`" v-bind="api.getSeparatorProps()" />
          <div
            v-else
            :key="entry.value"
            v-bind="api.getItemProps({ value: entry.value, disabled: entry.disabled })"
            :data-danger="dataAttr(entry.danger)"
          >
            <Icon v-if="entry.icon" :name="entry.icon" size="sm" />
            {{ entry.label }}
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>
