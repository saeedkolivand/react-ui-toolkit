<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { dataAttr, type Size } from "@crosskit-ui/core";

  interface Props extends Omit<HTMLInputAttributes, "size" | "type"> {
    size?: Size;
    label?: string;
    checked?: boolean;
    children?: Snippet;
  }

  let {
    size = "md",
    label,
    checked = $bindable(false),
    disabled = false,
    id,
    children,
    class: klass,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const inputId = $derived(id ?? uid);
</script>

<!-- One real checkbox, one change event. v0 combined a wrapper onClick that
     synthesised a fake event with an inner onChange, so a single interaction
     could fire twice with different payload shapes. -->
<label
  data-scope="switch"
  data-part="root"
  data-disabled={dataAttr(disabled)}
  for={inputId}
  class={klass}
>
  <input
    id={inputId}
    type="checkbox"
    role="switch"
    data-part="hidden-input"
    {disabled}
    bind:checked
    {...rest}
  />
  <span data-part="control" data-size={size}>
    <span data-part="thumb"></span>
  </span>
  {#if label || children}
    <span data-part="label"
      >{#if children}{@render children()}{:else}{label}{/if}</span
    >
  {/if}
</label>
