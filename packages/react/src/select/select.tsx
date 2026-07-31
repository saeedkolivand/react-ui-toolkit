"use client";

import { Children, isValidElement, useId, useMemo, type ReactNode, type ReactElement } from "react";
import * as select from "@zag-js/select";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import { dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface OptionProps {
  value: string;
  disabled?: boolean;
  /** Falls back to `value` when omitted. */
  children?: ReactNode;
}

/**
 * Declarative alternative to `items`. Renders nothing itself — Select reads
 * these props to build the collection, so the machine still owns typeahead and
 * keyboard navigation.
 *
 * ponytail: Select inspects its direct children rather than running a
 * context-registration dance. Ceiling: an Option wrapped in another component
 * is invisible. Pass `items` for anything dynamic.
 */
export function Option(_props: OptionProps): null {
  return null;
}

export interface SelectProps {
  items?: SelectItem[];
  /** Single-select in v1. v0 required this; it is now optional. */
  value?: string;
  defaultValue?: string;
  /**
   * v0's fake-event contract (`onChange={e => set(e.target.value)}`) is gone —
   * there was never a real `<select>` behind it.
   */
  onValueChange?: (details: { value: string; item: SelectItem | null }) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  placeholder?: string;
  size?: Size;
  variant?: FieldVariant;
  label?: ReactNode;
  helperText?: ReactNode;
  /** v0 called this `error`. */
  invalid?: boolean;
  errorMessage?: ReactNode;
  disabled?: boolean;
  /** Submitted through a hidden native <select>, so plain forms just work. */
  name?: string;
  required?: boolean;
  fullWidth?: boolean;
  id?: string;
  className?: string;
  children?: ReactNode;
}

function itemsFromChildren(children: ReactNode): SelectItem[] {
  // Reading children's props is the whole point here — zag needs the collection
  // before first paint, so there is no effect-based registration to prefer.
  // eslint-disable-next-line @eslint-react/no-children-to-array
  return Children.toArray(children)
    .filter((c): c is ReactElement<OptionProps> => isValidElement(c) && c.type === Option)
    .map(c => ({
      value: c.props.value,
      label: typeof c.props.children === "string" ? c.props.children : c.props.value,
      disabled: c.props.disabled,
    }));
}

export function Select({
  items,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select an option",
  size = "md",
  variant = "default",
  label,
  helperText,
  invalid = false,
  errorMessage,
  disabled,
  name,
  required,
  fullWidth = true,
  id,
  className,
  children,
  ...machineProps
}: SelectProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const selectId = id ?? autoId;
  const resolved = useMemo(() => items ?? itemsFromChildren(children), [items, children]);
  const collection = useMemo(
    () => select.collection({ items: resolved, isItemDisabled: item => !!item.disabled }),
    [resolved]
  );
  const describedBy = errorMessage
    ? `${selectId}-error`
    : helperText
      ? `${selectId}-helper`
      : undefined;

  const service = useMachine(select.machine, {
    id: selectId,
    collection,
    disabled,
    required,
    name,
    invalid,
    // The machine is multi-select capable; v1 exposes single-select only, so
    // the string prop is widened here and narrowed on the way out.
    value: value == null ? undefined : [value],
    defaultValue: defaultValue == null ? undefined : [defaultValue],
    onValueChange: onValueChange
      ? d => onValueChange({ value: d.value[0] ?? "", item: d.items[0] ?? null })
      : undefined,
    ...machineProps,
  });
  const api = select.connect(service, normalizeProps);

  // Zag always points aria-labelledby at the label part. With no `label` that
  // element is never rendered, which would leave exactly the dangling ARIA
  // reference this port exists to stop shipping (bug 0.6).
  const labelled = <T extends object>(props: T): T =>
    label == null ? { ...props, "aria-labelledby": undefined } : props;

  return (
    <div
      {...api.getRootProps()}
      data-size={size}
      data-variant={variant}
      data-invalid={dataAttr(invalid)}
      data-full-width={dataAttr(fullWidth)}
      className={className}
    >
      {label != null && <label {...api.getLabelProps()}>{label}</label>}
      <div {...api.getControlProps()}>
        <button {...labelled(api.getTriggerProps())} aria-describedby={describedBy}>
          <span {...api.getValueTextProps()}>{api.valueAsString || placeholder}</span>
          <span {...api.getIndicatorProps()}>
            <Icon name="chevronDown" size="sm" />
          </span>
        </button>
      </div>
      <select {...labelled(api.getHiddenSelectProps())}>
        {resolved.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <Portal>
        <div {...api.getPositionerProps()}>
          <ul {...labelled(api.getContentProps())}>
            {resolved.map(item => (
              <li key={item.value} {...api.getItemProps({ item })}>
                <span {...api.getItemTextProps({ item })}>{item.label}</span>
                <span {...api.getItemIndicatorProps({ item })}>
                  <Icon name="check" size="sm" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Portal>
      {errorMessage != null ? (
        <p id={`${selectId}-error`} data-part="error-text" aria-live="polite">
          {errorMessage}
        </p>
      ) : (
        helperText != null && (
          <p id={`${selectId}-helper`} data-part="helper-text">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}
