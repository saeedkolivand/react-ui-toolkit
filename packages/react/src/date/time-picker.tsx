"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type Ref } from "react";
import {
  clampTime,
  compareTimes,
  contains,
  dataAttr,
  formatTime,
  from12Hour,
  getDayPeriods,
  parseTime,
  prefers12Hour,
  stepValues,
  timeToDate,
  to12Hour,
  toCalendarTime,
  type CalendarTime,
} from "@crosskit-ui/core";
import { AnchoredView } from "../anchored/anchored";
import { useAnchored } from "../anchored/use-anchored";
import { useConfig } from "../config/config-provider";
import { Icon } from "../icon/icon";
import type { DatePickerSize } from "./date-picker";

export interface TimePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  /** The `Date`, and the text as the field shows it. */
  onChange?: (time: Date | null, timeString: string) => void;
  /** Passed to `Intl.DateTimeFormat`. Defaults to what the locale writes. */
  format?: Intl.DateTimeFormatOptions;
  placeholder?: string;
  /** Defaults to whatever the locale does — which varies inside one language. */
  use12Hours?: boolean;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  showSecond?: boolean;
  /** Inclusive bounds. A value outside them is pulled in on commit. */
  minTime?: Date;
  maxTime?: Date;
  size?: DatePickerSize;
  status?: "error" | "warning";
  disabled?: boolean;
  allowClear?: boolean;
  inputReadOnly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  onBlur?: () => void;
  ref?: Ref<HTMLInputElement>;
}

/** Midnight, which is where a picker opened with no value starts. */
const ZERO: CalendarTime = { hour: 0, minute: 0, second: 0 };

