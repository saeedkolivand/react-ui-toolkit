"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type Ref } from "react";
import {
  addMonths,
  compareDates,
  contains,
  dataAttr,
  formatDate,
  parseLocaleDate,
  startOfMonth,
  toCalendarDate,
  toDate,
  type CalendarDate,
} from "@crosskit-ui/core";
import { AnchoredView } from "../anchored/anchored";
import { useAnchored } from "../anchored/use-anchored";
import { useConfig } from "../config/config-provider";
import { Icon } from "../icon/icon";
import { DatePanel } from "./calendar";
import type { DatePickerSize } from "./date-picker";

/** `[start, end]`, either of which may be null while one is being picked. */
export type DateRangeValue = [Date | null, Date | null];

export interface RangePickerProps {
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  /** Both dates, and both as the fields show them. */
  onChange?: (dates: DateRangeValue | null, dateStrings: [string, string]) => void;
  format?: Intl.DateTimeFormatOptions;
  placeholder?: [string, string];
  /** Gets the day and which end is being picked, so a minimum stay is expressible. */
  disabledDate?: (date: Date, info: { picking: "start" | "end"; start: Date | null }) => boolean;
  size?: DatePickerSize;
  status?: "error" | "warning";
  disabled?: boolean;
  allowClear?: boolean;
  separator?: string;
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

const MEDIUM: Intl.DateTimeFormatOptions = { dateStyle: "medium" };
const OPENS_PANEL = new Set(["ArrowDown", "PageUp", "PageDown"]);

const asCalendar = (date: Date | null | undefined) => (date ? toCalendarDate(date) : null);

export function RangePicker({
  value: controlled,
  defaultValue,
  onChange,
  format = MEDIUM,
  placeholder,
  disabledDate,
  size = "middle",
  status,
  disabled = false,
  allowClear = true,
  separator = "→",
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
}: RangePickerProps) {
  const { locale } = useConfig();
  const [uncontrolled, setUncontrolled] = useState<DateRangeValue | null>(defaultValue ?? null);
  const value = controlled === undefined ? uncontrolled : controlled;
  const start = asCalendar(value?.[0]);
  const end = asCalendar(value?.[1]);

  const [today] = useState(() => toCalendarDate(new Date()));
  // The LEFT month; the right one is always the one after it, so the two panels
  // cannot drift apart or show the same month twice.
  const [month, setMonth] = useState<CalendarDate>(() => startOfMonth(start ?? today));

  /**
   * Which end the next click sets.
   *
   * A range is picked in two gestures, so the panel has to remember which one
   * it is in the middle of — and it is not derivable from the value, because a
   * complete range being re-picked starts over at the start.
   */
  const [picking, setPicking] = useState<"start" | "end">("start");
  /** The day under the pointer, so the span between it and the anchor previews. */
  const [hovered, setHovered] = useState<CalendarDate | null>(null);
  /** The first click of a fresh pick, before it has become the value. */
  const [anchor, setAnchor] = useState<CalendarDate | null>(null);

  const [draft, setDraft] = useState<[string | null, string | null]>([null, null]);

  const text = (date: CalendarDate | null) => (date ? formatDate(date, locale.tag, format) : "");
  const display: [string, string] = [draft[0] ?? text(start), draft[1] ?? text(end)];

  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const setStartInput = (node: HTMLInputElement | null) => {
    startRef.current = node;
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
    scope: "range-picker",
    role: "dialog",
    // Focus stays in whichever field was clicked — the fields are typed into.
    takeFocus: false,
    onOpenChange: details => {
      onOpenChange?.(details);
      if (details.open) {
        // A fresh opening always starts a new range. Resuming mid-pick after
        // the panel was dismissed leaves the next click writing an end for a
        // start the user has forgotten choosing.
        setPicking("start");
        setAnchor(null);
        return;
      }
      setHovered(null);
      const content = anchoredRef.current?.contentNode;
      if (content && contains(content, document.activeElement)) {
        (picking === "end" ? endRef : startRef).current?.focus({ preventScroll: true });
      }
    },
  });

  const anchoredRef = useRef(anchored);
  useEffect(() => {
    anchoredRef.current = anchored;
  });

  useEffect(() => {
    if (!anchored.open || !handOverRef.current) return;
    const day = anchored.contentNode?.querySelector<HTMLElement>('[data-part="day"][tabindex="0"]');
    // Only once there is somewhere to put focus: `open` flips a render before
    // the content ref attaches, and clearing the flag on that first pass
    // consumed the request before the grid existed.
    if (!day) return;
    handOverRef.current = false;
    day.focus({ preventScroll: true });
  }, [anchored.open, anchored.contentNode]);

  const commit = (next: DateRangeValue | null) => {
    setDraft([null, null]);
    if (controlled === undefined) setUncontrolled(next);
    onChange?.(next, [
      next?.[0] ? formatDate(toCalendarDate(next[0]), locale.tag, format) : "",
      next?.[1] ? formatDate(toCalendarDate(next[1]), locale.tag, format) : "",
    ]);
  };

