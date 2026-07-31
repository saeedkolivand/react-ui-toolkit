<!-- The same @zag-js/dialog machine as Modal. Only data-ck, data-placement and
     the animation differ; focus trap, scroll lock, Escape and ARIA are shared. -->
<script lang="ts">
  import type { Snippet } from "svelte";
  import * as dialog from "@zag-js/dialog";
  import { useMachine, normalizeProps, portal } from "@zag-js/svelte";
  import type { Side, Size } from "@crosskit-ui/core";
  import { usePresence, presenceNode } from "../presence.svelte";
  import Button from "../button/Button.svelte";

  interface Props {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (details: { open: boolean }) => void;
    placement?: Side;
    size?: Size;
    role?: "dialog" | "alertdialog";
    modal?: boolean;
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
    showCloseButton?: boolean;
    id?: string;
    class?: string;
    title?: Snippet | string;
    description?: Snippet | string;
    footer?: Snippet;
    children?: Snippet;
  }

  let {
    // $bindable gives `bind:open` — the direct analogue of Vue's v-model:open
    // and Angular's [(open)].
    open = $bindable(undefined),
    defaultOpen,
    onOpenChange,
    placement = "right",
    size = "md",
    role,
    modal,
    closeOnEscape,
    closeOnInteractOutside,
    showCloseButton = true,
    id,
    class: klass,
    title,
    description,
    footer,
    children,
  }: Props = $props();

  const uid = $props.id();

  const service = useMachine(dialog.machine, () => ({
    id: id ?? uid,
    open,
    defaultOpen,
    role,
    modal,
    closeOnEscape,
    closeOnInteractOutside,
    onOpenChange(details: { open: boolean }) {
      open = details.open;
      onOpenChange?.(details);
    },
  }));

  const api = $derived(dialog.connect(service, normalizeProps));
  const presence = usePresence(() => ({ present: api.open }));
</script>

{#if presence.present}
  <div use:portal {...api.getBackdropProps()} data-ck="drawer"></div>
  <div use:portal {...api.getPositionerProps()} data-ck="drawer">
    <div
      {...api.getContentProps()}
      data-ck="drawer"
      data-placement={placement}
      data-size={size}
      class={klass}
      use:presenceNode={presence.setNode}
    >
      {#if title}
        <h2 {...api.getTitleProps()}>
          {#if typeof title === "string"}{title}{:else}{@render title()}{/if}
        </h2>
      {/if}
      {#if description}
        <p {...api.getDescriptionProps()}>
          {#if typeof description === "string"}{description}{:else}{@render description()}{/if}
        </p>
      {/if}
      <div data-scope="dialog" data-part="body" data-ck="drawer">{@render children?.()}</div>
      {#if footer}
        <div data-scope="dialog" data-part="footer" data-ck="drawer">{@render footer()}</div>
      {/if}
      {#if showCloseButton}
        <Button
          variant="ghost"
          size="sm"
          icon="close"
          data-close-trigger=""
          aria-label="Close"
          onclick={() => api.setOpen(false)}
        />
      {/if}
    </div>
  </div>
{/if}
