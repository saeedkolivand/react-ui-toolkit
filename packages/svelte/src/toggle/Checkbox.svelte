<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { ariaAttr, dataAttr, type Size } from "@crosskit-ui/core";

  interface Props extends Omit<HTMLInputAttributes, "size" | "type"> {
    size?: Size;
    label?: string;
    invalid?: boolean;
    indeterminate?: boolean;
    checked?: boolean;
    children?: Snippet;
  }

  let {
    size = "md",
    label,
    invalid = false,
    indeterminate = $bindable(false),
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

<label
  data-scope="checkbox"
  data-part="root"
  data-disabled={dataAttr(disabled)}
  data-invalid={dataAttr(invalid)}
  for={inputId}
  class={klass}
>
  <!-- `indeterminate` has no HTML attribute, but Svelte binds the DOM property
       directly, so no effect is needed here as it is in React and Vue. -->
  <input
    id={inputId}
    type="checkbox"
    data-part="control"
    data-size={size}
    {disabled}
    aria-invalid={ariaAttr(invalid)}
    bind:checked
    bind:indeterminate
    {...rest}
  />
  {#if label || children}
    <span data-part="label">{#if children}{@render children()}{:else}{label}{/if}</span>
  {/if}
</label>