  const select = (date: CalendarDate) => {
    if (picking === "start") {
      setAnchor(date);
      setPicking("end");
      // Reported as a half-range rather than held back, so a consumer driving
      // this controlled sees the first click. `null` for the end is what makes
      // "one chosen, one not" expressible at all.
      commit([toDate(date), null]);
      endRef.current?.focus({ preventScroll: true });
      return;
    }
    const first = anchor ?? start;
    if (!first) {
      setAnchor(date);
      setPicking("end");
      commit([toDate(date), null]);
      return;
    }
    // Sorted, because picking backwards is an ordinary gesture and a range that
    // came back with its ends swapped would be nobody's idea of the answer.
    const [from, to] = compareDates(first, date) <= 0 ? [first, date] : [date, first];
    commit([toDate(from), toDate(to)]);
    setPicking("start");
    setAnchor(null);
    setHovered(null);
    anchored.setOpen(false);
  };

  /** The anchor plus whatever the pointer is over, for the preview highlight. */
  const previewed = picking === "end" ? (hovered ?? end) : end;
  const range = { start: anchor ?? start, end: picking === "end" ? previewed : end };

  const blocked = (date: Date) =>
    disabledDate?.(date, {
      picking,
      start: (anchor ?? start) ? toDate((anchor ?? start)!) : null,
    }) ?? false;

  const settle = (index: 0 | 1) => {
    const typed = draft[index];
    if (typed === null) return;
    const trimmed = typed.trim();
    const clear = (): void =>
      setDraft(previous => {
        const next: [string | null, string | null] = [...previous];
        next[index] = null;
        return next;
      });
    if (trimmed === "") {
      const next: DateRangeValue = [value?.[0] ?? null, value?.[1] ?? null];
      next[index] = null;
      commit(next[0] === null && next[1] === null ? null : next);
      return;
    }
    const parsed = parseLocaleDate(trimmed, locale.tag);
    // An unparseable or blocked entry reverts: someone who mistyped wants to
    // see what they had, not an empty field.
    if (!parsed || blocked(toDate(parsed))) {
      clear();
      return;
    }
    const next: DateRangeValue = [value?.[0] ?? null, value?.[1] ?? null];
    next[index] = toDate(parsed);
    if (next[0] && next[1] && next[0] > next[1]) next.reverse();
    commit(next);
    setMonth(startOfMonth(parsed));
  };

  const onKeyDown = (index: 0 | 1) => (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (OPENS_PANEL.has(event.key)) {
      event.preventDefault();
      handOverRef.current = true;
      if (!anchored.open) anchored.setOpen(true);
      else {
        anchored.contentNode
          ?.querySelector<HTMLElement>('[data-part="day"][tabindex="0"]')
          ?.focus({ preventScroll: true });
        handOverRef.current = false;
      }
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      settle(index);
    }
  };

  const showClear = allowClear && !disabled && (start !== null || end !== null);
  const placeholders: [string, string] = placeholder ?? [
    locale.DatePicker.start,
    locale.DatePicker.end,
  ];

  const field = (index: 0 | 1) => (
    <input
      ref={index === 0 ? setStartInput : endRef}
      type="text"
      data-scope="range-picker"
      data-part={index === 0 ? "start-input" : "end-input"}
      data-size={size}
      data-status={status}
      data-disabled={dataAttr(disabled)}
      id={index === 0 ? id : undefined}
      name={name ? `${name}-${index === 0 ? "start" : "end"}` : undefined}
      disabled={disabled}
      placeholder={placeholders[index]}
      value={display[index]}
      aria-label={index === 0 ? ariaLabel : undefined}
      aria-describedby={describedBy}
      aria-invalid={status === "error" || ariaInvalid ? true : undefined}
      onChange={event =>
        setDraft(previous => {
          const next: [string | null, string | null] = [...previous];
          next[index] = event.target.value;
          return next;
        })
      }
      onFocus={() => setPicking(index === 0 ? "start" : "end")}
      onKeyDown={onKeyDown(index)}
      onBlur={() => {
        settle(index);
        onBlur?.();
      }}
    />
  );

  return (
    <AnchoredView
      anchored={anchored}
      arrow={false}
      className={className}
      triggerPart="control"
      body={
        <div data-scope="range-picker" data-part="panels">
          {/* Two months, the second always the one after the first, so a range
              spanning a month boundary is picked without paging. */}
          <DatePanel
            month={month}
            today={today}
            range={range}
            onMonthChange={setMonth}
            onSelect={select}
            onDayHover={setHovered}
            disabledDate={blocked}
          />
          <DatePanel
            month={addMonths(month, 1)}
            today={today}
            range={range}
            onMonthChange={next => setMonth(addMonths(next, -1))}
            onSelect={select}
            onDayHover={setHovered}
            disabledDate={blocked}
          />
        </div>
      }
    >
      {field(0)}
      <span data-scope="range-picker" data-part="separator" aria-hidden="true">
        {separator}
      </span>
      {field(1)}
      {showClear ? (
        <button
          type="button"
          data-scope="range-picker"
          data-part="clear"
          aria-label={locale.DatePicker.clear}
          onClick={event => {
            // The trigger wrapper listens for clicks, so without this the clear
            // opens the panel on its way out.
            event.stopPropagation();
            commit(null);
            setPicking("start");
            setAnchor(null);
            startRef.current?.focus({ preventScroll: true });
          }}
        >
          <Icon name="close" size="sm" />
        </button>
      ) : (
        <Icon name="calendar" size="sm" data-scope="range-picker" data-part="suffix" />
      )}
    </AnchoredView>
  );
}
