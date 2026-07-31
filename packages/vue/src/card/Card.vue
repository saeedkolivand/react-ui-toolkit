<script setup lang="ts">
import { dataAttr, type Size } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error";
    size?: Size;
    hoverable?: boolean;
    elevated?: boolean;
    bordered?: boolean;
    fullWidth?: boolean;
  }>(),
  {
    variant: "default",
    size: "md",
    hoverable: false,
    elevated: false,
    bordered: true,
    fullWidth: true,
  }
);
</script>

<template>
  <div
    data-scope="card"
    data-part="root"
    :data-variant="props.variant"
    :data-size="props.size"
    :data-bordered="dataAttr(props.bordered)"
    :data-elevated="dataAttr(props.elevated)"
    :data-hoverable="dataAttr(props.hoverable)"
    :data-full-width="dataAttr(props.fullWidth)"
  >
    <div v-if="$slots.header" data-part="header"><slot name="header" /></div>
    <div data-part="body"><slot /></div>
    <div v-if="$slots.footer" data-part="footer"><slot name="footer" /></div>
  </div>
</template>
