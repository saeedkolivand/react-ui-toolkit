<script lang="ts">
  import type { SVGAttributes } from "svelte/elements";
  import { ICON_VIEW_BOX, iconPaths, type IconName, type IconSize } from "@crosskit-ui/core";

  interface Props extends SVGAttributes<SVGSVGElement> {
    name: IconName;
    size?: IconSize;
  }

  let { name, size = "md", class: klass, ...rest }: Props = $props();

  const paths = $derived(iconPaths[name] ?? []);
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox={ICON_VIEW_BOX}
  aria-hidden="true"
  focusable="false"
  data-scope="icon"
  data-part="root"
  data-size={size}
  class={klass}
  {...rest}
>
  {#each paths as d (d)}
    <path {d} />
  {/each}
</svg>
