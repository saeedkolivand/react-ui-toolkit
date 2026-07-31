<script setup lang="ts">
import { dataAttr } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
    padding?: boolean;
    center?: boolean;
  }>(),
  { maxWidth: "lg", padding: true, center: true }
);
</script>

<template>
  <div
    data-scope="container"
    data-part="root"
    :data-max-width="props.maxWidth === 'none' ? undefined : props.maxWidth"
    :data-padded="dataAttr(props.padding)"
    :data-centered="dataAttr(props.center)"
  >
    <slot />
  </div>
</template>
