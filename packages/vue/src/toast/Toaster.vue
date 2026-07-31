<script setup lang="ts">
import { computed, useId } from "vue";
import * as toast from "@zag-js/toast";
import { useMachine, normalizeProps } from "@zag-js/vue";
import type { Toaster as ToasterStore } from "@crosskit-ui/core";
import ToastItem from "./ToastItem.vue";

const props = defineProps<{
  /** The store from `createToaster()`. */
  toaster: ToasterStore;
  /** Suppress the per-type icon. */
  hideIcon?: boolean;
  id?: string;
}>();

const autoId = useId();
const machineProps = computed(() => ({ id: props.id ?? autoId, store: props.toaster }));
const service = useMachine(toast.group.machine, machineProps);
const api = computed(() => toast.group.connect(service, normalizeProps));
</script>

<template>
  <div v-bind="api.getGroupProps()">
    <ToastItem
      v-for="(item, index) in api.getToasts()"
      :key="item.id"
      :item="item"
      :index="index"
      :parent="service"
      :hide-icon="props.hideIcon"
    />
  </div>
</template>
