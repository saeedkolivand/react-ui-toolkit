<script setup lang="ts">
import { useSlots } from "vue";
import { dataAttr, type Orientation } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    orientation?: Orientation;
    align?: "start" | "center" | "end";
    dashed?: boolean;
  }>(),
  { orientation: "horizontal", align: "center", dashed: false }
);

const slots = useSlots();
</script>

<template>
  <div
    role="separator"
    :aria-orientation="props.orientation"
    data-scope="divider"
    data-part="root"
    :data-orientation="props.orientation"
    :data-align="props.align"
    :data-dashed="dataAttr(props.dashed)"
  >
    <template v-if="props.orientation === 'horizontal'">
      <span data-part="line" />
      <template v-if="slots.default">
        <span data-part="label"><slot /></span>
        <span data-part="line" />
      </template>
    </template>
  </div>
</template>
