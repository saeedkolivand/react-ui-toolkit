<script setup lang="ts">
import type { Orientation } from "@crosskit-ui/core";

const props = withDefaults(defineProps<{ orientation?: Orientation; label?: string }>(), {
  orientation: "horizontal",
});
</script>

<!-- A grouping wrapper, not a controller: native radios already handle
     selection and arrow-key navigation once they share a `name`. This supplies
     the group semantics screen readers need, which v0 never provided. -->
<template>
  <div
    role="radiogroup"
    :aria-label="props.label"
    data-scope="radio-group"
    data-part="root"
    :data-orientation="props.orientation"
  >
    <slot />
  </div>
</template>
