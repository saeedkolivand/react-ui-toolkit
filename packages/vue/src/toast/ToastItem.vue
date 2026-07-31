<script setup lang="ts">
import { computed } from "vue";
import * as toast from "@zag-js/toast";
import { useMachine, normalizeProps } from "@zag-js/vue";
import type { IconName } from "@crosskit-ui/core";
import Icon from "../icon/Icon.vue";

// Same mapping as Alert, so a success toast and a success alert look alike.
const ICON_FOR: Record<string, IconName> = {
  success: "check",
  error: "error",
  warning: "warning",
  info: "info",
};

const props = defineProps<{
  item: toast.Props;
  index: number;
  parent: toast.GroupService;
  hideIcon?: boolean;
}>();

// @zag-js/vue takes a GETTER, not an object, so prop changes stay reactive.
const machineProps = computed(() => ({
  ...props.item,
  parent: props.parent,
  index: props.index,
}));
const service = useMachine(toast.machine, machineProps);
const api = computed(() => toast.connect(service, normalizeProps));
const icon = computed(() => ICON_FOR[api.value.type]);
</script>

<template>
  <div v-bind="api.getRootProps()">
    <Icon v-if="!props.hideIcon && icon" :name="icon" data-part="icon" />
    <h3 v-if="api.title != null" v-bind="api.getTitleProps()">{{ api.title }}</h3>
    <p v-if="api.description != null" v-bind="api.getDescriptionProps()">{{ api.description }}</p>
    <!-- The action lives on the toast's own options, not on the api — the api
         only supplies the trigger's props and click handling. -->
    <button v-if="props.item.action" v-bind="api.getActionTriggerProps()">
      {{ props.item.action.label }}
    </button>
    <button v-if="api.closable" v-bind="api.getCloseTriggerProps()" aria-label="Dismiss">
      <Icon name="close" size="sm" />
    </button>
  </div>
</template>
