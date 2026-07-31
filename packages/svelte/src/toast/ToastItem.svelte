<script lang="ts">
  import * as toast from "@zag-js/toast";
  import { useMachine, normalizeProps } from "@zag-js/svelte";
  import type { IconName } from "@crosskit-ui/core";
  import Icon from "../icon/Icon.svelte";

  // Same mapping as Alert, so a success toast and a success alert look alike.
  const ICON_FOR: Record<string, IconName> = {
    success: "check",
    error: "error",
    warning: "warning",
    info: "info",
  };

  interface Props {
    item: toast.Props;
    index: number;
    parent: toast.GroupService;
    hideIcon?: boolean;
  }

  let { item, index, parent, hideIcon }: Props = $props();

  const service = useMachine(toast.machine, () => ({ ...item, parent, index }));
  const api = $derived(toast.connect(service, normalizeProps));
  const icon = $derived(ICON_FOR[api.type]);
</script>

<div {...api.getRootProps()}>
  {#if !hideIcon && icon}
    <Icon name={icon} data-part="icon" />
  {/if}
  {#if api.title != null}
    <h3 {...api.getTitleProps()}>{api.title}</h3>
  {/if}
  {#if api.description != null}
    <p {...api.getDescriptionProps()}>{api.description}</p>
  {/if}
  <!-- The action lives on the toast's own options, not on the api — the api
       only supplies the trigger's props and click handling. -->
  {#if item.action}
    <button {...api.getActionTriggerProps()}>{item.action.label}</button>
  {/if}
  {#if api.closable}
    <button {...api.getCloseTriggerProps()} aria-label="Dismiss">
      <Icon name="close" size="sm" />
    </button>
  {/if}
</div>
