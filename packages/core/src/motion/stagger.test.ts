import { describe, expect, it } from "vitest";
import { stagger } from "./stagger";

describe("stagger", () => {
  it("steps evenly from the first item", () => {
    expect(stagger(4, { each: 50 })).toEqual([0, 50, 100, 150]);
  });

  it("steps from the last item", () => {
    expect(stagger(4, { each: 50, from: "last" })).toEqual([150, 100, 50, 0]);
  });

  it("sends both edges outward together from the centre", () => {
    // Ordering is by distance, not index: the origin's two neighbours share a
    // delay rather than one trailing the other.
    expect(stagger(5, { each: 50, from: "center" })).toEqual([100, 50, 0, 50, 100]);
  });

  it("handles an even count from the centre, where the origin falls between items", () => {
    expect(stagger(4, { each: 50, from: "center" })).toEqual([75, 25, 25, 75]);
  });

  it("starts from an explicit index", () => {
    expect(stagger(4, { each: 10, from: 2 })).toEqual([20, 10, 0, 10]);
  });

  it("clamps an out-of-range origin rather than producing negative delays", () => {
    expect(stagger(3, { each: 10, from: 99 })).toEqual([20, 10, 0]);
    expect(stagger(3, { each: 10, from: -5 })).toEqual([0, 10, 20]);
  });

  it("scales to fit a total budget", () => {
    // So a list of 200 does not take ten seconds to appear.
    expect(stagger(5, { total: 200 })).toEqual([0, 50, 100, 150, 200]);
  });

  it("keeps `each` when there is no spread to scale", () => {
    expect(stagger(1, { each: 50, total: 500 })).toEqual([0]);
  });

  it("returns nothing for an empty sequence", () => {
    expect(stagger(0)).toEqual([]);
    expect(stagger(-1)).toEqual([]);
  });

  it("always starts the origin at zero", () => {
    for (const from of ["first", "last", "center", 1] as const) {
      expect(Math.min(...stagger(5, { from })), `${from}`).toBe(0);
    }
  });

  it("never produces a negative delay", () => {
    for (const from of ["first", "last", "center", 0, 4] as const) {
      for (const delay of stagger(5, { from })) expect(delay).toBeGreaterThanOrEqual(0);
    }
  });
});
