<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { dataAttr } from "@crosskit-ui/core";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
    padding?: boolean;
    center?: boolean;
    children?: Snippet;
  }

  let {
    maxWidth = "lg",
    padding = true,
    center = true,
    children,
    class: klass,
    ...rest
  }: Props = $props();
</script>

<div
  data-scope="container"
  data-part="root"
  data-max-width={maxWidth === "none" ? undefined : maxWidth}
  data-padded={dataAttr(padding)}
  data-centered={dataAttr(center)}
  class={klass}
  {...rest}
>
  {@render children?.()}
</div>
