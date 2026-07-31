<script setup lang="ts">
import { computed } from "vue";

interface Breakpoint {
  span?: number;
  offset?: number;
}

const props = defineProps<{
  span?: number;
  offset?: number;
  sm?: Breakpoint;
  md?: Breakpoint;
  lg?: Breakpoint;
  xl?: Breakpoint;
  order?: number | "first" | "last";
}>();

// `order` is unbounded, so it stays an inline custom property. Spans and
// offsets are enumerable and therefore static CSS.
const style = computed(() =>
  typeof props.order === "number" ? { "--ck-col-order": String(props.order) } : undefined
);
</script>

<template>
  <div
    data-scope="col"
    data-part="root"
    :data-span="props.span"
    :data-offset="props.offset"
    :data-span-sm="props.sm?.span"
    :data-offset-sm="props.sm?.offset"
    :data-span-md="props.md?.span"
    :data-offset-md="props.md?.offset"
    :data-span-lg="props.lg?.span"
    :data-offset-lg="props.lg?.offset"
    :data-span-xl="props.xl?.span"
    :data-offset-xl="props.xl?.offset"
    :data-order="typeof props.order === 'string' ? props.order : undefined"
    :style="style"
  >
    <slot />
  </div>
</template>
