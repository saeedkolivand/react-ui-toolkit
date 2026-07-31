<script setup lang="ts">
import { computed } from "vue";
import type { IconName, Status } from "@crosskit-ui/core";
import Icon from "../icon/Icon.vue";
import Button from "../button/Button.vue";

const props = withDefaults(
  defineProps<{
    variant?: Status;
    title?: string;
    showIcon?: boolean;
    dismissible?: boolean;
  }>(),
  { variant: "info", showIcon: true, dismissible: false }
);

defineEmits<{ dismiss: [] }>();

const ICON_FOR: Record<Status, IconName> = {
  info: "info",
  success: "check",
  warning: "warning",
  error: "error",
};
const iconName = computed(() => ICON_FOR[props.variant]);
</script>

<template>
  <div role="alert" data-scope="alert" data-part="root" :data-variant="props.variant">
    <Icon v-if="props.showIcon" :name="iconName" size="md" />
    <div data-part="content">
      <h3 v-if="props.title || $slots.title" data-part="title">
        <slot name="title">{{ props.title }}</slot>
      </h3>
      <div v-if="$slots.default" data-part="description"><slot /></div>
    </div>
    <Button
      v-if="props.dismissible"
      variant="ghost"
      size="sm"
      icon="close"
      data-part="close-trigger"
      aria-label="Dismiss"
      @click="$emit('dismiss')"
    />
  </div>
</template>
