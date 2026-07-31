<script setup lang="ts">
import { computed } from "vue";
import { dataAttr, type Size, type Status } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    value?: number | null;
    max?: number;
    variant?: "primary" | Status;
    size?: Size;
    label?: string;
    showValue?: boolean;
    striped?: boolean;
    animated?: boolean;
  }>(),
  { max: 100, variant: "primary", size: "md", showValue: false, striped: false, animated: false }
);

const indeterminate = computed(() => props.value == null);
const percent = computed(() =>
  indeterminate.value ? 0 : Math.min(100, Math.max(0, (props.value! / props.max) * 100))
);
</script>

<template>
  <div
    data-scope="progress"
    data-part="root"
    :data-variant="props.variant"
    :data-indeterminate="dataAttr(indeterminate)"
  >
    <div v-if="props.label || props.showValue" data-part="label">
      <span>{{ props.label }}</span>
      <span v-if="props.showValue && !indeterminate" data-part="value-text">
        {{ Math.round(percent) }}%
      </span>
    </div>
    <div
      data-part="track"
      :data-size="props.size"
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="props.max"
      :aria-valuenow="indeterminate ? undefined : (props.value ?? undefined)"
    >
      <div
        data-part="range"
        :data-striped="dataAttr(props.striped)"
        :data-animated="dataAttr(props.animated)"
        :style="{ '--ck-progress-percent': String(percent) }"
      />
    </div>
  </div>
</template>
