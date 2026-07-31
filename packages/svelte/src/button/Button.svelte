<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { dataAttr, type IconName, type Size, type Variant } from "@crosskit-ui/core";
  import Icon from "../icon/Icon.svelte";
  import Spinner from "../spinner/Spinner.svelte";

  interface Props extends HTMLButtonAttributes {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    fullWidth?: boolean;
    icon?: IconName;
    iconPosition?: "left" | "right";
    children?: Snippet;
  }

  let {
    variant = "primary",
    size = "md",
    loading = false,
    fullWidth = false,
    icon,
    iconPosition = "left",
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
  data-icon-position={icon ? iconPosition : undefined}
  disabled={disabled || loading}
  class={klass}
  {...rest}
>
  {#if loading}<Spinner {size} label="" />{/if}
  {#if icon && iconPosition === "left"}<Icon name={icon} {size} />{/if}
  {#if children}<span data-part="label">{@render children()}</span>{/if}
  {#if icon && iconPosition === "right"}<Icon name={icon} {size} />{/if}
</button>
