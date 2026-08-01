import { describe, expect, it } from "vitest";
import { clamp, decimals, fromRatio, numericKey, ratio, snap, stepBy } from "./numeric";

const R = (min: number, max: number, step: number) => ({ min, max, step });

describe("clamp", () => {
  it("brings a value inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
  });

  it("tolerates a reversed range rather than returning nothing sensible", () => {
    // `min > max` is a consumer mistake, and returning `min` for every input
    // would be a control frozen at one end with no clue why.
    expect(clamp(5, 10, 0)).toBe(5);
    expect(clamp(-1, 10, 0)).toBe(0);
  });
});

describe("decimals", () => {
  it("counts places from the written form", () => {
    expect(decimals(1)).toBe(0);
    expect(decimals(0.1)).toBe(1);
    expect(decimals(0.25)).toBe(2);
  });

  it("reads exponent form, which is how small steps stringify", () => {
    // `String(1e-7)` is "1e-7", so a digit count would say zero decimals and
    // round every step to a whole number.
    expect(decimals(1e-7)).toBe(7);
    expect(decimals(1.5e-7)).toBe(8);
  });

  it("is zero for values with no fraction to count", () => {
    expect(decimals(Number.NaN)).toBe(0);
    expect(decimals(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("snap", () => {
  it("lands on the nearest step", () => {
    expect(snap(7, R(0, 10, 5))).toBe(5);
    expect(snap(8, R(0, 10, 5))).toBe(10);
  });

  it("steps from min, not from zero", () => {
    // A range starting at 1 with step 2 offers 1, 3, 5 — not 0, 2, 4.
    expect(snap(1.4, R(1, 9, 2))).toBe(1);
    expect(snap(2.5, R(1, 9, 2))).toBe(3);
  });

  it("breaks a tie upward, as a native range input does", () => {
    // 2 is equidistant from 1 and 3. Worth pinning rather than leaving to
    // whichever way `Math.round` happens to go.
    expect(snap(2, R(1, 9, 2))).toBe(3);
  });

  it("does not leak floating-point noise into the result", () => {
    // The reason this rounds at all: 0.1 + 0.2 is 0.30000000000000004, and a
    // control that reports that has a bug the consumer cannot fix.
    expect(snap(0.3, R(0, 1, 0.1))).toBe(0.3);
    expect(snap(0.7, R(0, 1, 0.1))).toBe(0.7);
    expect(String(snap(0.3, R(0, 1, 0.1)))).toBe("0.3");
  });

  it("takes its precision from min as well as step", () => {
    // Step 0.1 from min 0.05 lands on two decimals, not one. Rounding to the
    // step's precision alone would give 0.2 rather than 0.15.
    expect(snap(0.16, R(0.05, 1.05, 0.1))).toBe(0.15);
  });

  it("stays inside a range that is not a whole number of steps", () => {
    // 0..10 by 4 offers 0, 4, 8. Ten rounds to the step at 12, which is past
    // `max` — so the clamp after the snap is what keeps it in range. 0..10 by
    // 3 is the near miss: 10 rounds down to 9 and never leaves the range,
    // which is why it does not demonstrate the clamp.
    expect(snap(10, R(0, 10, 4))).toBe(10);
    expect(snap(10, R(0, 10, 3))).toBe(9);
  });

  it("snaps against an open-ended range without producing NaN", () => {
    // `InputNumber` defaults to an infinite min and max, so this is the
    // ordinary case rather than an exotic one. Counting steps from -Infinity
    // gives `-Infinity + Infinity * step`, which is NaN — and NaN reaches a
    // component as a value that renders nothing and compares false to
    // everything, with no error anywhere.
    const open = { min: Number.NEGATIVE_INFINITY, max: Number.POSITIVE_INFINITY, step: 0.5 };
    expect(snap(5.5, open)).toBe(5.5);
    expect(snap(5.7, open)).toBe(5.5);
    expect(stepBy(5, 1, open)).toBe(5.5);
  });

  it("snaps against a half-open range too", () => {
    expect(snap(99, { min: Number.NEGATIVE_INFINITY, max: 10, step: 1 })).toBe(10);
    expect(snap(-99, { min: 0, max: Number.POSITIVE_INFINITY, step: 1 })).toBe(0);
  });

  it("passes the value through when there is no step to snap to", () => {
    expect(snap(3.7, R(0, 10, 0))).toBe(3.7);
    expect(snap(3.7, R(0, 10, -1))).toBe(3.7);
  });
});

describe("stepBy", () => {
  it("moves by whole steps in both directions", () => {
    expect(stepBy(4, 1, R(0, 10, 2))).toBe(6);
    expect(stepBy(4, -1, R(0, 10, 2))).toBe(2);
  });

  it("stops at the ends rather than running past them", () => {
    expect(stepBy(10, 1, R(0, 10, 2))).toBe(10);
    expect(stepBy(0, -1, R(0, 10, 2))).toBe(0);
  });

  it("treats a missing step as one", () => {
    expect(stepBy(4, 1, R(0, 10, 0))).toBe(5);
  });
});

describe("ratio and fromRatio", () => {
  it("maps a value onto 0..1", () => {
    expect(ratio(5, 0, 10)).toBe(0.5);
    expect(ratio(0, 0, 10)).toBe(0);
    expect(ratio(10, 0, 10)).toBe(1);
  });

  it("reads a zero-width range as zero rather than dividing by it", () => {
    // A min equal to max is reachable through props, and NaN reaching a CSS
    // custom property renders a thumb at the origin with no error anywhere.
    expect(ratio(5, 5, 5)).toBe(0);
  });

  it("comes back to the same value", () => {
    const range = R(0, 200, 10);
    expect(fromRatio(ratio(120, 0, 200), range)).toBe(120);
  });

  it("clamps a position outside the track", () => {
    // A pointer dragged past the end of the track is the ordinary case, not an
    // error — it should pin to the end.
    expect(fromRatio(-0.5, R(0, 10, 1))).toBe(0);
    expect(fromRatio(1.5, R(0, 10, 1))).toBe(10);
  });
});

describe("numericKey", () => {
  const range = R(0, 100, 1);
  const key = (init: Partial<{ key: string; shiftKey: boolean; ctrlKey: boolean }>) =>
    numericKey({ key: "", ...init } as { key: string }, 50, range);

  it("moves up and down on the block axis", () => {
    expect(key({ key: "ArrowUp" })).toBe(51);
    expect(key({ key: "ArrowDown" })).toBe(49);
  });

  it("moves along the inline axis", () => {
    expect(key({ key: "ArrowRight" })).toBe(51);
    expect(key({ key: "ArrowLeft" })).toBe(49);
  });

  it("flips only the inline axis under RTL", () => {
    // Up is more and Down is less in every direction. Flipping them too would
    // make an RTL slider disagree with every native control on the page.
    const rtl = { rtl: true };
    expect(numericKey({ key: "ArrowRight" }, 50, range, rtl)).toBe(49);
    expect(numericKey({ key: "ArrowLeft" }, 50, range, rtl)).toBe(51);
    expect(numericKey({ key: "ArrowUp" }, 50, range, rtl)).toBe(51);
    expect(numericKey({ key: "ArrowDown" }, 50, range, rtl)).toBe(49);
  });

  it("takes a bigger bite with Shift and with Page keys", () => {
    expect(key({ key: "ArrowUp", shiftKey: true })).toBe(60);
    expect(key({ key: "PageUp" })).toBe(60);
    expect(key({ key: "PageDown" })).toBe(40);
  });

  it("jumps to the ends", () => {
    expect(key({ key: "Home" })).toBe(0);
    expect(key({ key: "End" })).toBe(100);
  });

  it("declines a key it does not handle, so the adapter can let it through", () => {
    // `undefined` rather than the unchanged value: the caller has to be able to
    // tell "handled, do not scroll" from "not ours".
    expect(key({ key: "a" })).toBeUndefined();
    expect(key({ key: "Enter" })).toBeUndefined();
  });

  it("declines a modified key, which belongs to the browser", () => {
    expect(key({ key: "ArrowUp", ctrlKey: true })).toBeUndefined();
    expect(numericKey({ key: "Home", metaKey: true }, 50, range)).toBeUndefined();
  });
});
