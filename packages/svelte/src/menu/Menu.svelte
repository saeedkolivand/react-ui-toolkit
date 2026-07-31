<script lang="ts" module>
  import type { IconName } from "@crosskit-ui/core";

  export interface MenuItem {
    /** v0 called this `key`. */
    value: string;
    label: string;
    icon?: IconName;
    disabled?: boolean;
    danger?: boolean;
  }
  export interface MenuSeparator {
    separator: true;
  }
  export type MenuEntry = MenuItem | MenuSeparator;
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import * as menu from "@zag-js/menu";
  import { useMachine, normalizeProps, portal } from "@zag-js/svelte";
  import {
    dataAttr,
    resolvePlacement,
    type LegacyPlacement,
    type Placement,
    type Size,
    type Variant,
  } from "@crosskit-ui/core";
  import Icon from "../icon/Icon.svelte";
  import { usePresence, presenceNode } from "../presence.svelte";

  interface Props {
    items: MenuEntry[];
    /** Trigger *content*, not a trigger element — Menu renders the button. */
    trigger?: string | Snippet;
    triggerVariant?: Variant;
    triggerSize?: Size;
    onSelect?: (details: { value: string }) => void;
    placement?: Placement | LegacyPlacement;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (details: { open: boolean }) => void;
    id?: string;
    class?: string;
    triggerClass?: string;
  }

  let {
    items,
    trigger,
    triggerVariant = "secondary",
    triggerSize = "md",
    onSelect,
    placement,
    open = $bindable(undefined),
    defaultOpen,
    onOpenChange,
    id,
    class: klass,
    triggerClass,
  }: Props = $props();

  const isSeparator = (entry: MenuEntry): entry is MenuSeparator => "separator" in entry;

  const uid = $props.id();

  const service = useMachine(menu.machine, () => ({
    id: id ?? uid,
    open,
    defaultOpen,
    positioning: { placement: resolvePlacement(placement, "bottom-start") },
    onSelect,
    onOpenChange(details: { open: boolean }) {
      open = details.open;
      onOpenChange?.(details);
    },
  }));

  const api = $derived(menu.connect(service, normalizeProps));
  const presence = usePresence(() => ({ present: api.open }));
</script>

<!-- Zag's own data-scope/data-part are replaced with Button's so the trigger
     simply IS a Button. Nothing in overlay.css targets
     [data-scope="menu"][data-part="trigger"], and the machine's data-state still
     lands, which is all the CSS needs. -->
<button
  {...api.getTriggerProps()}
  data-scope="button"
  data-part="root"
  data-variant={triggerVariant}
  data-size={triggerSize}
  data-menu-trigger=""
  class={triggerClass}
>
  {#if typeof trigger === "string"}{trigger}{:else}{@render trigger?.()}{/if}
</button>

{#if presence.present}
  <div use:portal {...api.getPositionerProps()}>
    <div {...api.getContentProps()} class={klass} use:presenceNode={presence.setNode}>
      {#each items as entry, index (isSeparator(entry) ? `sep-${index}` : entry.value)}
        {#if isSeparator(entry)}
          <hr {...api.getSeparatorProps()} />
        {:else}
          <div
            {...api.getItemProps({ value: entry.value, disabled: entry.disabled })}
            data-danger={dataAttr(entry.danger)}
          >
            {#if entry.icon}<Icon name={entry.icon} size="sm" />{/if}
            {entry.label}
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}
