<script setup lang="ts">
import { computed, useId } from "vue";
import { ariaAttr, dataAttr, type Size } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    size?: Size;
    label?: string;
    invalid?: boolean;
    disabled?: boolean;
    id?: string;
    value?: string;
    name?: string;
    modelValue?: string;
  }>(),
  { size: "md", invalid: false, disabled: false }
);

const emit = defineEmits<{ "update:modelValue": [string] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
</script>

<template>
  <label
    data-scope="radio"
    data-part="root"
    :data-disabled="dataAttr(props.disabled)"
    :data-invalid="dataAttr(props.invalid)"
    :for="inputId"
  >
    <input
      :id="inputId"
      type="radio"
      data-part="control"
      :data-size="props.size"
      :disabled="props.disabled"
      :aria-invalid="ariaAttr(props.invalid)"
      :value="props.value"
      :name="props.name"
      :checked="props.modelValue === props.value"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="props.label || $slots.default" data-part="label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
