<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { dataAttr, type Size } from "@crosskit-ui/core";

  interface Props extends Omit<HTMLInputAttributes, "size" | "type"> {
    size?: Size;
    label?: string;
    invalid?: boolean;
    group?: string;
    children?: Snippet;
  }

  let {
    size = "md",
    label,
    invalid = false,
    group = $bindable(),
    value,
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
  data-scope="radio"
  data-part="root"
  data-disabled={dataAttr(disabled)}
  data-invalid={dataAttr(invalid)}
  for={inputId}
  class={klass}
>
  <!-- bind:group is Svelte's native radio idiom — the direct analogue of
       React's shared `name` and Vue's v-model. -->
  <input
    id={inputId}
    type="radio"
    data-part="control"
    data-size={size}
    {disabled}
    {value}
    bind:group
    {...rest}
  />
  {#if label || children}
    <span data-part="label"
      >{#if children}{@render children()}{:else}{label}{/if}</span
    >
  {/if}
</label>
