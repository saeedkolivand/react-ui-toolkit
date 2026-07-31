/**
 * Calendar arithmetic.
 *
 * No Temporal: Chrome and Firefox ship it, Safari does not, and a polyfill
 * would be a runtime dependency. So this is `Date` — with one rule that keeps
 * `Date` honest.
 *
 * **A calendar day is `[year, month, day]`, never a timestamp.** Adding
 * 24 hours to a `Date` is wrong twice a year: on the days daylight saving
 * shifts, that lands on 23:00 the same day or 01:00 two days later. Every
 * operation here works on the calendar fields and lets `Date` normalise, which
 * is exact regardless of offset. The `Date` objects produced are local midnight
 * — the value a date picker means by "a day".
 */

export interface CalendarDate {
  year: number;
  /** 1-12, not the 0-11 `Date` uses. A month number that reads wrong is a bug factory. */
  month: number;
  day: number;
}

export const toCalendarDate = (date: Date): CalendarDate => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
});

/**
 * Local midnight for a calendar date.
 *
 * Out-of-range fields normalise, which is the whole point: `{ month: 13 }`
 * becomes January of the next year, and `{ day: 0 }` becomes the last day of
 * the previous month, so no caller needs its own month-length table.
 */
export const toDate = ({ year, month, day }: CalendarDate): Date => new Date(year, month - 1, day);

export const isSameDay = (a: CalendarDate, b: CalendarDate): boolean =>
  a.year === b.year && a.month === b.month && a.day === b.day;

/** Negative when `a` is earlier. Compares fields, so no timezone can affect it. */
export const compareDates = (a: CalendarDate, b: CalendarDate): number =>
  a.year - b.year || a.month - b.month || a.day - b.day;

export const isBefore = (a: CalendarDate, b: CalendarDate) => compareDates(a, b) < 0;
export const isAfter = (a: CalendarDate, b: CalendarDate) => compareDates(a, b) > 0;

/** Inclusive at both ends, and tolerant of a range given backwards. */
export function isWithin(date: CalendarDate, from: CalendarDate, to: CalendarDate): boolean {
  const [start, end] = compareDates(from, to) <= 0 ? [from, to] : [to, from];
  return compareDates(date, start) >= 0 && compareDates(date, end) <= 0;
}

export const addDays = (date: CalendarDate, days: number): CalendarDate =>
  toCalendarDate(toDate({ ...date, day: date.day + days }));

/**
 * Adds months, clamping the day to the target month's length.
 *
 * 31 January plus one month is 28 February, not 3 March. Letting `Date`
 * normalise would produce the latter, which is the single most surprising
 * result in date arithmetic.
 */
export function addMonths(date: CalendarDate, months: number): CalendarDate {
  const target = new Date(date.year, date.month - 1 + months, 1);
  const length = daysInMonth(target.getFullYear(), target.getMonth() + 1);
  return {
    year: target.getFullYear(),
    month: target.getMonth() + 1,
    day: Math.min(date.day, length),
  };
}

export const addYears = (date: CalendarDate, years: number): CalendarDate =>
  // Via addMonths so 29 February in a leap year clamps to the 28th rather than
  // rolling into March.
  addMonths(date, years * 12);

/** Day 0 of the next month is the last day of this one — no lookup table, no leap-year rule. */
export const daysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

export const startOfMonth = (date: CalendarDate): CalendarDate => ({ ...date, day: 1 });

export const endOfMonth = (date: CalendarDate): CalendarDate => ({
  ...date,
  day: daysInMonth(date.year, date.month),
});

/** 0 for Sunday through 6 for Saturday, matching `Date.getDay`. */
export const dayOfWeek = (date: CalendarDate): number => toDate(date).getDay();

/**
 * Start of the week containing `date`.
 *
 * `weekStartsOn` differs by locale — Sunday in the US, Monday across most of
 * Europe, Saturday in much of the Middle East — so a calendar grid that hard
 * codes it is wrong for most of the world.
 */
export function startOfWeek(date: CalendarDate, weekStartsOn = 0): CalendarDate {
  const offset = (dayOfWeek(date) - weekStartsOn + 7) % 7;
  return addDays(date, -offset);
}

export interface CalendarDay {
  date: CalendarDate;
  /** False for the leading and trailing days that pad the grid. */
  inMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export interface MonthGridOptions {
  weekStartsOn?: number;
  /** Today, for highlighting. Injected rather than read, so grids are testable. */
  today?: CalendarDate;
  /** Always emit six rows. Stops the calendar resizing between months. */
  fixedWeeks?: boolean;
  /** Which weekdays count as the weekend. Defaults to Saturday and Sunday. */
  weekendDays?: number[];
}

/**
 * The grid for one month, as whole weeks.
 *
 * Padded with the surrounding months' days rather than blanks, because a
 * calendar that shows gaps at the edges makes the last days of a month hard to
 * reach and looks broken.
 */
export function getMonthGrid(
  year: number,
  month: number,
  options: MonthGridOptions = {}
): CalendarDay[][] {
  const { weekStartsOn = 0, today, fixedWeeks = false, weekendDays = [0, 6] } = options;

  const first = startOfWeek({ year, month, day: 1 }, weekStartsOn);
  const lastOfMonth = { year, month, day: daysInMonth(year, month) };

  // Whole weeks, so every row has seven cells and the grid never has holes.
  const span = Math.ceil((diffInDays(first, lastOfMonth) + 1) / 7);
  const weeks = fixedWeeks ? 6 : span;

  const grid: CalendarDay[][] = [];
  let cursor = first;
  for (let week = 0; week < weeks; week++) {
    const row: CalendarDay[] = [];
    for (let index = 0; index < 7; index++) {
      row.push({
        date: cursor,
        inMonth: cursor.month === month && cursor.year === year,
        isToday: today !== undefined && isSameDay(cursor, today),
        isWeekend: weekendDays.includes(dayOfWeek(cursor)),
      });
      cursor = addDays(cursor, 1);
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Whole days between two calendar dates.
 *
 * Both are taken to noon before subtracting. Midnight-to-midnight across a
 * daylight-saving boundary is 23 or 25 hours, which rounds to the wrong number
 * of days; noon leaves an hour of slack in both directions.
 */
export function diffInDays(from: CalendarDate, to: CalendarDate): number {
  const start = new Date(from.year, from.month - 1, from.day, 12);
  const end = new Date(to.year, to.month - 1, to.day, 12);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}
