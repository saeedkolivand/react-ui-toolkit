<script lang="ts">
  import type { Snippet } from "svelte";
  import * as select from "@zag-js/select";
  import { useMachine, normalizeProps, portal } from "@zag-js/svelte";
  import { dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";
  import Icon from "../icon/Icon.svelte";
  import { createOptionRegistry, type SelectItem } from "./context.svelte";

  interface Props {
    items?: SelectItem[];
    value?: string;
    defaultValue?: string;
    open?: boolean;
    defaultOpen?: boolean;
    onValueChange?: (details: { value: string; item: SelectItem | null }) => void;
    onOpenChange?: (details: { open: boolean }) => void;
    placeholder?: string;
    size?: Size;
    variant?: FieldVariant;
    label?: string;
    helperText?: string;
    invalid?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    name?: string;
    required?: boolean;
    fullWidth?: boolean;
    id?: string;
    class?: string;
    /** `<Option>` children. Ignored when `items` is given. */
    children?: Snippet;
  }

  let {
    items,
    // $bindable gives `bind:value` — the analogue of Vue's v-model:value and
    // Angular's [(value)].
    value = $bindable(undefined),
    defaultValue,
    open = $bindable(undefined),
    defaultOpen,
    onValueChange,
    onOpenChange,
    placeholder = "Select an option",
    size = "md",
    variant = "default",
    label,
    helperText,
    invalid = false,
    errorMessage,
    disabled,
    name,
    required,
    fullWidth = true,
    id,
    class: klass,
    children,
  }: Props = $props();

  const registry = createOptionRegistry();
  const resolved = $derived(items ?? registry.items);

  const uid = $props.id();
  const selectId = $derived(id ?? uid);
  const describedBy = $derived(
    errorMessage ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined
  );

  const service = useMachine(select.machine, () => ({
    id: selectId,
    collection: select.collection({
      items: resolved,
      isItemDisabled: (item: SelectItem) => !!item.disabled,
    }),
    disabled,
    required,
    name,
    invalid,
    open,
    defaultOpen,
    // The machine is multi-select capable; v1 exposes single-select only, so the
    // string prop is widened here and narrowed on the way out.
    value: value == null ? undefined : [value],
    defaultValue: defaultValue == null ? undefined : [defaultValue],
    onValueChange(details: { value: string[]; items: SelectItem[] }) {
      value = details.value[0] ?? "";
      onValueChange?.({ value, item: details.items[0] ?? null });
    },
    onOpenChange(details: { open: boolean }) {
      open = details.open;
      onOpenChange?.(details);
    },
  }));

  const api = $derived(select.connect(service, normalizeProps));

  // Zag always points aria-labelledby at the label part. With no `label` that
  // element is never rendered, which would leave exactly the dangling ARIA
  // reference this port exists to stop shipping (bug 0.6).
  const labelled = <T extends object>(attrs: T): T =>
    label == null ? { ...attrs, "aria-labelledby": undefined } : attrs;
</script>

<div
  {...api.getRootProps()}
  data-size={size}
  data-variant={variant}
  data-invalid={dataAttr(invalid)}
  data-full-width={dataAttr(fullWidth)}
  class={klass}
>
  <!-- Options render nothing; this exists only so their init runs and they can
       register. Skipped entirely when `items` is supplied. -->
  {#if !items}
    <div hidden>{@render children?.()}</div>
  {/if}

  {#if label != null}
    <label {...api.getLabelProps()}>{label}</label>
  {/if}
  <div {...api.getControlProps()}>
    <button {...labelled(api.getTriggerProps())} aria-describedby={describedBy}>
      <span {...api.getValueTextProps()}>{api.valueAsString || placeholder}</span>
      <span {...api.getIndicatorProps()}><Icon name="chevronDown" size="sm" /></span>
    </button>
  </div>
  <select {...labelled(api.getHiddenSelectProps())}>
    {#each resolved as item (item.value)}
      <option value={item.value}>{item.label}</option>
    {/each}
  </select>
  <div use:portal {...api.getPositionerProps()}>
    <ul {...labelled(api.getContentProps())}>
      {#each resolved as item (item.value)}
        <li {...api.getItemProps({ item })}>
          <span {...api.getItemTextProps({ item })}>{item.label}</span>
          <span {...api.getItemIndicatorProps({ item })}><Icon name="check" size="sm" /></span>
        </li>
      {/each}
    </ul>
  </div>
  {#if errorMessage != null}
    <p id="{selectId}-error" data-part="error-text">{errorMessage}</p>
  {:else if helperText != null}
    <p id="{selectId}-helper" data-part="helper-text">{helperText}</p>
  {/if}
</div>
