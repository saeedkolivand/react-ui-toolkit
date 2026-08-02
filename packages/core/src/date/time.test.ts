import { describe, expect, it } from "vitest";
import {
  clampTime,
  compareTimes,
  formatTime,
  from12Hour,
  getDayPeriods,
  parseTime,
  prefers12Hour,
  stepValues,
  timeToDate,
  to12Hour,
  toCalendarTime,
} from "./time";

const t = (hour: number, minute = 0, second = 0) => ({ hour, minute, second });

describe("stepValues", () => {
  it("counts from zero by the step", () => {
    expect(stepValues(24, 1)).toHaveLength(24);
    expect(stepValues(60, 15)).toEqual([0, 15, 30, 45]);
  });

  it("stops short rather than overshooting on a step that does not divide", () => {
    // A 60-minute column at 25 offers 0, 25, 50 — a fourth entry would be 75,
    // which is not a minute.
    expect(stepValues(60, 25)).toEqual([0, 25, 50]);
  });

  it("treats a zero or negative step as one, rather than looping forever", () => {
    expect(stepValues(3, 0)).toEqual([0, 1, 2]);
    expect(stepValues(3, -5)).toEqual([0, 1, 2]);
  });
});

describe("the twelve-hour split", () => {
  it("shows midnight and noon as 12", () => {
    // The one place the mapping is not arithmetic: `hour % 12` renders both as
    // "0", and a clock face has no zero on it.
    expect(to12Hour(0)).toEqual({ hour: 12, pm: false });
    expect(to12Hour(12)).toEqual({ hour: 12, pm: true });
  });

  it("round-trips every hour of the day", () => {
    for (let hour = 0; hour < 24; hour++) {
      const { hour: shown, pm } = to12Hour(hour);
      expect(from12Hour(shown, pm)).toBe(hour);
    }
  });
});

describe("compareTimes", () => {
  it("orders by hour, then minute, then second", () => {
    expect(compareTimes(t(9), t(10))).toBeLessThan(0);
    expect(compareTimes(t(9, 30), t(9, 15))).toBeGreaterThan(0);
    expect(compareTimes(t(9, 30, 1), t(9, 30, 2))).toBeLessThan(0);
    expect(compareTimes(t(9, 30, 2), t(9, 30, 2))).toBe(0);
  });
});

describe("clampTime", () => {
  it("holds a time inside an inclusive range", () => {
    expect(clampTime(t(6), t(9), t(17))).toEqual(t(9));
    expect(clampTime(t(20), t(9), t(17))).toEqual(t(17));
    expect(clampTime(t(12), t(9), t(17))).toEqual(t(12));
  });

  it("leaves an open end alone", () => {
    expect(clampTime(t(3), undefined, t(17))).toEqual(t(3));
    expect(clampTime(t(23), t(9))).toEqual(t(23));
  });
});

describe("timeToDate", () => {
  it("keeps the day it was given", () => {
    const day = new Date(2026, 2, 15);
    const result = timeToDate(t(14, 30), day);
    // A picker composing a date and a time must not silently move the date.
    expect([result.getFullYear(), result.getMonth(), result.getDate()]).toEqual([2026, 2, 15]);
    expect([result.getHours(), result.getMinutes()]).toEqual([14, 30]);
  });

  it("clears the milliseconds, so two equal times compare equal", () => {
    const day = new Date(2026, 2, 15, 1, 2, 3, 456);
    expect(timeToDate(t(9), day).getMilliseconds()).toBe(0);
  });

  it("round-trips through toCalendarTime", () => {
    expect(toCalendarTime(timeToDate(t(23, 59, 59)))).toEqual(t(23, 59, 59));
  });
});

describe("prefers12Hour", () => {
  it("varies within one language, so it is asked rather than guessed", () => {
    // The reason this is not a table keyed on language.
    expect(prefers12Hour("en-US")).toBe(true);
    expect(prefers12Hour("en-GB")).toBe(false);
    expect(prefers12Hour("de-DE")).toBe(false);
  });
});

describe("getDayPeriods", () => {
  it("reads the locale's own words", () => {
    expect(getDayPeriods("en-US")).toEqual(["AM", "PM"]);
    const [morning, afternoon] = getDayPeriods("ja-JP");
    expect(morning).not.toBe(afternoon);
    // Hard-coding "AM"/"PM" would put English into every locale's field.
    expect(morning).not.toBe("AM");
  });
});

describe("parseTime", () => {
  it("reads hours, minutes and seconds", () => {
    expect(parseTime("14:30")).toEqual(t(14, 30));
    expect(parseTime("14:30:09")).toEqual(t(14, 30, 9));
  });

  it("takes a bare hour as an hour", () => {
    // Which is what someone typing "9" into a time field means by it.
    expect(parseTime("9")).toEqual(t(9));
  });

  it("applies a day period, and only when one is written", () => {
    expect(parseTime("2:30 PM", "en-US")).toEqual(t(14, 30));
    expect(parseTime("12:30 AM", "en-US")).toEqual(t(0, 30));
    expect(parseTime("12:30 PM", "en-US")).toEqual(t(12, 30));
    // No period named, so the digits stand as written rather than being guessed.
    expect(parseTime("14:30", "en-US")).toEqual(t(14, 30));
    expect(parseTime("2:30", "en-US")).toEqual(t(2, 30));
  });

  it("matches the locale's own period words, not the English ones", () => {
    const [, pm] = getDayPeriods("ja-JP");
    expect(parseTime(`2:30 ${pm}`, "ja-JP")).toEqual(t(14, 30));
  });

  it("reads a locale's own digits", () => {
    // `\d` is `[0-9]` and nothing else, so a scan for it finds nothing in the
    // numbering systems fa-IR or ar-EG actually type in.
    expect(parseTime("۱۴:۳۰", "fa-IR")).toEqual(t(14, 30));
  });

  it("rejects what is not a time", () => {
    expect(parseTime("")).toBeUndefined();
    expect(parseTime("later")).toBeUndefined();
    expect(parseTime("25:00")).toBeUndefined();
    expect(parseTime("14:70")).toBeUndefined();
  });
});

describe("formatTime", () => {
  it("writes the time the way the locale does", () => {
    expect(formatTime(t(14, 30), "en-GB")).toContain("14:30");
    expect(formatTime(t(14, 30), "en-US")).toMatch(/2:30/);
  });

  it("round-trips through parseTime in both clock conventions", () => {
    for (const locale of ["en-US", "en-GB", "de-DE"]) {
      const formatted = formatTime(t(14, 30), locale);
      expect(parseTime(formatted, locale)).toEqual(t(14, 30));
    }
  });
});
