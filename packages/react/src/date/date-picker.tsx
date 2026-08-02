"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type Ref } from "react";
import {
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
import { DatePanel, type DisabledDate } from "./calendar";

export type DatePickerSize = "small" | "middle" | "large";

export interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  /** The `Date`, and the text as the field shows it. */
  onChange?: (date: Date | null, dateString: string) => void;
  /** Passed to `Intl.DateTimeFormat`. Defaults to the locale's medium form. */
  format?: Intl.DateTimeFormatOptions;
  placeholder?: string;
  disabledDate?: DisabledDate;
  size?: DatePickerSize;
  status?: "error" | "warning";
  disabled?: boolean;
  /** Show the button that jumps to, and selects, today. */
  showToday?: boolean;
  allowClear?: boolean;
  /** Stop the field being typed into; the panel is then the only way in. */
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

const MEDIUM: Intl.DateTimeFormatOptions = { dateStyle: "medium" };

/** The one key that opens the panel and hands the grid the keyboard. */
const OPENS_PANEL = new Set(["ArrowDown", "PageUp", "PageDown"]);

export function DatePicker({
  value: controlled,
  defaultValue,
  onChange,
  format = MEDIUM,
  placeholder,
  disabledDate,
  size = "middle",
  status,
  disabled = false,
  showToday = true,
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
}: DatePickerProps) {
  const { locale } = useConfig();
  const [uncontrolled, setUncontrolled] = useState<Date | null>(defaultValue ?? null);
  const selected = controlled === undefined ? uncontrolled : controlled;
  const value = selected ? toCalendarDate(selected) : null;

  // Read once, at mount. Reading it every render makes a picker left open
  // across midnight disagree with itself between two renders of one paint.
  const [today] = useState(() => toCalendarDate(new Date()));
  const [month, setMonth] = useState<CalendarDate>(() => startOfMonth(value ?? today));

  /**
   * What the field shows while it is being typed in.
   *
   * Not the same as the value: "3/" and "12/3" are states no date can
   * represent, and reformatting on every keystroke moves the caret out from
   * under the user. Cleared on commit, at which point the formatted value shows
   * through again.
   */
  const [draft, setDraft] = useState<string | null>(null);
  const text = value ? formatDate(value, locale.tag, format) : "";
  const display = draft ?? text;

  const inputRef = useRef<HTMLInputElement>(null);
  const setInput = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  /** Raised when a key asked for the grid, so the effect below knows to hand it over. */
  const handOverRef = useRef(false);

  const anchored = useAnchored({
    open,
    defaultOpen,
    placement: "bottomLeft",
    trigger: "click",
    disabled,
    arrow: false,
    scope: "date-picker",
    role: "dialog",
    // Deliberately NOT `takeFocus`. The field is typed into, and moving the
    // caret out of it the moment the panel opens makes it unusable — so focus
    // stays put and ArrowDown is what hands the grid the keyboard, which is
    // also what restores it here on the way back.
    takeFocus: false,
    onOpenChange: details => {
      onOpenChange?.(details);
      if (details.open) return;
      // Escape and a press outside both close through the dismissable layer, and
      // if the grid held focus at that moment it is about to be unmounted with
      // focus on it — which leaves `<body>` focused and the next Tab restarting
      // at the top of the page.
      const content = anchoredRef.current?.contentNode;
      if (content && contains(content, document.activeElement)) {
        inputRef.current?.focus({ preventScroll: true });
      }
    },
  });

  // The hook's own return value, readable from the callback above — which is
  // created before `anchored` exists and cannot close over it.
  const anchoredRef = useRef(anchored);
  useEffect(() => {
    anchoredRef.current = anchored;
  });

  useEffect(() => {
    if (!anchored.open || !handOverRef.current) return;
    // The grid's single tab stop, which is where its own arrow handling starts.
    const day = anchored.contentNode?.querySelector<HTMLElement>('[data-part="day"][tabindex="0"]');
    // Lowered only once there is somewhere to put focus. `open` flips a render
    // before the content ref is attached, so this effect runs once with a null
    // node — clearing the flag there consumed the request and the second run,
    // the one that actually had the grid, did nothing.
    if (!day) return;
    handOverRef.current = false;
    day.focus({ preventScroll: true });
  }, [anchored.open, anchored.contentNode]);

  const commit = (next: Date | null) => {
    setDraft(null);
    if (controlled === undefined) setUncontrolled(next);
    onChange?.(next, next ? formatDate(toCalendarDate(next), locale.tag, format) : "");
  };

  const select = (date: CalendarDate) => {
    commit(toDate(date));
    setMonth(startOfMonth(date));
    anchored.setOpen(false);
    inputRef.current?.focus({ preventScroll: true });
  };

  /** Reads what was typed, in whatever order this locale writes a date. */
  const settle = () => {
    if (draft === null) return;
    const trimmed = draft.trim();
    if (trimmed === "") {
      commit(null);
      return;
    }
    const parsed = parseLocaleDate(trimmed, locale.tag);
    // An unparseable or disabled date reverts rather than clearing: someone who
    // mistyped wants to see what they had, not an empty field.
    if (!parsed || (disabledDate?.(toDate(parsed)) ?? false)) {
      setDraft(null);
      return;
    }
    commit(toDate(parsed));
    setMonth(startOfMonth(parsed));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (OPENS_PANEL.has(event.key)) {
      // Down, page up and page down do nothing in a single-line field, so they
      // are free to take. Left and right are deliberately left alone — they
      // belong to the caret, and a date field that cannot be edited by keyboard
      // is worse than one whose grid needs one extra press to reach.
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
      // Committed here rather than left to blur: Enter inside a form submits
      // it, and the submit would otherwise carry the previous value.
      event.preventDefault();
      settle();
      anchored.setOpen(false);
    }
  };

  const showClear = allowClear && !disabled && (value !== null || draft !== null);

  return (
    <AnchoredView
      anchored={anchored}
      arrow={false}
      className={className}
      triggerPart="control"
      body={
        <>
          <DatePanel
            value={value}
            month={month}
            today={today}
            onMonthChange={setMonth}
            onSelect={select}
            disabledDate={disabledDate}
          />
          {showToday && (
            <div data-scope="date-picker" data-part="footer">
              <button
                type="button"
                data-scope="date-picker"
                data-part="today"
                disabled={disabledDate?.(toDate(today)) ?? false}
                onClick={() => select(today)}
              >
                {locale.DatePicker.today}
              </button>
            </div>
          )}
        </>
      }
    >
      <input
        ref={setInput}
        type="text"
        data-scope="date-picker"
        data-part="input"
        data-size={size}
        data-status={status}
        data-disabled={dataAttr(disabled)}
        id={id}
        name={name}
        disabled={disabled}
        readOnly={inputReadOnly}
        placeholder={placeholder ?? locale.DatePicker.placeholder}
        value={display}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        // Only when true. Absent and `"false"` say the same thing to a screen
        // reader, and only one of them is noise.
        //
        // The prop is honoured as well as the status, because `Form.Item` binds
        // its child by injecting exactly this — a picker in a form would
        // otherwise point at an error through `aria-describedby` and never
        // announce itself invalid, while an `Input` beside it does.
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
          data-scope="date-picker"
          data-part="clear"
          aria-label={locale.DatePicker.clear}
          onClick={event => {
            // The trigger wrapper listens for clicks, so without this the clear
            // opens the panel it has no business opening.
            event.stopPropagation();
            commit(null);
            inputRef.current?.focus({ preventScroll: true });
          }}
        >
          <Icon name="close" size="sm" />
        </button>
      ) : (
        <Icon name="calendar" size="sm" data-scope="date-picker" data-part="suffix" />
      )}
    </AnchoredView>
  );
}
