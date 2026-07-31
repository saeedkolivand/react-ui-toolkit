<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Orientation } from "@crosskit-ui/core";

  interface Props {
    orientation?: Orientation;
    label?: string;
    children?: Snippet;
    class?: string;
  }

  let { orientation = "horizontal", label, children, class: klass }: Props = $props();
</script>

<!-- A grouping wrapper, not a controller: bind:group already handles selection
     and arrow-key navigation. This supplies the group semantics screen readers
     need, which v0 never provided. -->
<div
  role="radiogroup"
  aria-label={label}
  data-scope="radio-group"
  data-part="root"
  data-orientation={orientation}
  class={klass}
>
  {@render children?.()}
</div>
