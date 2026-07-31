import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  addYears,
  compareDates,
  daysInMonth,
  diffInDays,
  endOfMonth,
  getMonthGrid,
  isSameDay,
  isWithin,
  startOfWeek,
  toCalendarDate,
  toDate,
  type CalendarDate,
} from "./calendar";
import {
  formatDate,
  getMonthNames,
  getWeekdayNames,
  getWeekStart,
  parseLocaleDate,
} from "./format";

const d = (year: number, month: number, day: number): CalendarDate => ({ year, month, day });

describe("test environment", () => {
  it("runs in a timezone that observes daylight saving", () => {
    // Without this the DST tests below are vacuous rather than failing: UTC has
    // no shift, so `addDays` across one is never actually exercised — and CI
    // runners are UTC. `vitest.config.ts` pins the zone; this asserts the pin
    // took effect, so breaking it fails loudly.
    const january = new Date(2026, 0, 1).getTimezoneOffset();
    const july = new Date(2026, 6, 1).getTimezoneOffset();
    expect(january, "no DST in this timezone — check vitest.config.ts").not.toBe(july);
  });

  it("shifts on the dates the DST tests use", () => {
    // 2026-03-29 and 2026-10-25 are the last Sundays of March and October.
    expect(new Date(2026, 2, 28).getTimezoneOffset()).not.toBe(
      new Date(2026, 2, 30).getTimezoneOffset()
    );
    expect(new Date(2026, 9, 24).getTimezoneOffset()).not.toBe(
      new Date(2026, 9, 26).getTimezoneOffset()
    );
  });
});

