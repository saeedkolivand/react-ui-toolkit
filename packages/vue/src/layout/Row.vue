<script setup lang="ts">
import { computed } from "vue";
import { dataAttr } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    spacing?: number;
    wrap?: boolean;
    reverse?: boolean;
  }>(),
  { wrap: true, reverse: false }
);

// Inline custom property, not a class: v0's `gap-${n}` was a dynamic Tailwind
// class that produced nothing in a consumer's build.
const style = computed(() =>
  props.spacing == null ? undefined : { "--ck-row-spacing": String(props.spacing) }
);
</script>

<template>
  <div
    data-scope="row"
    data-part="root"
    :data-justify="props.justify"
    :data-align="props.align"
    :data-wrap="props.wrap ? undefined : 'false'"
    :data-reverse="dataAttr(props.reverse)"
    :style="style"
  >
    <slot />
  </div>
</template>
