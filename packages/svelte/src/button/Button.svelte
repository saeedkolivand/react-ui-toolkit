<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { dataAttr, type Size, type Variant } from "@crosskit-ui/core";

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    fullWidth?: boolean;
    children?: Snippet;
  }

  let {
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    type = "button",
    disabled = false,
    children,
    // `class` is reserved in JS, hence the rename
    class: klass,
    ...rest
  }: Props = $props();
</script>

<button
  {type}
  data-scope="button"
  data-part="root"
  data-variant={variant}
  data-size={size}
  data-loading={dataAttr(loading)}
  data-disabled={dataAttr(disabled)}
  data-full-width={dataAttr(fullWidth)}
  disabled={disabled || loading}
  class={klass}
  {...rest}
>
  {#if children}<span data-part="label">{@render children()}</span>{/if}
</button>
