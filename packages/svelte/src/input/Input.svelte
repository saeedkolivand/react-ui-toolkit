<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { ariaAttr, dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";

  interface Props extends Omit<HTMLInputAttributes, "size" | "prefix"> {
    variant?: FieldVariant;
    size?: Size;
    label?: string;
    helperText?: string;
    invalid?: boolean;
    errorMessage?: string;
    fullWidth?: boolean;
    prefix?: Snippet;
    suffix?: Snippet;
    value?: string;
  }

  let {
    variant = "default",
    size = "md",
    label,
    helperText,
    invalid = false,
    errorMessage,
    fullWidth = true,
    prefix,
    suffix,
    disabled = false,
    id,
    value = $bindable(),
    class: klass,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const inputId = $derived(id ?? uid);
  const describedBy = $derived(
    errorMessage ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined,
  );
</script>

<div
  data-scope="input"
  data-part="field"
  data-variant={variant}
  data-invalid={dataAttr(invalid)}
  data-has-prefix={dataAttr(!!prefix)}
  data-has-suffix={dataAttr(!!suffix)}
  data-full-width={dataAttr(fullWidth)}
  class={klass}
>
  {#if label}<label data-part="label" for={inputId}>{label}</label>{/if}
  <div data-scope="input" data-part="control">
    {#if prefix}<span data-part="prefix">{@render prefix()}</span>{/if}
    <input
      id={inputId}
      data-scope="input"
      data-part="input"
      data-size={size}
      {disabled}
      aria-invalid={ariaAttr(invalid)}
      aria-describedby={describedBy}
      bind:value
      {...rest}
    />
    {#if suffix}<span data-part="suffix">{@render suffix()}</span>{/if}
  </div>
  {#if errorMessage}
    <p id="{inputId}-error" data-part="error-text">{errorMessage}</p>
  {:else if helperText}
    <p id="{inputId}-helper" data-part="helper-text">{helperText}</p>
  {/if}
</div>
