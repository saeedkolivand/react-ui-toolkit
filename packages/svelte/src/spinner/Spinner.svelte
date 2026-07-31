<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import type { Size, Status } from "@crosskit-ui/core";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    size?: Size;
    variant?: "primary" | "secondary" | Status;
    label?: string;
  }

  let {
    size = "md",
    variant = "primary",
    label = "Loading…",
    class: klass,
    ...rest
  }: Props = $props();
</script>

<div
  role="status"
  data-scope="spinner"
  data-part="root"
  data-variant={variant}
  class={klass}
  {...rest}
>
  <span data-part="indicator" data-size={size}></span>
  <span data-part="visually-hidden">{label}</span>
</div>
