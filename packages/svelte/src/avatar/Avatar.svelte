<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { dataAttr, type IconSize } from "@crosskit-ui/core";

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    src?: string;
    alt?: string;
    size?: IconSize;
    status?: "online" | "offline" | "busy" | "away";
    initials?: string;
    squared?: boolean;
    bordered?: boolean;
    children?: Snippet;
  }

  let {
    src,
    alt = "",
    size = "md",
    status,
    initials,
    squared = false,
    bordered = false,
    children,
    class: klass,
    ...rest
  }: Props = $props();

  let state = $state<"loading" | "loaded" | "error">("loading");
  const showFallback = $derived(!src || state === "error");
  const initialsText = $derived(
    initials
      ? initials
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase() ?? "")
          .join("")
      : "",
  );
</script>

<span
  data-scope="avatar"
  data-part="root"
  data-size={size}
  data-squared={dataAttr(squared)}
  data-bordered={dataAttr(bordered)}
  class={klass}
  {...rest}
>
  {#if src}
    <img
      data-part="image"
      data-state={state}
      {src}
      {alt}
      onload={() => (state = "loaded")}
      onerror={() => (state = "error")}
    />
  {/if}
  {#if showFallback}
    <span data-part="fallback">
      {#if children}{@render children()}{:else}{initialsText}{/if}
    </span>
  {/if}
  {#if status}
    <span data-part="status" data-status={status} aria-label={status}></span>
  {/if}
</span>
