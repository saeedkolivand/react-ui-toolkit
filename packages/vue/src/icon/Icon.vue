<script setup lang="ts">
import { computed } from "vue";
import { ICON_VIEW_BOX, iconPaths, type IconName, type IconSize } from "@crosskit-ui/core";

const props = withDefaults(defineProps<{ name: IconName; size?: IconSize }>(), { size: "md" });

const paths = computed(() => iconPaths[props.name] ?? []);
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="ICON_VIEW_BOX"
    aria-hidden="true"
    focusable="false"
    data-scope="icon"
    data-part="root"
    :data-size="props.size"
  >
    <path v-for="d in paths" :key="d" :d="d" />
  </svg>
</template>
