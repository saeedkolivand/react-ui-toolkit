<script lang="ts">
  import * as toast from "@zag-js/toast";
  import { useMachine, normalizeProps } from "@zag-js/svelte";
  import type { Toaster as ToasterStore } from "@crosskit-ui/core";
  import ToastItem from "./ToastItem.svelte";

  interface Props {
    /** The store from `createToaster()`. */
    toaster: ToasterStore;
    /** Suppress the per-type icon. */
    hideIcon?: boolean;
    id?: string;
  }

  let { toaster, hideIcon, id }: Props = $props();

  const uid = $props.id();
  const service = useMachine(toast.group.machine, () => ({ id: id ?? uid, store: toaster }));
  const api = $derived(toast.group.connect(service, normalizeProps));
</script>

<div {...api.getGroupProps()}>
  {#each api.getToasts() as item, index (item.id)}
    <ToastItem {item} {index} parent={service} {hideIcon} />
  {/each}
</div>
