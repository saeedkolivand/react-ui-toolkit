<script setup lang="ts">
import { computed, useId } from "vue";
import { ariaAttr, dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    variant?: FieldVariant;
    size?: Size;
    label?: string;
    helperText?: string;
    invalid?: boolean;
    errorMessage?: string;
    fullWidth?: boolean;
    disabled?: boolean;
    id?: string;
  }>(),
  { variant: "default", size: "md", invalid: false, fullWidth: true, disabled: false }
);

// useId() is Vue 3.5+, and gives SSR-stable ids — which is why 3.5 is the floor.
const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
const describedBy = computed(() =>
  props.errorMessage
    ? `${inputId.value}-error`
    : props.helperText
      ? `${inputId.value}-helper`
      : undefined
);
</script>

<template>
  <div
    data-scope="input"
    data-part="field"
    :data-variant="props.variant"
    :data-invalid="dataAttr(props.invalid)"
    :data-has-prefix="dataAttr(!!$slots.prefix)"
    :data-has-suffix="dataAttr(!!$slots.suffix)"
    :data-full-width="dataAttr(props.fullWidth)"
  >
    <label v-if="props.label" data-part="label" :for="inputId">{{ props.label }}</label>
    <div data-scope="input" data-part="control">
      <span v-if="$slots.prefix" data-part="prefix"><slot name="prefix" /></span>
      <input
        :id="inputId"
        data-scope="input"
        data-part="input"
        :data-size="props.size"
        :disabled="props.disabled"
        :aria-invalid="ariaAttr(props.invalid)"
        :aria-describedby="describedBy"
      />
      <span v-if="$slots.suffix" data-part="suffix"><slot name="suffix" /></span>
    </div>
    <p v-if="props.errorMessage" :id="`${inputId}-error`" data-part="error-text">
      {{ props.errorMessage }}
    </p>
    <p v-else-if="props.helperText" :id="`${inputId}-helper`" data-part="helper-text">
      {{ props.helperText }}
    </p>
  </div>
</template>
