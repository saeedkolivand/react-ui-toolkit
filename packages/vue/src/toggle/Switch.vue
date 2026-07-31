<script setup lang="ts">
import { computed, useId } from "vue";
import { dataAttr, type Size } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    size?: Size;
    label?: string;
    disabled?: boolean;
    id?: string;
    modelValue?: boolean;
    name?: string;
  }>(),
  { size: "md", disabled: false }
);

const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const autoId = useId();
const inputId = computed(() => props.id ?? autoId);
</script>

<!-- One real checkbox, one change event. v0 combined a wrapper onClick that
     synthesised a fake event with an inner onChange, so a single interaction
     could fire twice with different payload shapes. -->
<template>
  <label
    data-scope="switch"
    data-part="root"
    :data-disabled="dataAttr(props.disabled)"
    :for="inputId"
  >
    <input
      :id="inputId"
      type="checkbox"
      role="switch"
      data-part="hidden-input"
      :disabled="props.disabled"
      :checked="props.modelValue"
      :name="props.name"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span data-part="control" :data-size="props.size">
      <span data-part="thumb" />
    </span>
    <span v-if="props.label || $slots.default" data-part="label">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>
