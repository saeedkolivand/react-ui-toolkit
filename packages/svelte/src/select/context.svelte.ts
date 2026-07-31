import { getContext, setContext } from "svelte";

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

const KEY = Symbol("ck-select-options");

interface Registry {
  items: SelectItem[];
  register: (item: SelectItem) => void;
}

/**
 * Svelte snippets are opaque functions, so unlike React and Vue there is no way
 * to read the children's props before rendering them. Options therefore register
 * themselves: Select renders the snippet into a hidden node purely so each
 * Option's init runs, then builds the collection from what registered.
 */
export function createOptionRegistry(): Registry {
  const items = $state<SelectItem[]>([]);
  const registry: Registry = {
    get items() {
      return items;
    },
    register(item) {
      const at = items.findIndex(i => i.value === item.value);
      if (at === -1) items.push(item);
      else items[at] = item;
    },
  };
  setContext(KEY, registry);
  return registry;
}

export function useOptionRegistry(): Registry | undefined {
  return getContext<Registry | undefined>(KEY);
}
