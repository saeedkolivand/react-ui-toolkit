<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { dataAttr, type Size, type Status } from "@crosskit-ui/core";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    value?: number | null;
    max?: number;
    variant?: "primary" | Status;
    size?: Size;
    label?: string;
    showValue?: boolean;
    striped?: boolean;
    animated?: boolean;
  }

  let {
    value = null,
    max = 100,
    variant = "primary",
    size = "md",
    label,
    showValue = false,
    striped = false,
    animated = false,
    class: klass,
    ...rest
  }: Props = $props();

  const indeterminate = $derived(value == null);
  const percent = $derived(indeterminate ? 0 : Math.min(100, Math.max(0, (value! / max) * 100)));
</script>

<div
  data-scope="progress"
  data-part="root"
  data-variant={variant}
  data-indeterminate={dataAttr(indeterminate)}
  class={klass}
  {...rest}
>
  {#if label || showValue}
    <div data-part="label">
      <span>{label ?? ""}</span>
      {#if showValue && !indeterminate}
        <span data-part="value-text">{Math.round(percent)}%</span>
      {/if}
    </div>
  {/if}
  <div
    data-part="track"
    data-size={size}
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={max}
    aria-valuenow={indeterminate ? undefined : value}
  >
    <div
      data-part="range"
      data-striped={dataAttr(striped)}
      data-animated={dataAttr(animated)}
      style="--ck-progress-percent:{percent}"
    ></div>
  </div>
</div>
