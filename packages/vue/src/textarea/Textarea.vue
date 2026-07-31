<script setup lang="ts">
import { computed, useId } from "vue";
import { ariaAttr, dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";

// Native attributes must reach the CONTROL, not the wrapper. Without
// inheritAttrs:false Vue puts every undeclared attribute — type, placeholder,
// value, readonly, required, name, autocomplete — on the root div, where they do
// nothing at all. React and Svelte both spread rest onto the control, so this
// was a silent Vue-only divergence; the cross-framework parity screenshots are
// what surfaced it.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    variant?: FieldVariant;
    size?: Size;
    label?: string;
    helperText?: string;
    invalid?: boolean;
    errorMessage?: string;
    autoResize?: boolean;
    fullWidth?: boolean;
    disabled?: boolean;
    id?: string;
    modelValue?: string;
  }>(),
  {
    variant: "default",
    size: "md",
    invalid: false,
    autoResize: false,
    fullWidth: true,
    disabled: false,
  }
);

const emit = defineEmits<{ "update:modelValue": [string] }>();

const autoId = useId();
const textareaId = computed(() => props.id ?? autoId);
const describedBy = computed(() =>
  props.errorMessage
    ? `${textareaId.value}-error`
    : props.helperText
      ? `${textareaId.value}-helper`
      : undefined
);

// Auto-resize is CSS. This only mirrors the value onto the wrapper so the
// invisible replica can size the grid cell — one DOM write, no measurement.
function onInput(event: Event) {
  const el = event.target as HTMLTextAreaElement;
  if (props.autoResize) el.parentElement?.setAttribute("data-value", el.value);
  emit("update:modelValue", el.value);
}
</script>

<template>
  <div
    data-scope="textarea"
    data-part="field"
    :data-variant="props.variant"
    :data-invalid="dataAttr(props.invalid)"
    :data-full-width="dataAttr(props.fullWidth)"
  >
    <label v-if="props.label" data-part="label" :for="textareaId">{{ props.label }}</label>
    <div
      data-scope="textarea"
      data-part="control"
      :data-auto-resize="dataAttr(props.autoResize)"
      :data-value="props.autoResize ? (props.modelValue ?? '') : undefined"
    >
      <textarea
        v-bind="$attrs"
        :id="textareaId"
        data-scope="textarea"
        data-part="input"
        :data-size="props.size"
        :disabled="props.disabled"
        :aria-invalid="ariaAttr(props.invalid)"
        :aria-describedby="describedBy"
        :value="props.modelValue"
        @input="onInput"
      />
    </div>
    <p v-if="props.errorMessage" :id="`${textareaId}-error`" data-part="error-text">
      {{ props.errorMessage }}
    </p>
    <p v-else-if="props.helperText" :id="`${textareaId}-helper`" data-part="helper-text">
      {{ props.helperText }}
    </p>
  </div>
</template>
