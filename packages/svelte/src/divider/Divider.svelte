<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { dataAttr, type Orientation } from "@crosskit-ui/core";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    orientation?: Orientation;
    align?: "start" | "center" | "end";
    dashed?: boolean;
    children?: Snippet;
  }

  let {
    orientation = "horizontal",
    align = "center",
    dashed = false,
    children,
    class: klass,
    ...rest
  }: Props = $props();
</script>

<div
  role="separator"
  aria-orientation={orientation}
  data-scope="divider"
  data-part="root"
  data-orientation={orientation}
  data-align={align}
  data-dashed={dataAttr(dashed)}
  class={klass}
  {...rest}
>
  {#if orientation === "horizontal"}
    <span data-part="line"></span>
    {#if children}
      <span data-part="label">{@render children()}</span>
      <span data-part="line"></span>
    {/if}
  {/if}
</div>
