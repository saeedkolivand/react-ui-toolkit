<script lang="ts">
  import { useOptionRegistry } from "./context.svelte";

  interface Props {
    value: string;
    /** Falls back to `value`. Svelte snippets cannot be read as text, so unlike
        React and Vue the label is a prop rather than the child content. */
    label?: string;
    disabled?: boolean;
  }

  let { value, label, disabled = false }: Props = $props();

  const registry = useOptionRegistry();
  $effect(() => registry?.register({ value, label: label ?? value, disabled }));
</script>