describe("calendar arithmetic", () => {
  it("uses 1-12 months, not 0-11", () => {
    // A month number that reads wrong is a bug factory.
    expect(toCalendarDate(new Date(2026, 0, 15))).toEqual(d(2026, 1, 15));
    expect(toDate(d(2026, 1, 15)).getMonth()).toBe(0);
  });

  it("normalises out-of-range fields", () => {
    // So no caller needs its own month-length table.
    expect(toCalendarDate(toDate(d(2026, 13, 1)))).toEqual(d(2027, 1, 1));
    expect(toCalendarDate(toDate(d(2026, 3, 0)))).toEqual(d(2026, 2, 28));
  });

  describe("addDays", () => {
    it("crosses month and year boundaries", () => {
      expect(addDays(d(2026, 1, 31), 1)).toEqual(d(2026, 2, 1));
      expect(addDays(d(2026, 12, 31), 1)).toEqual(d(2027, 1, 1));
      expect(addDays(d(2026, 1, 1), -1)).toEqual(d(2025, 12, 31));
    });

    it("crosses a leap day", () => {
      expect(addDays(d(2024, 2, 28), 1)).toEqual(d(2024, 2, 29));
      expect(addDays(d(2026, 2, 28), 1)).toEqual(d(2026, 3, 1));
    });

    it("is exact across a daylight-saving shift", () => {
      // Adding 24 hours to a Date lands on 23:00 the same day or 01:00 two days
      // later, twice a year. Working on calendar fields cannot.
      for (const start of [d(2026, 3, 28), d(2026, 3, 29), d(2026, 10, 24), d(2026, 10, 25)]) {
        const next = addDays(start, 1);
        expect(diffInDays(start, next), `${JSON.stringify(start)}`).toBe(1);
      }
    });
  });

  describe("addMonths", () => {
    it("clamps to the target month's length", () => {
      // 31 January plus one month is 28 February, not 3 March — the single most
      // surprising result in date arithmetic if you let Date normalise.
      expect(addMonths(d(2026, 1, 31), 1)).toEqual(d(2026, 2, 28));
      expect(addMonths(d(2024, 1, 31), 1)).toEqual(d(2024, 2, 29));
      expect(addMonths(d(2026, 3, 31), -1)).toEqual(d(2026, 2, 28));
    });

    it("crosses years in both directions", () => {
      expect(addMonths(d(2026, 12, 15), 1)).toEqual(d(2027, 1, 15));
      expect(addMonths(d(2026, 1, 15), -1)).toEqual(d(2025, 12, 15));
      expect(addMonths(d(2026, 6, 15), 18)).toEqual(d(2027, 12, 15));
    });
  });

  it("keeps years 0-99 in the first century, not the 1900s", () => {
    // `new Date(26, ...)` is 1926. `toDate` is the chokepoint every other
    // function routes through, and the contract above promises normalisation —
    // this was the one input where it did not hold.
    expect(toDate(d(26, 1, 1)).getFullYear()).toBe(26);
    expect(daysInMonth(4, 2)).toBe(29); // year 4 was a leap year
    expect(addMonths(d(99, 1, 31), 1)).toEqual(d(99, 2, 28));
    expect(addDays(d(1, 1, 1), -1)).toEqual(d(0, 12, 31));
  });

  it("clamps a leap day when adding years", () => {
    expect(addYears(d(2024, 2, 29), 1)).toEqual(d(2025, 2, 28));
    expect(addYears(d(2024, 2, 29), 4)).toEqual(d(2028, 2, 29));
  });

  it("knows month lengths, including leap years", () => {
    expect(daysInMonth(2026, 2)).toBe(28);
    expect(daysInMonth(2024, 2)).toBe(29);
    // 1900 is not a leap year and 2000 is — the rule most implementations miss.
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
    expect(daysInMonth(2026, 4)).toBe(30);
  });

  it("compares and orders", () => {
    expect(compareDates(d(2026, 1, 1), d(2026, 1, 2))).toBeLessThan(0);
    expect(compareDates(d(2026, 2, 1), d(2026, 1, 31))).toBeGreaterThan(0);
    expect(isSameDay(d(2026, 1, 1), d(2026, 1, 1))).toBe(true);
  });

  it("treats a range as inclusive, and tolerates it given backwards", () => {
    expect(isWithin(d(2026, 1, 1), d(2026, 1, 1), d(2026, 1, 5))).toBe(true);
    expect(isWithin(d(2026, 1, 5), d(2026, 1, 1), d(2026, 1, 5))).toBe(true);
    expect(isWithin(d(2026, 1, 6), d(2026, 1, 1), d(2026, 1, 5))).toBe(false);
    // A picker reports whichever end was clicked first.
    expect(isWithin(d(2026, 1, 3), d(2026, 1, 5), d(2026, 1, 1))).toBe(true);
  });

  it("finds the start of the week for any start day", () => {
    // 2026-01-15 is a Thursday.
    expect(startOfWeek(d(2026, 1, 15), 0)).toEqual(d(2026, 1, 11)); // Sunday
    expect(startOfWeek(d(2026, 1, 15), 1)).toEqual(d(2026, 1, 12)); // Monday
    expect(startOfWeek(d(2026, 1, 15), 6)).toEqual(d(2026, 1, 10)); // Saturday
  });

  it("returns the same day when it is already the week start", () => {
    expect(startOfWeek(d(2026, 1, 11), 0)).toEqual(d(2026, 1, 11));
  });

  describe("diffInDays", () => {
    it("counts whole days in both directions", () => {
      expect(diffInDays(d(2026, 1, 1), d(2026, 1, 31))).toBe(30);
      expect(diffInDays(d(2026, 1, 31), d(2026, 1, 1))).toBe(-30);
      expect(diffInDays(d(2026, 1, 1), d(2026, 1, 1))).toBe(0);
    });

    it("counts a leap year correctly", () => {
      expect(diffInDays(d(2024, 1, 1), d(2025, 1, 1))).toBe(366);
      expect(diffInDays(d(2026, 1, 1), d(2027, 1, 1))).toBe(365);
    });

    it("is not thrown by a daylight-saving boundary", () => {
      // Midnight to midnight across one is 23 or 25 hours, which rounds wrong.
      expect(diffInDays(d(2026, 3, 28), d(2026, 3, 30))).toBe(2);
      expect(diffInDays(d(2026, 10, 24), d(2026, 10, 26))).toBe(2);
    });
  });
});

