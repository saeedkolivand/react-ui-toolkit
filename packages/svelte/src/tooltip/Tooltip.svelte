<script lang="ts">
  import type { Snippet } from "svelte";
  import * as tooltip from "@zag-js/tooltip";
  import { useMachine, normalizeProps, portal } from "@zag-js/svelte";
  import {
    isFocusVisible,
    resolvePlacement,
    type LegacyPlacement,
    type Placement,
  } from "@crosskit-ui/core";
  import { usePresence, presenceNode } from "../presence.svelte";

  interface Props {
    content?: string | Snippet;
    /** Accepts Floating UI names and v0's Ant names (`topLeft`, `rightBottom`, …). */
    placement?: Placement | LegacyPlacement;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (details: { open: boolean }) => void;
    openDelay?: number;
    closeDelay?: number;
    disabled?: boolean;
    class?: string;
    contentClass?: string;
    id?: string;
    children?: Snippet;
  }

  let {
    content,
    placement,
    open = $bindable(undefined),
    defaultOpen,
    onOpenChange,
    openDelay,
    closeDelay,
    disabled,
    class: klass,
    contentClass,
    id,
    children,
  }: Props = $props();

  const uid = $props.id();

  const service = useMachine(tooltip.machine, () => ({
    id: id ?? uid,
    open,
    defaultOpen,
    openDelay,
    closeDelay,
    disabled,
    positioning: { placement: resolvePlacement(placement) },
    onOpenChange(details: { open: boolean }) {
      open = details.open;
      onOpenChange?.(details);
    },
  }));

  const api = $derived(tooltip.connect(service, normalizeProps));
  const presence = usePresence(() => ({ present: api.open }));

  // zag types the trigger through normalize.button; this one lands on a <span>,
  // so the props are widened rather than the element being changed.
  const triggerProps = $derived(api.getTriggerProps() as Record<string, unknown>);
</script>

<!-- focus/blur do not bubble to a wrapper, so focusin/focusout stand in. React's
     synthetic events fake the bubbling and would have hidden this divergence. -->
<span
  {...triggerProps}
  class={klass}
  onfocusin={e => {
    if (isFocusVisible(e.target)) api.setOpen(true);
  }}
  onfocusout={() => api.setOpen(false)}
>
  {@render children?.()}
</span>

<!-- Gate on presence, NEVER on api.open, or [data-state="closed"] never gets a
     frame and the exit animation silently does nothing. -->
{#if presence.present}
  <div use:portal {...api.getPositionerProps()}>
    <div {...api.getContentProps()} class={contentClass} use:presenceNode={presence.setNode}>
      {#if typeof content === "string"}{content}{:else}{@render content?.()}{/if}
    </div>
  </div>
{/if}
