<script lang="ts">
  import type { Snippet } from "svelte";
  import * as accordion from "@zag-js/accordion";
  import { useMachine, normalizeProps } from "@zag-js/svelte";
  import Icon from "../icon/Icon.svelte";

  interface AccordionItem {
    id: string;
    title: string;
    disabled?: boolean;
  }

  interface Props {
    items: AccordionItem[];
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (details: { value: string[] }) => void;
    allowMultiple?: boolean;
    collapsible?: boolean;
    id?: string;
    class?: string;
    panel?: Snippet<[string]>;
  }

  let {
    items,
    value = $bindable(undefined),
    defaultValue,
    onValueChange,
    allowMultiple = false,
    collapsible = true,
    id,
    class: klass,
    panel,
  }: Props = $props();

  const uid = $props.id();

  const service = useMachine(accordion.machine, () => ({
    id: id ?? uid,
    multiple: allowMultiple,
    collapsible,
    value,
    defaultValue,
    onValueChange(details: { value: string[] }) {
      value = details.value;
      onValueChange?.(details);
    },
  }));

  const api = $derived(accordion.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()} class={klass}>
  {#each items as item (item.id)}
    <div {...api.getItemProps({ value: item.id, disabled: item.disabled })}>
      <h3>
        <button {...api.getItemTriggerProps({ value: item.id, disabled: item.disabled })}>
          {item.title}
          <!-- rotates off the machine's own data-state; no JS toggling a class -->
          <Icon name="chevronDown" size="sm" data-part="item-indicator" />
        </button>
      </h3>
      <div {...api.getItemContentProps({ value: item.id, disabled: item.disabled })}>
        {@render panel?.(item.id)}
      </div>
    </div>
  {/each}
</div>