describe("getMonthGrid", () => {
  it("emits whole weeks", () => {
    for (const [year, month] of [
      [2026, 1],
      [2026, 2],
      [2026, 8],
    ] as const) {
      const grid = getMonthGrid(year, month);
      for (const week of grid) expect(week).toHaveLength(7);
    }
  });

  it("pads with surrounding days rather than blanks", () => {
    // Gaps at the edges make the last days of a month hard to reach.
    const grid = getMonthGrid(2026, 1, { weekStartsOn: 0 });
    const first = grid[0]![0]!;
    expect(first.inMonth).toBe(false);
    expect(first.date).toEqual(d(2025, 12, 28));
  });

  it("marks which days belong to the month", () => {
    const grid = getMonthGrid(2026, 2);
    const inMonth = grid.flat().filter(day => day.inMonth);
    expect(inMonth).toHaveLength(28);
    expect(inMonth[0]!.date).toEqual(d(2026, 2, 1));
    expect(inMonth[27]!.date).toEqual(d(2026, 2, 28));
  });

  it("starts every row on the requested weekday", () => {
    for (const weekStartsOn of [0, 1, 6]) {
      const grid = getMonthGrid(2026, 5, { weekStartsOn });
      for (const week of grid) {
        expect(toDate(week[0]!.date).getDay(), `start ${weekStartsOn}`).toBe(weekStartsOn);
      }
    }
  });

  it("can pin six rows so the calendar does not resize between months", () => {
    expect(getMonthGrid(2026, 2, { fixedWeeks: true })).toHaveLength(6);
    expect(getMonthGrid(2026, 1, { fixedWeeks: true })).toHaveLength(6);
  });

  it("uses only as many rows as the month needs", () => {
    // February 2027 starts on a Monday and has 28 days, so with a Monday start
    // it fits in exactly four rows.
    expect(getMonthGrid(2026, 8, { weekStartsOn: 0 })).toHaveLength(6);
    expect(getMonthGrid(2027, 2, { weekStartsOn: 1 })).toHaveLength(4);
  });

  it("marks today only when told what today is", () => {
    // Injected rather than read, so a grid is testable and deterministic.
    const grid = getMonthGrid(2026, 1, { today: d(2026, 1, 15) });
    expect(grid.flat().filter(day => day.isToday)).toHaveLength(1);
    expect(
      getMonthGrid(2026, 1)
        .flat()
        .some(day => day.isToday)
    ).toBe(false);
  });

  it("marks the weekend, and lets a locale redefine it", () => {
    const grid = getMonthGrid(2026, 1);
    expect(grid[0]!.filter(day => day.isWeekend)).toHaveLength(2);

    // Friday and Saturday, as much of the Middle East observes.
    const middleEast = getMonthGrid(2026, 1, { weekendDays: [5, 6] });
    expect(
      middleEast[0]!.filter(day => day.isWeekend).map(day => toDate(day.date).getDay())
    ).toEqual([5, 6]);
  });

  it("covers the whole month with no gaps or repeats", () => {
    const days = getMonthGrid(2026, 3).flat();
    for (let i = 1; i < days.length; i++) {
      expect(diffInDays(days[i - 1]!.date, days[i]!.date), `cell ${i}`).toBe(1);
    }
  });

  it("handles a month containing a daylight-saving shift", () => {
    // The grid walks day by day; a 23-hour day must not skip or duplicate one.
    for (const month of [3, 10]) {
      const days = getMonthGrid(2026, month).flat();
      const inMonth = days.filter(day => day.inMonth);
      expect(inMonth, `month ${month}`).toHaveLength(daysInMonth(2026, month));
    }
  });

  it("gives the last day of the month", () => {
    expect(endOfMonth(d(2026, 2, 10))).toEqual(d(2026, 2, 28));
    expect(endOfMonth(d(2024, 2, 10))).toEqual(d(2024, 2, 29));
  });
});

