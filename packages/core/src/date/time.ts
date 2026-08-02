/**
 * Time of day: the columns a picker offers, and the arithmetic behind them.
 *
 * Separate from `calendar.ts` because a time is not a date. The calendar module
 * exists to keep `Date` honest about days across daylight saving; this one never
 * touches a day at all. `CalendarTime` is a plain `[hour, minute, second]` in
 * 24-hour form — the twelve-hour split is a *presentation* of it, and keeping
 * that at the edge is what stops "is 12 AM midnight or noon" leaking into the
 * arithmetic.
 */

import { toAsciiDigits } from "./format";

export interface CalendarTime {
  /** 0-23, always. Twelve-hour form is produced at the edge, never stored. */
  hour: number;
  minute: number;
  second: number;
}

export const toCalendarTime = (date: Date): CalendarTime => ({
  hour: date.getHours(),
  minute: date.getMinutes(),
  second: date.getSeconds(),
});

/**
 * A `Date` carrying this time, on a given day or on today.
 *
 * The day is preserved rather than normalised, so a picker composing a date and
 * a time does not silently move the date.
 */
export function timeToDate(time: CalendarTime, on: Date = new Date()): Date {
  const date = new Date(on);
  date.setHours(time.hour, time.minute, time.second, 0);
  return date;
}

/** Negative when `a` is earlier. Field comparison, so no timezone can affect it. */
export const compareTimes = (a: CalendarTime, b: CalendarTime): number =>
  a.hour - b.hour || a.minute - b.minute || a.second - b.second;

export const isSameTime = (a: CalendarTime, b: CalendarTime): boolean => compareTimes(a, b) === 0;

/**
 * The values one column offers.
 *
 * `0, step, 2·step …` below `count`. A step that does not divide the count
 * leaves a short last gap rather than overshooting — 0/25/50 for a 60-minute
 * column at 25, not 0/25/50/75.
 */
export function stepValues(count: number, step: number): number[] {
  const size = step > 0 ? step : 1;
  const values: number[] = [];
  for (let value = 0; value < count; value += size) values.push(value);
  return values;
}

/** 0-23 → the hour a clock face shows, and whether it is the afternoon. */
export const to12Hour = (hour: number): { hour: number; pm: boolean } => ({
  // 0 and 12 both display as 12, which is the one place the mapping is not
  // arithmetic — `hour % 12` alone renders midnight as "0 AM".
  hour: hour % 12 === 0 ? 12 : hour % 12,
  pm: hour >= 12,
});

/** The inverse, with the same midnight/noon exception. */
export const from12Hour = (hour: number, pm: boolean): number => {
  const base = hour % 12;
  return pm ? base + 12 : base;
};

/**
 * Whether a locale writes the time on a twelve-hour clock.
 *
 * Asked of `Intl` rather than guessed from the language, because it varies
 * within one: en-US is twelve-hour and en-GB is twenty-four.
 */
export function prefers12Hour(locale?: string): boolean {
  try {
    const resolved = new Intl.DateTimeFormat(locale, { hour: "numeric" }).resolvedOptions();
    // `hourCycle` is the reliable one; `hour12` is deprecated in some engines
    // and absent in others.
    if (resolved.hourCycle) return resolved.hourCycle === "h11" || resolved.hourCycle === "h12";
    return resolved.hour12 === true;
  } catch {
    return false;
  }
}

/**
 * The locale's own words for the two day periods, in order.
 *
 * Read off a formatted time rather than hard-coded, so a locale that writes
 * "π.μ."/"μ.μ." or "午前"/"午後" gets its own — and read through
 * `formatToParts`, because where the period sits in the string differs by
 * locale and slicing would find it in the wrong place.
 */
export function getDayPeriods(locale?: string): [string, string] {
  const read = (hour: number): string => {
    const parts = new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true }).formatToParts(
      new Date(2021, 0, 1, hour)
    );
    return parts.find(part => part.type === "dayPeriod")?.value ?? (hour < 12 ? "AM" : "PM");
  };
  return [read(9), read(21)];
}

/** Formats a time. Options pass straight to `Intl.DateTimeFormat`. */
export function formatTime(
  time: CalendarTime,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }
): string {
  return new Intl.DateTimeFormat(locale, options).format(timeToDate(time, new Date(2021, 0, 1)));
}

/**
 * Reads a typed time.
 *
 * Digits first, then the day period — which is looked for by the locale's own
 * words rather than by "am"/"pm", so a Greek or Japanese user's own keyboard
 * output parses. A bare hour is a time: "9" means 09:00, which is what someone
 * typing into a time field means by it.
 */
export function parseTime(input: string, locale?: string): CalendarTime | undefined {
  const text = toAsciiDigits(input, locale);
  const digits = text.match(/\d+/g);
  if (!digits || digits.length === 0) return undefined;

  const [hourText, minuteText, secondText] = digits;
  let hour = Number(hourText);
  const minute = minuteText === undefined ? 0 : Number(minuteText);
  const second = secondText === undefined ? 0 : Number(secondText);

  const [am, pm] = getDayPeriods(locale);
  const lowered = text.toLocaleLowerCase(locale);
  const has = (word: string) => word !== "" && lowered.includes(word.toLocaleLowerCase(locale));
  // Twelve-hour input only ever names a period; without one the digits are
  // taken as written, so "14" stays 14 and "2" stays 2 rather than guessing.
  if (has(pm) && hour <= 12) hour = from12Hour(hour, true);
  else if (has(am) && hour === 12) hour = 0;

  if (hour > 23 || minute > 59 || second > 59) return undefined;
  return { hour, minute, second };
}

/** Keeps a time inside an inclusive range. Either end may be omitted. */
export function clampTime(
  time: CalendarTime,
  min?: CalendarTime,
  max?: CalendarTime
): CalendarTime {
  if (min && compareTimes(time, min) < 0) return min;
  if (max && compareTimes(time, max) > 0) return max;
  return time;
}
