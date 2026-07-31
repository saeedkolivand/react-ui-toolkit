<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { dataAttr, type Size, type Status } from "@crosskit-ui/core";

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: "primary" | "secondary" | Status;
    size?: Size;
    rounded?: boolean;
    outlined?: boolean;
    children?: Snippet;
  }

  let {
    variant = "primary",
    size = "md",
    rounded = false,
    outlined = false,
    children,
    class: klass,
    ...rest
  }: Props = $props();
</script>

<span
  data-scope="badge"
  data-part="root"
  data-variant={variant}
  data-size={size}
  data-rounded={dataAttr(rounded)}
  data-outlined={dataAttr(outlined)}
  class={klass}
  {...rest}
>
  {@render children?.()}
</span>
