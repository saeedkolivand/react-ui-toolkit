<script setup lang="ts">
import { computed, ref } from "vue";
import { dataAttr, type IconSize } from "@crosskit-ui/core";

const props = withDefaults(
  defineProps<{
    src?: string;
    alt?: string;
    size?: IconSize;
    status?: "online" | "offline" | "busy" | "away";
    initials?: string;
    squared?: boolean;
    bordered?: boolean;
  }>(),
  { size: "md", alt: "", squared: false, bordered: false }
);

const state = ref<"loading" | "loaded" | "error">("loading");
const showFallback = computed(() => !props.src || state.value === "error");

const initialsText = computed(() =>
  props.initials
    ? props.initials
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(p => p[0]?.toUpperCase() ?? "")
        .join("")
    : ""
);
</script>

<template>
  <span
    data-scope="avatar"
    data-part="root"
    :data-size="props.size"
    :data-squared="dataAttr(props.squared)"
    :data-bordered="dataAttr(props.bordered)"
  >
    <img
      v-if="props.src"
      data-part="image"
      :data-state="state"
      :src="props.src"
      :alt="props.alt"
      @load="state = 'loaded'"
      @error="state = 'error'"
    />
    <span v-if="showFallback" data-part="fallback">
      <slot>{{ initialsText }}</slot>
    </span>
    <span
      v-if="props.status"
      data-part="status"
      :data-status="props.status"
      :aria-label="props.status"
    />
  </span>
</template>
