<script setup lang="ts">
import { dataAttr, type IconName, type Size, type Variant } from "@crosskit-ui/core";
import Icon from "../icon/Icon.vue";
import Spinner from "../spinner/Spinner.vue";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: IconName;
    iconPosition?: "left" | "right";
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    loading: false,
    fullWidth: false,
    iconPosition: "left",
    type: "button",
    disabled: false,
  }
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
    :data-icon-position="props.icon ? props.iconPosition : undefined"
    :disabled="props.disabled || props.loading"
  >
    <Spinner v-if="props.loading" :size="props.size" label="" />
    <Icon
      v-if="props.icon && props.iconPosition === 'left'"
      :name="props.icon"
      :size="props.size"
    />
    <span v-if="$slots.default" data-part="label"><slot /></span>
    <Icon
      v-if="props.icon && props.iconPosition === 'right'"
      :name="props.icon"
      :size="props.size"
    />
  </button>
</template>
