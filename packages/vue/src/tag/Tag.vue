<script setup lang="ts">
import Icon from "../icon/Icon.vue";

const props = withDefaults(
  defineProps<{
    variant?: "default" | "outline" | "solid";
    color?: "default" | "primary" | "success" | "warning" | "error" | "info";
    closable?: boolean;
  }>(),
  { variant: "default", color: "default", closable: false }
);

defineEmits<{ close: [] }>();
</script>

<template>
  <span data-scope="tag" data-part="root" :data-variant="props.variant" :data-color="props.color">
    <slot />
    <button
      v-if="props.closable"
      type="button"
      data-part="close-trigger"
      aria-label="Remove"
      @click="$emit('close')"
    >
      <Icon name="close" size="sm" />
    </button>
  </span>
</template>
