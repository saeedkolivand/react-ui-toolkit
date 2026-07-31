<script setup lang="ts">
import { dataAttr, type Size, type Status } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    variant?: "primary" | "secondary" | Status;
    size?: Size;
    rounded?: boolean;
    outlined?: boolean;
  }>(),
  { variant: "primary", size: "md", rounded: false, outlined: false }
);
</script>

<template>
  <span
    data-scope="badge"
    data-part="root"
    :data-variant="props.variant"
    :data-size="props.size"
    :data-rounded="dataAttr(props.rounded)"
    :data-outlined="dataAttr(props.outlined)"
  >
    <slot />
  </span>
</template>
