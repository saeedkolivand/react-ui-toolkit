/**
 * Locale-aware names and formatting, entirely from `Intl`.
 *
 * This is why the date engine needs no locale packs. Month names, weekday
 * names, the order of a formatted date and the first day of the week all come
 * from the platform, in every locale it knows — which is all of them. Shipping
 * a table of month names per language would be both larger and worse.
 */

import { toDate, type CalendarDate } from "./calendar";

export type NameWidth = "long" | "short" | "narrow";

/**
 * Forced on every formatter here.
 *
 * A bare `Intl.DateTimeFormat(locale)` uses the *locale's* calendar, which is
 * `persian` for fa-IR and `islamic-umalqura` for ar-SA. `CalendarDate` and
 * `getMonthGrid` are Gregorian, so inheriting the locale default labels a
 * Gregorian grid with Persian month names -- offset by roughly ten days -- and
 * renders a date under the picker that disagrees with the cell just clicked.
 */
const GREGORY = { calendar: "gregory" } as const;

/**
 * Maps a locale's own digits onto ASCII.
 *
 * `\d` in JavaScript is `[0-9]` and nothing else, with or without the `u` flag,
 * so a scan for it finds nothing in ar-EG (`arab`), fa-IR (`arabext`), ne-NP or
 * my-MM. A typed date field in those locales would reject every value the
 * user's own keyboard produces.
 *
 * Built by formatting 1234567890 and reading the result position by position,
 * which works for any numbering system without a table.
 */
function toAsciiDigits(input: string, locale?: string): string {
  const localised = new Intl.NumberFormat(locale, { useGrouping: false }).format(1234567890);
  if (localised === "1234567890") return input;

  const map = new Map<string, string>();
  [...localised].forEach((char, index) => map.set(char, String((index + 1) % 10)));
  return [...input].map(char => map.get(char) ?? char).join("");
}

/**
 * Month names for a locale.
 *
 * Built from a fixed year in which no month is ambiguous, and read via
 * `formatToParts` so the month is extracted rather than sliced out of a
 * formatted string — the position of which differs by locale.
 */
export function getMonthNames(locale?: string, width: NameWidth = "long"): string[] {
  const format = new Intl.DateTimeFormat(locale, { ...GREGORY, month: width });
  return Array.from({ length: 12 }, (_, index) => format.format(new Date(2021, index, 1)));
}

/**
 * Weekday names, starting from `weekStartsOn`.
 *
 * Rotated here rather than by the caller, so the names line up with a grid
 * built for the same start day without anyone having to remember to rotate
 * both.
 */
export function getWeekdayNames(
  locale?: string,
  width: NameWidth = "short",
  weekStartsOn = 0
): string[] {
  const format = new Intl.DateTimeFormat(locale, { ...GREGORY, weekday: width });
  // 2021-08-01 was a Sunday, so index 0 is Sunday before rotation.
  const names = Array.from({ length: 7 }, (_, index) =>
    format.format(new Date(2021, 7, 1 + index))
  );
  return [...names.slice(weekStartsOn), ...names.slice(0, weekStartsOn)];
}

/**
 * First day of the week for a locale.
 *
 * `Intl.Locale.getWeekInfo()` knows this for every locale; the fallback covers
 * engines that have not shipped it. Its `firstDay` is 1-7 with Monday as 1 and
 * Sunday as 7, while everything here uses `Date`'s 0-6 with Sunday as 0 — so 7
 * has to become 0, and forgetting that is an off-by-one nobody spots in a
 * locale they do not read.
 */
export function getWeekStart(locale?: string): number {
  try {
    const resolved = new Intl.Locale(locale ?? new Intl.DateTimeFormat().resolvedOptions().locale);
    const info = resolved as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const firstDay = info.getWeekInfo?.().firstDay ?? info.weekInfo?.firstDay;
    if (typeof firstDay === "number") return firstDay % 7;
  } catch {
    // Falls through to the default below.
  }
  return 0;
}

/** Formats a calendar date. Options pass straight to `Intl.DateTimeFormat`. */
export const formatDate = (
  date: CalendarDate,
  locale?: string,
  options: Intl.DateTimeFormatOptions = { dateStyle: "medium" }
  // `calendar` first, so a caller who genuinely wants another one can say so.
): string => new Intl.DateTimeFormat(locale, { ...GREGORY, ...options }).format(toDate(date));

/**
 * Parses a date the way a locale writes it.
 *
 * Necessary because `01/02/2026` is January in the US and February nearly
 * everywhere else — so a picker with a typed input cannot use `Date.parse`,
 * which would silently pick one. The locale's own part order is discovered
 * from `formatToParts`, and the input is read against that.
 */
export function parseLocaleDate(input: string, locale?: string): CalendarDate | undefined {
  const digits = toAsciiDigits(input, locale).match(/\d+/g);
  if (!digits || digits.length < 3) return undefined;

  const order = new Intl.DateTimeFormat(locale, GREGORY)
    .formatToParts(new Date(2021, 10, 22))
    .filter(part => part.type === "year" || part.type === "month" || part.type === "day")
    .map(part => part.type);

  const values: Partial<Record<"year" | "month" | "day", number>> = {};
  order.forEach((type, index) => {
    const value = digits[index];
    if (value !== undefined) values[type as "year" | "month" | "day"] = Number(value);
  });

  const { year, month, day } = values;
  if (year === undefined || month === undefined || day === undefined) return undefined;
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;

  // Two-digit years land in the current century, which is what someone typing
  // `26` into a date field means.
  const fullYear = year < 100 ? Math.floor(new Date().getFullYear() / 100) * 100 + year : year;

  // Rejects 31 February rather than rolling it into March: a typed date that
  // does not exist is a mistake, not an instruction.
  const candidate = new Date(fullYear, month - 1, day);
  if (candidate.getMonth() !== month - 1 || candidate.getDate() !== day) return undefined;

  return { year: fullYear, month, day };
}
