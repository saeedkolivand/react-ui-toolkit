<script setup lang="ts">
import type { Size, Status } from "@crosskit-ui/core";

withDefaults(
  defineProps<{ size?: Size; variant?: "primary" | "secondary" | Status; label?: string }>(),
  { size: "md", variant: "primary", label: "Loading…" }
);
</script>

<template>
  <div role="status" data-scope="spinner" data-part="root" :data-variant="variant">
    <span data-part="indicator" :data-size="size" />
    <span data-part="visually-hidden">{{ label }}</span>
  </div>
</template>
