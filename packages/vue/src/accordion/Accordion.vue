<script setup lang="ts">
import { computed, useId } from "vue";
import * as accordion from "@zag-js/accordion";
import { useMachine, normalizeProps } from "@zag-js/vue";
import Icon from "../icon/Icon.vue";

export interface AccordionItem {
  id: string;
  title: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    items: AccordionItem[];
    value?: string[];
    defaultValue?: string[];
    allowMultiple?: boolean;
    collapsible?: boolean;
    id?: string;
  }>(),
  { allowMultiple: false, collapsible: true }
);

const emit = defineEmits<{ "update:value": [string[]]; valueChange: [{ value: string[] }] }>();

const autoId = useId();
const machineProps = computed(() => ({
  id: props.id ?? autoId,
  multiple: props.allowMultiple,
  collapsible: props.collapsible,
  value: props.value,
  defaultValue: props.defaultValue,
  onValueChange(details: { value: string[] }) {
    emit("update:value", details.value);
    emit("valueChange", details);
  },
}));
const service = useMachine(accordion.machine, machineProps);
const api = computed(() => accordion.connect(service, normalizeProps));
</script>

<template>
  <div v-bind="api.getRootProps()">
    <div
      v-for="item in props.items"
      :key="item.id"
      v-bind="api.getItemProps({ value: item.id, disabled: item.disabled })"
    >
      <h3>
        <button v-bind="api.getItemTriggerProps({ value: item.id, disabled: item.disabled })">
          <slot :name="`title-${item.id}`">{{ item.title }}</slot>
          <!-- rotates off the machine's own data-state; no JS toggling a class -->
          <Icon name="chevronDown" size="sm" data-part="item-indicator" />
        </button>
      </h3>
      <div v-bind="api.getItemContentProps({ value: item.id, disabled: item.disabled })">
        <slot :name="item.id" />
      </div>
    </div>
  </div>
</template>
