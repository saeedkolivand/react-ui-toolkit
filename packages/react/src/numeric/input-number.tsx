"use client";

import {
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { clamp, dataAttr, decimals, numericKey, snap } from "@crosskit-ui/core";
import { useConfig } from "../config/config-provider";
import { Icon } from "../icon/icon";

export type InputNumberSize = "small" | "middle" | "large";

export interface InputNumberProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "defaultValue" | "size" | "prefix" | "step" | "min" | "max"
> {
  min?: number;
  max?: number;
  step?: number;
  value?: number | null;
  defaultValue?: number | null;
  /** `null` when the field is empty — distinct from `0`. */
  onChange?: (value: number | null) => void;
  size?: InputNumberSize;
  disabled?: boolean;
  status?: "error" | "warning";
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Hide the up/down controls; keyboard and typing still work. */
  controls?: boolean;
  /** Decimal places to display. Defaults to whatever `step` implies. */
  precision?: number;
  ref?: Ref<HTMLInputElement>;
}

export function InputNumber({
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  step = 1,
  value: controlled,
  defaultValue,
  onChange,
  size = "middle",
  disabled = false,
  status,
  prefix,
  suffix,
  controls = true,
  precision,
  className,
  ref,
  ...rest
}: InputNumberProps) {
  const { locale } = useConfig();
  const range = { min, max, step };
  const [uncontrolled, setUncontrolled] = useState<number | null>(defaultValue ?? null);
  const value = controlled === undefined ? uncontrolled : controlled;

  // What the field shows while it is being typed in, which is not the same as
  // the value: "1." and "-" are states a number cannot represent, and
  // reformatting on every keystroke moves the caret out from under the user.
  const [draft, setDraft] = useState<string | null>(null);

  const places = precision ?? decimals(step);
  const display =
    draft !== null
      ? draft
      : value === null
        ? ""
        : places > 0
          ? value.toFixed(places)
          : String(value);

  const commit = (next: number | null) => {
    if (controlled === undefined) setUncontrolled(next);
    if (next !== value) onChange?.(next);
  };

  const parse = (text: string): number | null => {
    const trimmed = text.trim();
    if (trimmed === "") return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const onInput = (text: string) => {
    setDraft(text);
    const parsed = parse(text);
    // Reported unclamped while typing: clamping mid-keystroke turns "5" into
    // the max the moment someone starts typing "50". The clamp happens on blur.
    if (parsed !== null || text.trim() === "") commit(parsed);
  };

  const settle = () => {
    const parsed = parse(draft ?? "");
    setDraft(null);
    if (draft === null) return;
    commit(parsed === null ? null : snap(clamp(parsed, min, max), range));
  };

  const bump = (count: number) => {
    if (disabled) return;
    const from = value ?? clamp(0, min, max);
    setDraft(null);
    commit(snap(from + count * step, range));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    // Arrows only, and not Home/End or Page — in a text field those belong to
    // the caret, and stealing them makes the field impossible to edit.
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    const next = numericKey(event, value ?? clamp(0, min, max), range);
    if (next === undefined) return;
    event.preventDefault();
    setDraft(null);
    commit(next);
  };

  return (
    <div
      data-scope="input-number"
      data-part="root"
      data-size={size}
      data-status={status}
      data-disabled={dataAttr(disabled)}
      className={className}
    >
      {prefix !== undefined && <span data-part="prefix">{prefix}</span>}
      <input
        ref={ref}
        type="text"
        inputMode="decimal"
        role="spinbutton"
        data-part="input"
        disabled={disabled}
        aria-valuenow={value ?? undefined}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-invalid={status === "error" ? true : undefined}
        value={display}
        onChange={event => onInput(event.target.value)}
        onFocus={() => setDraft(display)}
        onBlur={settle}
        onKeyDown={onKeyDown}
        {...rest}
      />
      {suffix !== undefined && <span data-part="suffix">{suffix}</span>}
      {controls && (
        <span data-part="controls">
          <button
            type="button"
            data-part="increment"
            tabIndex={-1}
            disabled={disabled || (value !== null && value >= max)}
            aria-label={locale.InputNumber.increase}
            onClick={() => bump(1)}
          >
            <Icon name="chevronUp" size="sm" />
          </button>
          <button
            type="button"
            data-part="decrement"
            tabIndex={-1}
            disabled={disabled || (value !== null && value <= min)}
            aria-label={locale.InputNumber.decrease}
            onClick={() => bump(-1)}
          >
            <Icon name="chevronDown" size="sm" />
          </button>
        </span>
      )}
    </div>
  );
}
