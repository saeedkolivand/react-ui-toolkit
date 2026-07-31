<script setup lang="ts">
import { computed, useId, useSlots, Fragment, type VNode } from "vue";
import * as select from "@zag-js/select";
import { useMachine, normalizeProps } from "@zag-js/vue";
import { dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";
import Icon from "../icon/Icon.vue";
import Option from "./Option";

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    items?: SelectItem[];
    value?: string;
    defaultValue?: string;
    open?: boolean;
    defaultOpen?: boolean;
    placeholder?: string;
    size?: Size;
    variant?: FieldVariant;
    label?: string;
    helperText?: string;
    invalid?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    name?: string;
    required?: boolean;
    fullWidth?: boolean;
    id?: string;
  }>(),
  {
    placeholder: "Select an option",
    size: "md",
    variant: "default",
    invalid: false,
    fullWidth: true,
  }
);

const emit = defineEmits<{
  "update:value": [string];
  valueChange: [{ value: string; item: SelectItem | null }];
  "update:open": [boolean];
  openChange: [{ open: boolean }];
}>();

const slots = useSlots();

function textOf(nodes: VNode[] | undefined): string {
  return (nodes ?? [])
    .map(n => (typeof n.children === "string" ? n.children : ""))
    .join("")
    .trim();
}

function itemsFromSlot(nodes: VNode[]): SelectItem[] {
  return nodes.flatMap(node => {
    if (node.type === Fragment) return itemsFromSlot((node.children ?? []) as VNode[]);
    if (node.type !== Option) return [];
    const slotted = (node.children as { default?: () => VNode[] } | null)?.default?.();
    const value = String(node.props?.value ?? "");
    return [
      {
        value,
        label: (node.props?.label as string) || textOf(slotted) || value,
        disabled: node.props?.disabled != null && node.props.disabled !== false,
      },
    ];
  });
}

const resolved = computed(() => props.items ?? itemsFromSlot(slots.default?.() ?? []));
const autoId = useId();
const selectId = computed(() => props.id ?? autoId);
const describedBy = computed(() =>
  props.errorMessage
    ? `${selectId.value}-error`
    : props.helperText
      ? `${selectId.value}-helper`
      : undefined
);

// @zag-js/vue takes a GETTER, not an object, so prop changes stay reactive.
const machineProps = computed(() => ({
  id: selectId.value,
  collection: select.collection({
    items: resolved.value,
    isItemDisabled: (item: SelectItem) => !!item.disabled,
  }),
  disabled: props.disabled,
  required: props.required,
  name: props.name,
  invalid: props.invalid,
  open: props.open,
  defaultOpen: props.defaultOpen,
  // The machine is multi-select capable; v1 exposes single-select only, so the
  // string prop is widened here and narrowed on the way out.
  value: props.value == null ? undefined : [props.value],
  defaultValue: props.defaultValue == null ? undefined : [props.defaultValue],
  onValueChange(details: { value: string[]; items: SelectItem[] }) {
    const next = { value: details.value[0] ?? "", item: details.items[0] ?? null };
    emit("update:value", next.value);
    emit("valueChange", next);
  },
  onOpenChange(details: { open: boolean }) {
    emit("update:open", details.open);
    emit("openChange", details);
  },
}));
const service = useMachine(select.machine, machineProps);
const api = computed(() => select.connect(service, normalizeProps));

// Zag always points aria-labelledby at the label part. With no `label` that
// element is never rendered, which would leave exactly the dangling ARIA
// reference this port exists to stop shipping (bug 0.6).
function labelled<T extends object>(attrs: T): T {
  return props.label == null ? { ...attrs, "aria-labelledby": undefined } : attrs;
}
</script>

<template>
  <div
    v-bind="api.getRootProps()"
    :data-size="props.size"
    :data-variant="props.variant"
    :data-invalid="dataAttr(props.invalid)"
    :data-full-width="dataAttr(props.fullWidth)"
  >
    <label v-if="props.label != null" v-bind="api.getLabelProps()">
      <slot name="label">{{ props.label }}</slot>
    </label>
    <div v-bind="api.getControlProps()">
      <button v-bind="labelled(api.getTriggerProps())" :aria-describedby="describedBy">
        <span v-bind="api.getValueTextProps()">{{ api.valueAsString || props.placeholder }}</span>
        <span v-bind="api.getIndicatorProps()"><Icon name="chevronDown" size="sm" /></span>
      </button>
    </div>
    <select v-bind="labelled(api.getHiddenSelectProps())">
      <option v-for="item in resolved" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>
    <Teleport to="body">
      <div v-bind="api.getPositionerProps()">
        <ul v-bind="labelled(api.getContentProps())">
          <li v-for="item in resolved" :key="item.value" v-bind="api.getItemProps({ item })">
            <span v-bind="api.getItemTextProps({ item })">{{ item.label }}</span>
            <span v-bind="api.getItemIndicatorProps({ item })"
              ><Icon name="check" size="sm"
            /></span>
          </li>
        </ul>
      </div>
    </Teleport>
    <p v-if="props.errorMessage != null" :id="`${selectId}-error`" data-part="error-text">
      {{ props.errorMessage }}
    </p>
    <p v-else-if="props.helperText != null" :id="`${selectId}-helper`" data-part="helper-text">
      {{ props.helperText }}
    </p>
  </div>
</template>
