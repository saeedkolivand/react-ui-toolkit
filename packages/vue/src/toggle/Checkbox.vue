<script setup lang="ts">
import { computed, useId, watchEffect, useTemplateRef } from "vue";
import { ariaAttr, dataAttr, type Size } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    size?: Size;
    label?: string;
    invalid?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    id?: string;
    modelValue?: boolean;
    value?: string;
    name?: string;
  }>(),
  { size: "md", invalid: false, indeterminate: false, disabled: false }
);

const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);

// `indeterminate` is a DOM property with no HTML attribute, so it has to be set
// imperatively. useTemplateRef is Vue 3.5+, part of why 3.5 is the floor.
const inputRef = useTemplateRef<HTMLInputElement>("input");
watchEffect(() => {
  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate;
});
</script>

<template>
  <label
    data-scope="checkbox"
    data-part="root"
    :data-disabled="dataAttr(props.disabled)"
    :data-invalid="dataAttr(props.invalid)"
    :for="inputId"
  >
    <input
      ref="input"
      :id="inputId"
      type="checkbox"
      data-part="control"
      :data-size="props.size"
      :disabled="props.disabled"
      :aria-invalid="ariaAttr(props.invalid)"
      :checked="props.modelValue"
      :value="props.value"
      :name="props.name"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span v-if="props.label || $slots.default" data-part="label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
