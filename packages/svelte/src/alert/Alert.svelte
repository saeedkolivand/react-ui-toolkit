<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { IconName, Status } from "@crosskit-ui/core";
  import Icon from "../icon/Icon.svelte";
  import Button from "../button/Button.svelte";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    variant?: Status;
    title?: string;
    showIcon?: boolean;
    dismissible?: boolean;
    ondismiss?: () => void;
    children?: Snippet;
  }

  let {
    variant = "info",
    title,
    showIcon = true,
    dismissible = false,
    ondismiss,
    children,
    class: klass,
    ...rest
  }: Props = $props();

  const ICON_FOR: Record<Status, IconName> = {
    info: "info",
    success: "check",
    warning: "warning",
    error: "error",
  };
</script>

<div
  role="alert"
  data-scope="alert"
  data-part="root"
  data-variant={variant}
  class={klass}
  {...rest}
>
  {#if showIcon}<Icon name={ICON_FOR[variant]} size="md" />{/if}
  <div data-part="content">
    {#if title}<h3 data-part="title">{title}</h3>{/if}
    {#if children}<div data-part="description">{@render children()}</div>{/if}
  </div>
  {#if dismissible}
    <Button
      variant="ghost"
      size="sm"
      icon="close"
      data-part="close-trigger"
      aria-label="Dismiss"
      onclick={ondismiss}
    />
  {/if}
</div>
