<script lang="ts">
  import type { Snippet } from "svelte";
  import * as tabs from "@zag-js/tabs";
  import { useMachine, normalizeProps } from "@zag-js/svelte";
  import type { Orientation, TabsVariant } from "@crosskit-ui/core";

  interface TabItem {
    id: string;
    label: string;
    disabled?: boolean;
  }

  interface Props {
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (details: { value: string }) => void;
    variant?: TabsVariant;
    orientation?: Orientation;
    activationMode?: "automatic" | "manual";
    id?: string;
    class?: string;
    /** One snippet per tab id, receiving nothing. */
    panel?: Snippet<[string]>;
  }

  let {
    items,
    value = $bindable(undefined),
    defaultValue,
    onValueChange,
    variant = "line",
    orientation = "horizontal",
    activationMode,
    id,
    class: klass,
    panel,
  }: Props = $props();

  const uid = $props.id();

  const service = useMachine(tabs.machine, () => ({
    id: id ?? uid,
    orientation,
    value,
    defaultValue: defaultValue ?? items[0]?.id,
    activationMode,
    onValueChange(details: { value: string }) {
      value = details.value;
      onValueChange?.(details);
    },
  }));

  const api = $derived(tabs.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()} data-ck-variant={variant} class={klass}>
  <div {...api.getListProps()}>
    {#each items as item (item.id)}
      <button {...api.getTriggerProps({ value: item.id, disabled: item.disabled })}>
        {item.label}
      </button>
    {/each}
  </div>
  {#each items as item (item.id)}
    <div {...api.getContentProps({ value: item.id })}>
      {@render panel?.(item.id)}
    </div>
  {/each}
</div>
