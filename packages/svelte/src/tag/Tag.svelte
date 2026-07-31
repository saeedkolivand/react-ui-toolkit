<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import Icon from "../icon/Icon.svelte";

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "outline" | "solid";
    color?: "default" | "primary" | "success" | "warning" | "error" | "info";
    closable?: boolean;
    onclose?: () => void;
    children?: Snippet;
  }

  let {
    variant = "default",
    color = "default",
    closable = false,
    onclose,
    children,
    class: klass,
    ...rest
  }: Props = $props();
</script>

<span
  data-scope="tag"
  data-part="root"
  data-variant={variant}
  data-color={color}
  class={klass}
  {...rest}
>
  {@render children?.()}
  {#if closable}
    <button type="button" data-part="close-trigger" aria-label="Remove" onclick={onclose}>
      <Icon name="close" size="sm" />
    </button>
  {/if}
</span>
