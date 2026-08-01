"use client";

/**
 * The month panel, and the standalone `Calendar` around it.
 *
 * All the arithmetic is in `core`'s date engine — grid generation, month and
 * year stepping, the daylight-saving-safe day difference — and all the naming
 * comes from `Intl`, so there is no locale pack behind any of this and nothing
 * here has a month-length table in it.
 *
 * The public value type is `Date`, because that is what a consumer has. The
 * `CalendarDate` triple is internal: it is what makes the arithmetic exact, and
 * it is the wrong thing to hand someone who wants to put a date in a request.
 */

import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import {
  addDays,
  addMonths,
  addYears,
  compareDates,
  dataAttr,
  endOfMonth,
  formatDate,
  getMonthGrid,
  getWeekStart,
  getWeekdayNames,
  isSameDay,
  startOfMonth,
  toCalendarDate,
  toDate,
  type CalendarDate,
} from "@crosskit-ui/core";
import { useConfig } from "../config/config-provider";
import { Icon } from "../icon/icon";

/** A predicate over a day, in the `Date` the consumer thinks in. */
export type DisabledDate = (date: Date) => boolean;

export interface DatePanelProps {
  /** The selected day, or null. */
  value?: CalendarDate | null;
  /** The month on screen. Controlled by whoever owns the panel. */
  month: CalendarDate;
  onMonthChange: (month: CalendarDate) => void;
  onSelect: (date: CalendarDate) => void;
  disabledDate?: DisabledDate;
  /** Today, injected so a panel can be rendered at a fixed date in a test. */
  today?: CalendarDate;
  /** Highlights a second date and the span between them. */
  rangeEnd?: CalendarDate | null;
  /** Replaces a cell's contents. Gets the day and the default node. */
  cellRender?: (date: Date, node: ReactNode) => ReactNode;
  /** Six rows always, so the panel does not resize between months. */
  fixedWeeks?: boolean;
  id?: string;
}

/**
 * Keys the grid owns, and what each moves by.
 *
 * Day and week arithmetic rather than cell indices, so a move off the end of a
 * row lands on the next row's first day and a move off the end of the month
 * turns the page — which is what the grid looks like it should do and what
 * index maths gets wrong at every edge.
 */
const STEP: Record<string, (date: CalendarDate, rtl: boolean) => CalendarDate> = {
  ArrowLeft: (date, rtl) => addDays(date, rtl ? 1 : -1),
  ArrowRight: (date, rtl) => addDays(date, rtl ? -1 : 1),
  ArrowUp: date => addDays(date, -7),
  ArrowDown: date => addDays(date, 7),
  PageUp: date => addMonths(date, -1),
  PageDown: date => addMonths(date, 1),
  Home: date => startOfMonth(date),
  End: date => endOfMonth(date),
};

