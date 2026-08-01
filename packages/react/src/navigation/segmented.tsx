"use client";

import {
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { createCollection, dataAttr, navigate } from "@crosskit-ui/core";

export type SegmentedSize = "small" | "middle" | "large";

export interface SegmentedOption {
  label: ReactNode;
  value: string;
  disabled?: boolean;
  icon?: ReactNode;
}

// `children` is omitted alongside `onChange`: the content comes from
// `options`, and a type that still accepts children invites markup that JSX
// silently discards.
export interface SegmentedProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "children"
> {
  /** A bare string is both the label and the value. */
  options: Array<SegmentedOption | string>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: SegmentedSize;
  disabled?: boolean;
  /** Share the inline axis equally rather than sizing to the labels. */
  block?: boolean;
  vertical?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const normalise = (option: SegmentedOption | string): SegmentedOption =>
  typeof option === "string" ? { label: option, value: option } : option;

export function Segmented({
  options,
  value: controlled,
  defaultValue,
  onChange,
  size = "middle",
  disabled = false,
  block = false,
  vertical = false,
  className,
  ref,
  ...rest
}: SegmentedProps) {
  const items = useMemo(() => options.map(normalise), [options]);

  // The first ENABLED option, not the first option. A radio group puts its one
  // `tabIndex={0}` on the checked item, and defaulting to a disabled one leaves
  // every item at `-1` — a control no keyboard can reach at all.
  const [uncontrolled, setUncontrolled] = useState(
    defaultValue ?? items.find(item => !item.disabled)?.value ?? items[0]?.value ?? ""
  );
  const selected = controlled ?? uncontrolled;

  const collection = useMemo(
    () =>
      createCollection(
        items.map(item => ({
          value: item.value,
          label: typeof item.label === "string" ? item.label : "",
          disabled: item.disabled || disabled,
        }))
      ),
    [items, disabled]
  );

  const select = useCallback(
    (next: string) => {
      if (controlled === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [controlled, onChange]
  );

  // Which option holds the one `tabIndex={0}`. A consumer can name a disabled
  // option in `value`, and a tab stop that cannot be focused is no tab stop.
  const rovingValue = items.some(item => item.value === selected && !item.disabled && !disabled)
    ? selected
    : (collection.first()?.value ?? selected);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // `currentTarget` rather than a ref of our own: the handler is on the root,
    // so it already has the node — and merging a private ref with the
    // consumer's is code that exists only to re-derive it.
    const root = event.currentTarget;
    // Anchored on the tab stop, not on the selection. The two are the same
    // everywhere except the case this component handles on purpose — a
    // disabled selected option, where the tab stop has already moved on — and
    // stepping from the selection there starts on an option nothing is focused
    // on, so the first key lands back where focus already was. Tabs anchors on
    // `focused ?? active` for the same reason.
    const result = navigate(event, collection, rovingValue, {
      // Both axes, and looping, because that is the radio-group pattern rather
      // than the tablist one — `vertical` changes how it looks, not which keys
      // work, and a user who does not know the visual orientation still gets
      // where they are going.
      orientation: "both",
      loop: true,
      // Read off the DOM: `dir` is inherited from an ancestor and the browser
      // has already resolved it.
      rtl: getComputedStyle(root).direction === "rtl",
    });
    if (!result.handled) return;
    event.preventDefault();
    if (result.value === undefined) return;

    // Arrows both move AND select here. That is the radio-group pattern, and it
    // is why there is no `activationMode` to choose: a segmented control has no
    // panel to load, so deferring selection would only cost a keypress.
    select(result.value);
    // By position, not by a `[data-value="…"]` selector: the values are
    // consumer strings and one containing a quote would break the selector.
    const index = items.findIndex(item => item.value === result.value);
    (root.children[index] as HTMLElement | undefined)?.focus();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      aria-disabled={disabled ? "true" : undefined}
      data-scope="segmented"
      data-part="root"
      data-size={size}
      data-block={dataAttr(block)}
      data-vertical={dataAttr(vertical)}
      data-disabled={dataAttr(disabled)}
      className={className}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {items.map(item => {
        const checked = item.value === selected;
        const itemDisabled = item.disabled || disabled;
        return (
          <button
            key={item.value}
            type="button"
            role="radio"
            // `aria-checked="false"` on purpose, unlike every `data-*` here: a
            // radio has to expose *unchecked* as a state, and omitting it makes
            // the option read as having no checked state at all.
            aria-checked={checked}
            // Roving: one tab stop for the whole control, so Tab moves past it
            // rather than through every option.
            tabIndex={item.value === rovingValue ? 0 : -1}
            disabled={itemDisabled}
            data-part="item"
            data-value={item.value}
            data-selected={dataAttr(checked)}
            data-disabled={dataAttr(itemDisabled)}
            onClick={() => select(item.value)}
          >
            {item.icon !== undefined && <span data-part="icon">{item.icon}</span>}
            <span data-part="label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