export function TimePicker({
  value: controlled,
  defaultValue,
  onChange,
  format,
  placeholder,
  use12Hours,
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  showSecond = false,
  minTime,
  maxTime,
  size = "middle",
  status,
  disabled = false,
  allowClear = true,
  inputReadOnly = false,
  open,
  defaultOpen,
  onOpenChange,
  className,
  id,
  name,
  onBlur,
  ref,
  "aria-label": ariaLabel,
  "aria-describedby": describedBy,
  "aria-invalid": ariaInvalid,
}: TimePickerProps) {
  const { locale } = useConfig();
  const [uncontrolled, setUncontrolled] = useState<Date | null>(defaultValue ?? null);
  const selected = controlled === undefined ? uncontrolled : controlled;
  const value = selected ? toCalendarTime(selected) : null;

  const twelve = use12Hours ?? prefers12Hour(locale.tag);
  const periods = getDayPeriods(locale.tag);
  const shape: Intl.DateTimeFormatOptions =
    format ??
    ({
      hour: "2-digit",
      minute: "2-digit",
      ...(showSecond ? { second: "2-digit" } : {}),
      hour12: twelve,
    } as Intl.DateTimeFormatOptions);

  const min = minTime ? toCalendarTime(minTime) : undefined;
  const max = maxTime ? toCalendarTime(maxTime) : undefined;

  const [draft, setDraft] = useState<string | null>(null);
  const text = value ? formatTime(value, locale.tag, shape) : "";
  const display = draft ?? text;

  const inputRef = useRef<HTMLInputElement>(null);
  const setInput = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  const handOverRef = useRef(false);

  const anchored = useAnchored({
    open,
    defaultOpen,
    placement: "bottomLeft",
    trigger: "click",
    disabled,
    arrow: false,
    scope: "time-picker",
    role: "dialog",
    // The field is typed into, so focus stays in it and ArrowDown is what hands
    // the columns the keyboard — the same bargain DatePicker makes.
    takeFocus: false,
    onOpenChange: details => {
      onOpenChange?.(details);
      if (details.open) return;
      const content = anchoredRef.current?.contentNode;
      if (content && contains(content, document.activeElement)) {
        inputRef.current?.focus({ preventScroll: true });
      }
    },
  });

  const anchoredRef = useRef(anchored);
  useEffect(() => {
    anchoredRef.current = anchored;
  });

  useEffect(() => {
    if (!anchored.open || !handOverRef.current) return;
    const content = anchored.contentNode;
    // Two queries, not one comma-separated selector: `querySelector` returns the
    // first match in DOCUMENT order across the whole list, so the alternation
    // handed back hour 00 rather than the chosen one every time.
    const cell =
      content?.querySelector<HTMLElement>('[data-part="option"][aria-selected="true"]') ??
      content?.querySelector<HTMLElement>('[data-part="option"]');
    // Only once there is somewhere to put focus. `open` flips a render before
    // the content ref attaches, so clearing the flag on that first pass
    // consumes the request before the columns exist.
    if (!cell) return;
    handOverRef.current = false;
    cell.focus();
  }, [anchored.open, anchored.contentNode]);

  useEffect(() => {
    if (!anchored.open) return;
    const content = anchored.contentNode;
    if (!content) return;
    // Each column opens scrolled to the top, so a value anywhere past the first
    // few entries is off-screen until the user hunts for it. `nearest` scrolls
    // the least that works, which keeps it from moving the page as well.
    for (const chosen of content.querySelectorAll<HTMLElement>(
      '[data-part="option"][data-selected]'
    )) {
      chosen.scrollIntoView({ block: "nearest" });
    }
  }, [anchored.open, anchored.contentNode]);

  const commit = (next: CalendarTime | null) => {
    setDraft(null);
    const bounded = next ? clampTime(next, min, max) : null;
    // Composed onto the day the current value sits on, so a picker driving one
    // half of a date-and-time pair does not move the other half. Read here
    // rather than tracked in a ref: a ref written during render is what the
    // compiler refuses, and the only case the two answers differ is a value
    // that was cleared first — where "today" is as defensible as the day the
    // cleared value happened to carry.
    const date = bounded ? timeToDate(bounded, selected ?? new Date()) : null;
    if (controlled === undefined) setUncontrolled(date);
    onChange?.(date, bounded ? formatTime(bounded, locale.tag, shape) : "");
  };

  /** The time the columns show: the value, or midnight while nothing is chosen. */
  const shown = value ?? ZERO;

  const settle = () => {
    if (draft === null) return;
    const trimmed = draft.trim();
    if (trimmed === "") {
      commit(null);
      return;
    }
    const parsed = parseTime(trimmed, locale.tag);
    // An unreadable entry reverts rather than clearing: someone who mistyped
    // wants to see what they had, not an empty field.
    if (!parsed) {
      setDraft(null);
      return;
    }
    commit(parsed);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown") {
      // Down does nothing in a single-line field, so it is free to take. Left
      // and right stay with the caret.
      event.preventDefault();
      handOverRef.current = true;
      if (!anchored.open) anchored.setOpen(true);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      settle();
      anchored.setOpen(false);
    }
  };

  /**
   * Arrows move the stop inside a column.
   *
   * Focus moves rather than the value changing, for the same reason the
   * calendar separates its cursor from its selection: committing on every
   * arrow would fire `onChange` for every minute crossed on the way to the one
   * the user wants.
   */
  const onColumnKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const step = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const column = event.currentTarget;
    const options = [...column.querySelectorAll<HTMLElement>('[data-part="option"]')];
    const here = options.indexOf(document.activeElement as HTMLElement);
    // Clamped rather than wrapped: a column of hours has a first and a last, and
    // arriving at midnight by pressing Down past 23 is nobody's intent.
    const next = Math.min(Math.max(here + step, 0), options.length - 1);
    // No `preventScroll`: the columns are bounded with their own scroller, so
    // suppressing it moves focus to an entry nobody can see — the browser's own
    // Tab scrolls here, and the arrows have to match it. `preventScroll` is
    // right on DatePicker, whose grid never scrolls.
    options[next]?.focus();
  };

  const blocked = (time: CalendarTime) =>
    (min !== undefined && compareTimes(time, min) < 0) ||
    (max !== undefined && compareTimes(time, max) > 0);

  /**
   * One column, told how to turn its own numbers into a time.
   *
   * The mapping is a parameter rather than `{ ...shown, [part]: amount }`,
   * because a twelve-hour column carries DISPLAY hours: clicking "12" in the
   * afternoon means 12:00 and clicking it in the morning means 00:00, and
   * writing the label straight into `hour` sets noon either way — and blocks
   * the wrong entries against `minTime`/`maxTime` while it is at it.
   */
  const column = (
    part: string,
    values: number[],
    label: (amount: number) => string,
    current: number,
    toTime: (amount: number) => CalendarTime
  ) => {
    /**
     * Which option carries the column's single tab stop.
     *
     * Not simply the current value: a step leaves gaps, and a value that lands
     * in one — 09:41 against a 15-minute column, which the panel's own Now
     * button produces — matches nothing, so every option gets -1 and Tab walks
     * straight past the column. The nearest entry at or below it keeps the stop
     * somewhere a user would expect to arrive.
     */
    const stop = values.includes(current)
      ? current
      : (values.filter(amount => amount <= current).pop() ?? values[0]);

    return (
      <div
        key={part}
        data-scope="time-picker"
        data-part="column"
        role="listbox"
        aria-label={part}
        onKeyDown={onColumnKeyDown}
      >
        {values.map(amount => {
          const candidate = toTime(amount);
          const off = blocked(candidate);
          return (
            <button
              key={amount}
              type="button"
              data-scope="time-picker"
              data-part="option"
              data-selected={dataAttr(amount === current)}
              data-disabled={dataAttr(off)}
              role="option"
              // `aria-selected` is a real tri-state on an option: absent means
              // "not selectable", which is a different statement from "selectable
              // and not selected". So this is the one place `"false"` is right.
              aria-selected={amount === current ? "true" : "false"}
              aria-disabled={off ? true : undefined}
              // One tab stop per column, which is the listbox pattern. Leaving
              // every option tabbable makes an hour-minute-second panel 144 stops
              // to walk past — and a keyboard user reaching the OK button would
              // have to.
              tabIndex={amount === stop ? 0 : -1}
              onClick={() => {
                if (off) return;
                commit(candidate);
              }}
            >
              {label(amount)}
            </button>
          );
        })}
      </div>
    );
  };

  const pad = (amount: number) => String(amount).padStart(2, "0");
  const displayHour = twelve ? to12Hour(shown.hour).hour : shown.hour;
  const hourValues = twelve
    ? // A twelve-hour column runs 12, 1, 2 … 11, because a clock face has no
      // zero on it and the hour that reads "12" sorts first in both halves.
      [12, ...stepValues(12, hourStep).slice(1)]
    : stepValues(24, hourStep);

  const showClear = allowClear && !disabled && value !== null;

  return (
    <AnchoredView
      anchored={anchored}
      arrow={false}
      className={className}
      triggerPart="control"
      body={
        <>
          <div data-scope="time-picker" data-part="columns">
            {column("hour", hourValues, pad, twelve ? displayHour : shown.hour, amount => ({
              ...shown,
              hour: twelve ? from12Hour(amount, to12Hour(shown.hour).pm) : amount,
            }))}
            {column("minute", stepValues(60, minuteStep), pad, shown.minute, amount => ({
              ...shown,
              minute: amount,
            }))}
            {showSecond &&
              column("second", stepValues(60, secondStep), pad, shown.second, amount => ({
                ...shown,
                second: amount,
              }))}
            {/* Through the same helper as the numeric columns, so it gets one
                tab stop and the arrow handling with them. Built inline it had
                two stops and no arrows — and it is the DEFAULT column for
                en-US, so that was the common case rather than an edge one.

                The values are the two indices; the mapping from an index to a
                time is what `column` takes a function for. */}
            {twelve &&
              column(
                "period",
                [0, 1],
                index => periods[index]!,
                to12Hour(shown.hour).pm ? 1 : 0,
                index => ({
                  ...shown,
                  hour: from12Hour(to12Hour(shown.hour).hour, index === 1),
                })
              )}
          </div>
          <div data-scope="time-picker" data-part="footer">
            <button
              type="button"
              data-scope="time-picker"
              data-part="now"
              onClick={() => {
                commit(toCalendarTime(new Date()));
                anchored.setOpen(false);
                inputRef.current?.focus({ preventScroll: true });
              }}
            >
              {locale.DatePicker.now}
            </button>
            <button
              type="button"
              data-scope="time-picker"
              data-part="ok"
              onClick={() => {
                anchored.setOpen(false);
                inputRef.current?.focus({ preventScroll: true });
              }}
            >
              {locale.DatePicker.ok}
            </button>
          </div>
        </>
      }
    >
      <input
        ref={setInput}
        type="text"
        data-scope="time-picker"
        data-part="input"
        data-size={size}
        data-status={status}
        data-disabled={dataAttr(disabled)}
        id={id}
        name={name}
        disabled={disabled}
        readOnly={inputReadOnly}
        placeholder={placeholder ?? locale.DatePicker.selectTime}
        value={display}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={status === "error" || ariaInvalid ? true : undefined}
        onChange={event => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => {
          settle();
          onBlur?.();
        }}
      />
      {showClear ? (
        <button
          type="button"
          data-scope="time-picker"
          data-part="clear"
          aria-label={locale.DatePicker.clear}
          onClick={event => {
            // The trigger wrapper listens for clicks, so without this the clear
            // opens the panel on its way out.
            event.stopPropagation();
            commit(null);
            inputRef.current?.focus({ preventScroll: true });
          }}
        >
          <Icon name="close" size="sm" />
        </button>
      ) : (
        <Icon name="clock" size="sm" data-scope="time-picker" data-part="suffix" />
      )}
    </AnchoredView>
  );
}
