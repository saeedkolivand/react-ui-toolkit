<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { ariaAttr, dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";

  interface Props extends Omit<HTMLTextareaAttributes, "size"> {
    variant?: FieldVariant;
    size?: Size;
    label?: string;
    helperText?: string;
    invalid?: boolean;
    errorMessage?: string;
    autoResize?: boolean;
    fullWidth?: boolean;
    value?: string;
  }

  let {
    variant = "default",
    size = "md",
    label,
    helperText,
    invalid = false,
    errorMessage,
    autoResize = false,
    fullWidth = true,
    disabled = false,
    id,
    value = $bindable(""),
    class: klass,
    ...rest
  }: Props = $props();

  const uid = $props.id();
  const textareaId = $derived(id ?? uid);
  const describedBy = $derived(
    errorMessage ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined,
  );
</script>

<div
  data-scope="textarea"
  data-part="field"
  data-variant={variant}
  data-invalid={dataAttr(invalid)}
  data-full-width={dataAttr(fullWidth)}
  class={klass}
>
  {#if label}<label data-part="label" for={textareaId}>{label}</label>{/if}
  <!-- Auto-resize is CSS; data-value feeds the invisible replica that sizes the
       grid cell. Because it is bound to `value` rather than written in an event
       handler, it is correct for pastes, programmatic changes and initial
       multi-line values — all of which v0 got wrong. -->
  <div
    data-scope="textarea"
    data-part="control"
    data-auto-resize={dataAttr(autoResize)}
    data-value={autoResize ? value : undefined}
  >
    <textarea
      id={textareaId}
      data-scope="textarea"
      data-part="input"
      data-size={size}
      {disabled}
      aria-invalid={ariaAttr(invalid)}
      aria-describedby={describedBy}
      bind:value
      {...rest}
    ></textarea>
  </div>
  {#if errorMessage}
    <p id="{textareaId}-error" data-part="error-text">{errorMessage}</p>
  {:else if helperText}
    <p id="{textareaId}-helper" data-part="helper-text">{helperText}</p>
  {/if}
</div>
