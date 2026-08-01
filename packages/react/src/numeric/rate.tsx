"use client";

import {
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { clamp, dataAttr, numericKey } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";

export interface RateProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  count?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Fires as the pointer moves across the symbols. */
  onHoverChange?: (value: number | undefined) => void;
  /** Allow half a symbol. */
  allowHalf?: boolean;
  /** Clicking the current value clears it back to zero. */
  allowClear?: boolean;
  disabled?: boolean;
  /** The symbol, or a function of the one-based index. */
  character?: ReactNode | ((index: number) => ReactNode);
  /** Per-symbol accessible names, e.g. ["Terrible", …]. */
  tooltips?: string[];
  ref?: Ref<HTMLDivElement>;
}

export function Rate({
  count = 5,
  value: controlled,
  defaultValue = 0,
  onChange,
  onHoverChange,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  character,
  tooltips,
  className,
  ref,
  ...rest
}: RateProps) {
  const step = allowHalf ? 0.5 : 1;
  const range = { min: 0, max: count, step };
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const value = clamp(controlled ?? uncontrolled, 0, count);

  // What the symbols draw: the hover preview when there is one, the value
  // otherwise. Separate from `value`, so leaving with the pointer restores what
  // is actually set rather than committing whatever was last under it.
  const shown = hovered ?? value;

  const commit = (next: number) => {
    if (disabled) return;
    // Clicking the current value clears it — the only way to get back to zero
    // with a pointer, since there is no symbol to the left of the first.
    const target = allowClear && next === value ? 0 : next;
    if (controlled === undefined) setUncontrolled(target);
    if (target !== value) onChange?.(target);
  };

  const hover = (next: number | undefined) => {
    if (disabled) return;
    setHovered(next);
    onHoverChange?.(next);
  };

  /** Which half of a symbol the pointer is on, when halves are allowed. */
  const valueFor = (index: number, event: MouseEvent<HTMLElement>) => {
    if (!allowHalf) return index + 1;
    const box = event.currentTarget.getBoundingClientRect();
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const across = rtl ? box.right - event.clientX : event.clientX - box.left;
    return across < box.width / 2 ? index + 0.5 : index + 1;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    // `pageSize: 1`, so PageUp and a plain arrow move the same distance. A rate
    // of five has nothing for a ten-step jump to do.
    const next = numericKey(event, value, range, { rtl, pageSize: 1 });
    if (next === undefined) return;
    event.preventDefault();
    if (controlled === undefined) setUncontrolled(next);
    if (next !== value) onChange?.(next);
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-valuemin={0}
      aria-valuemax={count}
      aria-valuenow={value}
      // The number alone reads as "3"; the tooltip is what makes it "3, Good".
      aria-valuetext={tooltips?.[Math.ceil(value) - 1]}
      aria-disabled={disabled ? "true" : undefined}
      data-scope="rate"
      data-part="root"
      data-disabled={dataAttr(disabled)}
      className={className}
      onKeyDown={onKeyDown}
      onMouseLeave={() => hover(undefined)}
      {...rest}
    >
      {Array.from({ length: count }, (_, index) => {
        // Full when the shown value covers the whole symbol, half when it
        // covers the first half of it.
        const full = shown >= index + 1;
        const half = !full && shown >= index + 0.5;
        return (
          <span
            key={index}
            data-part="star"
            data-full={dataAttr(full)}
            data-half={dataAttr(half)}
            title={tooltips?.[index]}
            onClick={event => commit(valueFor(index, event))}
            onMouseMove={event => hover(valueFor(index, event))}
          >
            {/* Two layers, not one: the filled copy is clipped to half its
                width for a half symbol, which needs something underneath to
                show through. */}
            <span data-part="star-base" aria-hidden="true">
              {typeof character === "function"
                ? character(index + 1)
                : (character ?? <Icon name="star" />)}
            </span>
            <span data-part="star-fill" aria-hidden="true">
              {typeof character === "function"
                ? character(index + 1)
                : (character ?? <Icon name="star" />)}
            </span>
          </span>
        );
      })}
    </div>
  );
}
