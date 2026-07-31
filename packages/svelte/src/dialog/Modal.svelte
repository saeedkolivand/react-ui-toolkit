<script lang="ts">
  import type { Snippet } from "svelte";
  import * as dialog from "@zag-js/dialog";
  import { useMachine, normalizeProps, portal } from "@zag-js/svelte";
  import { dataAttr, type ModalSize } from "@crosskit-ui/core";
  import { usePresence, presenceNode } from "./presence.svelte";
  import Button from "../button/Button.svelte";

  interface Props {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (details: { open: boolean }) => void;
    size?: ModalSize;
    role?: "dialog" | "alertdialog";
    modal?: boolean;
    closeOnEscape?: boolean;
    closeOnInteractOutside?: boolean;
    showCloseButton?: boolean;
    centered?: boolean;
    scrollable?: boolean;
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
    size = "md",
    role,
    modal,
    closeOnEscape,
    closeOnInteractOutside,
    showCloseButton = true,
    centered = true,
    scrollable = true,
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
  <div use:portal {...api.getBackdropProps()} data-ck="modal"></div>
  <div use:portal {...api.getPositionerProps()} data-ck="modal" data-centered={dataAttr(centered)}>
    <div
      {...api.getContentProps()}
      data-ck="modal"
      data-size={size}
      data-scrollable={dataAttr(scrollable)}
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
      <div data-scope="dialog" data-part="body" data-ck="modal">{@render children?.()}</div>
      {#if footer}
        <div data-scope="dialog" data-part="footer" data-ck="modal">{@render footer()}</div>
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
