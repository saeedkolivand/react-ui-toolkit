<script setup lang="ts">
import { computed, useId } from "vue";
import * as tabs from "@zag-js/tabs";
import { useMachine, normalizeProps } from "@zag-js/vue";
import type { Orientation, TabsVariant } from "@crosskit-ui/core";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    variant?: TabsVariant;
    orientation?: Orientation;
    activationMode?: "automatic" | "manual";
    id?: string;
  }>(),
  { variant: "line", orientation: "horizontal" }
);

const emit = defineEmits<{ "update:value": [string]; valueChange: [{ value: string }] }>();

const autoId = useId();
const machineProps = computed(() => ({
  id: props.id ?? autoId,
  orientation: props.orientation,
  value: props.value,
  defaultValue: props.defaultValue ?? props.items[0]?.id,
  activationMode: props.activationMode,
  onValueChange(details: { value: string }) {
    emit("update:value", details.value);
    emit("valueChange", details);
  },
}));
const service = useMachine(tabs.machine, machineProps);
const api = computed(() => tabs.connect(service, normalizeProps));
</script>

<template>
  <div v-bind="api.getRootProps()" :data-ck-variant="props.variant">
    <div v-bind="api.getListProps()">
      <button
        v-for="item in props.items"
        :key="item.id"
        v-bind="api.getTriggerProps({ value: item.id, disabled: item.disabled })"
      >
        <slot :name="`tab-${item.id}`">{{ item.label }}</slot>
      </button>
    </div>
    <div
      v-for="item in props.items"
      :key="item.id"
      v-bind="api.getContentProps({ value: item.id })"
    >
      <slot :name="item.id" />
    </div>
  </div>
</template>
