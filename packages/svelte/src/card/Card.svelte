<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { dataAttr, type Size } from "@crosskit-ui/core";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "primary" | "secondary" | "success" | "warning" | "error";
    size?: Size;
    hoverable?: boolean;
    elevated?: boolean;
    bordered?: boolean;
    fullWidth?: boolean;
    header?: Snippet;
    footer?: Snippet;
    children?: Snippet;
  }

  let {
    variant = "default",
    size = "md",
    hoverable = false,
    elevated = false,
    bordered = true,
    fullWidth = true,
    header,
    footer,
    children,
    class: klass,
    ...rest
  }: Props = $props();
</script>

<div
  data-scope="card"
  data-part="root"
  data-variant={variant}
  data-size={size}
  data-bordered={dataAttr(bordered)}
  data-elevated={dataAttr(elevated)}
  data-hoverable={dataAttr(hoverable)}
  data-full-width={dataAttr(fullWidth)}
  class={klass}
  {...rest}
>
  {#if header}<div data-part="header">{@render header()}</div>{/if}
  <div data-part="body">{@render children?.()}</div>
  {#if footer}<div data-part="footer">{@render footer()}</div>{/if}
</div>