describe("locale formatting", () => {
  it("gets month names from Intl, in the locale asked for", () => {
    expect(getMonthNames("en-GB")[0]).toBe("January");
    expect(getMonthNames("fr-FR")[0]).toBe("janvier");
    expect(getMonthNames("en-GB", "short")).toHaveLength(12);
  });

  it("gets weekday names and rotates them to the week start", () => {
    // Rotated here so the names line up with a grid built for the same start
    // day, without the caller having to rotate both.
    const sunday = getWeekdayNames("en-GB", "short", 0);
    const monday = getWeekdayNames("en-GB", "short", 1);
    expect(sunday).toHaveLength(7);
    expect(monday[0]).toBe(sunday[1]);
    expect(monday[6]).toBe(sunday[0]);
  });

  it("reports a week start in Date's 0-6 numbering", () => {
    // Intl reports 1-7 with Monday as 1 and Sunday as 7; everything here uses
    // 0-6 with Sunday as 0, so 7 has to become 0.
    const start = getWeekStart("en-US");
    expect(start).toBeGreaterThanOrEqual(0);
    expect(start).toBeLessThanOrEqual(6);
  });

  it("labels a Gregorian grid with Gregorian months, whatever the locale's own calendar", () => {
    // A bare Intl.DateTimeFormat uses the *locale's* calendar — persian for
    // fa-IR — so indexing month names by a Gregorian month number labelled the
    // grid with months offset by roughly ten days.
    expect(new Intl.DateTimeFormat("fa-IR").resolvedOptions().calendar).toBe("persian");
    expect(getMonthNames("fa-IR")[0]).toBe("ژانویه"); // January, not دی
  });

  it("formats against the Gregorian calendar the grid is built in", () => {
    // Otherwise the date under a picker disagrees with the cell just clicked.
    expect(formatDate(d(2026, 1, 15), "fa-IR", { dateStyle: "short" })).toContain("۲۰۲۶");
  });

  describe("parseLocaleDate", () => {
    it("reads a date the way the locale writes it", () => {
      // 01/02/2026 is January in the US and February nearly everywhere else,
      // which is why Date.parse cannot be used here.
      expect(parseLocaleDate("01/02/2026", "en-US")).toEqual(d(2026, 1, 2));
      expect(parseLocaleDate("01/02/2026", "en-GB")).toEqual(d(2026, 2, 1));
    });

    it("rejects a date that does not exist rather than rolling it over", () => {
      // A typed 31 February is a mistake, not an instruction to mean 3 March.
      expect(parseLocaleDate("31/02/2026", "en-GB")).toBeUndefined();
      expect(parseLocaleDate("13/13/2026", "en-GB")).toBeUndefined();
    });

    it("puts a two-digit year in the current century", () => {
      expect(parseLocaleDate("01/02/26", "en-GB")).toEqual(d(2026, 2, 1));
    });

    it("returns undefined for anything it cannot read", () => {
      expect(parseLocaleDate("", "en-GB")).toBeUndefined();
      expect(parseLocaleDate("tomorrow", "en-GB")).toBeUndefined();
      expect(parseLocaleDate("1/2", "en-GB")).toBeUndefined();
    });

    it("reads the locale's own digits, not only ASCII", () => {
      // `\d` is [0-9] and nothing else, so a scan for it finds nothing in
      // ar-EG (arab) or fa-IR (arabext) — a typed date field would have
      // rejected every value the user's own keyboard produces.
      expect(parseLocaleDate("١٥/١/٢٠٢٦", "ar-EG")).toEqual(d(2026, 1, 15));
      expect(parseLocaleDate("۲۰۲۶/۱/۱۵", "fa-IR")).toEqual(d(2026, 1, 15));
    });

    it("round-trips a numeric format in every locale", () => {
      // The two functions are inverses only for a numeric style: the default
      // `dateStyle: "medium"` writes the month as a name, which has no digits
      // to read back.
      const date = d(2026, 1, 15);
      for (const locale of ["en-GB", "en-US", "ar-EG", "fa-IR", "de-DE"]) {
        const text = formatDate(date, locale, { dateStyle: "short" });
        expect(parseLocaleDate(text, locale), `${locale} "${text}"`).toEqual(date);
      }
    });

    it("accepts any separator", () => {
      expect(parseLocaleDate("1-2-2026", "en-GB")).toEqual(d(2026, 2, 1));
      expect(parseLocaleDate("1.2.2026", "en-GB")).toEqual(d(2026, 2, 1));
    });
  });

  it("formats a calendar date", () => {
    const grid = getMonthGrid(2026, 1, { today: d(2026, 1, 15) });
    expect(grid.flat().find(day => day.isToday)?.date).toEqual(d(2026, 1, 15));
  });
});