export function DatePanel({
  value,
  month,
  onMonthChange,
  onSelect,
  disabledDate,
  today,
  rangeEnd,
  cellRender,
  fixedWeeks = true,
  id,
}: DatePanelProps) {
  const { locale, direction } = useConfig();
  const weekStartsOn = getWeekStart(locale.tag);
  const weekdays = getWeekdayNames(locale.tag, "short", weekStartsOn);
  const longWeekdays = getWeekdayNames(locale.tag, "long", weekStartsOn);

  /**
   * The day the grid's single tab stop is on.
   *
   * Separate from the selection, and defaulting to it: a grid with one tab stop
   * needs somewhere to put it before anything is selected, and moving with the
   * arrows has to move the stop without selecting — a date picker that commits
   * on every arrow press fires `onChange` six times crossing a week.
   */
  const [focused, setFocused] = useState<CalendarDate | null>(null);
  const active = focused ?? value ?? today ?? startOfMonth(month);

  /**
   * The roving tab stop has to take focus with it.
   *
   * Moving `tabIndex` alone changes which cell Tab would reach and leaves the
   * user's focus on the one they started from — so the ring never moves, and
   * every following key still arrives at the old cell. Worse, once an arrow
   * turns the page that cell is unmounted, focus falls to `<body>`, and the
   * grid stops answering the keyboard at all.
   *
   * Only when focus is already inside the grid: otherwise a parent re-render
   * would pull the caret out of whatever the user was actually in.
   */
  const gridRef = useRef<HTMLTableElement>(null);
  const wantsFocusRef = useRef(false);
  useEffect(() => {
    if (!wantsFocusRef.current) return;
    wantsFocusRef.current = false;
    gridRef.current
      ?.querySelector<HTMLElement>('[data-part="day"][tabindex="0"]')
      ?.focus({ preventScroll: true });
  }, [focused]);

  const grid = getMonthGrid(month.year, month.month, { weekStartsOn, today, fixedWeeks });
  const disabled = (date: CalendarDate) => disabledDate?.(toDate(date)) ?? false;

  const move = (next: CalendarDate) => {
    // Raised from the key handler rather than checked in the effect. Asking
    // "is focus still in the grid" there is too late once the move turned the
    // page: the cell that had focus is unmounted by then, `activeElement` is
    // `<body>`, and the grid stops answering the keyboard entirely — which is
    // the exact case the whole roving stop exists for.
    wantsFocusRef.current = true;
    setFocused(next);
    // The page follows the cursor, or the arrows walk off the visible grid and
    // the focused cell is one nobody can see.
    if (next.year !== month.year || next.month !== month.month) onMonthChange(startOfMonth(next));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      if (disabled(active)) return;
      event.preventDefault();
      onSelect(active);
      return;
    }
    const step = STEP[event.key];
    if (!step) return;
    event.preventDefault();
    move(step(active, direction === "rtl"));
  };

  const title = formatDate(month, locale.tag, { year: "numeric", month: "long" });

  return (
    <div data-scope="calendar" data-part="root" id={id}>
      <div data-scope="calendar" data-part="header">
        <button
          type="button"
          data-scope="calendar"
          data-part="prev-year"
          aria-label={`${title} — previous year`}
          onClick={() => onMonthChange(addYears(month, -1))}
        >
          {/* Physical chevrons under a logical name: the stylesheet flips the
              pair with a `scale(-1 1)` in RTL rather than each call site
              choosing an icon, so there is one place to be wrong. */}
          <Icon name="rewind" size="sm" />
        </button>
        <button
          type="button"
          data-scope="calendar"
          data-part="prev-month"
          aria-label={`${title} — previous month`}
          onClick={() => onMonthChange(addMonths(month, -1))}
        >
          <Icon name="chevronLeft" size="sm" />
        </button>
        <div data-scope="calendar" data-part="title" aria-live="polite">
          {title}
        </div>
        <button
          type="button"
          data-scope="calendar"
          data-part="next-month"
          aria-label={`${title} — next month`}
          onClick={() => onMonthChange(addMonths(month, 1))}
        >
          <Icon name="chevronRight" size="sm" />
        </button>
        <button
          type="button"
          data-scope="calendar"
          data-part="next-year"
          aria-label={`${title} — next year`}
          onClick={() => onMonthChange(addYears(month, 1))}
        >
          <Icon name="fastForward" size="sm" />
        </button>
      </div>

      {/* A real table with `role="grid"`, which is the pattern a screen reader
          announces as a date grid — row and column position included, which a
          div soup cannot express however many `aria-*` are bolted on. */}
      <table ref={gridRef} data-scope="calendar" data-part="grid" role="grid" aria-label={title}>
        <thead>
          <tr data-scope="calendar" data-part="weekdays">
            {weekdays.map((name, index) => (
              <th
                key={name}
                data-scope="calendar"
                data-part="weekday"
                scope="col"
                // The short name is often two letters and reads as nonsense
                // aloud; `abbr` is what a screen reader announces instead.
                abbr={longWeekdays[index]}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map(week => (
            <tr key={`${week[0]!.date.year}-${week[0]!.date.month}-${week[0]!.date.day}`}>
              {week.map(day => {
                const selected =
                  value !== null && value !== undefined && isSameDay(day.date, value);
                const isEnd = rangeEnd != null && isSameDay(day.date, rangeEnd);
                const within =
                  value != null &&
                  rangeEnd != null &&
                  compareDates(day.date, value) > 0 &&
                  compareDates(day.date, rangeEnd) < 0;
                const off = disabled(day.date);
                const isActive = isSameDay(day.date, active);
                const label = formatDate(day.date, locale.tag, { dateStyle: "full" });

                return (
                  <td key={day.date.day} data-scope="calendar" data-part="cell">
                    <button
                      type="button"
                      data-scope="calendar"
                      data-part="day"
                      // Presence attributes throughout. A raw boolean renders
                      // `data-today="false"`, and `"false"` matches
                      // `[data-today]` — every day in the month would look like
                      // today.
                      data-today={dataAttr(day.isToday)}
                      data-selected={dataAttr(selected || isEnd)}
                      data-in-range={dataAttr(within)}
                      data-outside={dataAttr(!day.inMonth)}
                      data-weekend={dataAttr(day.isWeekend)}
                      data-disabled={dataAttr(off)}
                      // `aria-disabled`, not the `disabled` attribute. A
                      // disabled button cannot take focus, so the roving tab
                      // stop could never land on one — and the arrow that put
                      // the cursor there would leave focus on the previous
                      // cell, where the next Enter would select the wrong day.
                      // Skipping disabled days instead makes everything past a
                      // long block unreachable. So the cell stays focusable and
                      // refuses to activate.
                      aria-disabled={off ? true : undefined}
                      // One tab stop for the whole grid, which is what the grid
                      // pattern asks for: 42 stops is a month nobody tabs past.
                      tabIndex={isActive ? 0 : -1}
                      aria-selected={selected || isEnd ? true : undefined}
                      aria-label={label}
                      onKeyDown={onKeyDown}
                      onFocus={() => setFocused(day.date)}
                      onClick={() => {
                        if (off) return;
                        onSelect(day.date);
                      }}
                    >
                      {cellRender ? cellRender(toDate(day.date), day.date.day) : day.date.day}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CalendarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  // `defaultValue` as well as the two handlers: the DOM one is a string, and a
  // calendar's is a Date. Left in, the interface does not extend at all — and
  // the error names `defaultValue`, not the thing anyone would look at first.
  "onChange" | "onSelect" | "defaultValue"
> {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date) => void;
  /** Fires when the month on screen changes, however it changed. */
  onPanelChange?: (month: Date) => void;
  disabledDate?: DisabledDate;
  cellRender?: (date: Date, node: ReactNode) => ReactNode;
  /** The large, page-filling variant. */
  fullscreen?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function Calendar({
  value: controlled,
  defaultValue,
  onChange,
  onPanelChange,
  disabledDate,
  cellRender,
  fullscreen = false,
  className,
  ref,
  ...rest
}: CalendarProps) {
  const [uncontrolled, setUncontrolled] = useState<Date | null>(defaultValue ?? null);
  const selected = controlled === undefined ? uncontrolled : controlled;
  const value = selected ? toCalendarDate(selected) : null;

  // Today is read once, at mount. Reading it on every render makes a calendar
  // left open across midnight disagree with itself between two renders of the
  // same paint, and makes every test that renders one time-dependent.
  const [today] = useState(() => toCalendarDate(new Date()));
  const [month, setMonth] = useState<CalendarDate>(() => startOfMonth(value ?? today));

  const changeMonth = (next: CalendarDate) => {
    setMonth(next);
    onPanelChange?.(toDate(next));
  };

  return (
    <div
      ref={ref}
      data-scope="calendar"
      data-part="wrapper"
      data-fullscreen={dataAttr(fullscreen)}
      className={className}
      {...rest}
    >
      <DatePanel
        value={value}
        month={month}
        today={today}
        onMonthChange={changeMonth}
        onSelect={date => {
          if (controlled === undefined) setUncontrolled(toDate(date));
          onChange?.(toDate(date));
          // Clicking a padding day is how a user turns the page with the mouse,
          // so the panel follows the selection out of the month it was showing.
          if (date.month !== month.month || date.year !== month.year) {
            changeMonth(startOfMonth(date));
          }
        }}
        disabledDate={disabledDate}
        cellRender={cellRender}
      />
    </div>
  );
}
