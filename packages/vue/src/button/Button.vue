<script setup lang="ts">
import { dataAttr, type Size, type Variant } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    loading: false,
    fullWidth: false,
    type: "button",
    disabled: false,
  },
);

// inheritAttrs defaults to true, and THAT is the className passthrough: a
// consumer's class/id/@click land on the root <button> with no plumbing. We
// deliberately declare no `class` prop.
</script>

<template>
  <button
    :type="props.type"
    data-scope="button"
    data-part="root"
    :data-variant="props.variant"
    :data-size="props.size"
    :data-loading="dataAttr(props.loading)"
    :data-disabled="dataAttr(props.disabled)"
    :data-full-width="dataAttr(props.fullWidth)"
    :disabled="props.disabled || props.loading"
  >
    <span v-if="$slots.default" data-part="label"><slot /></span>
  </button>
</template>
