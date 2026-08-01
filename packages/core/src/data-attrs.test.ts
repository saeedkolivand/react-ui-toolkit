import { describe, expect, it } from "vitest";
import { ariaAttr, dataAttr, hasContent } from "./data-attrs";

describe("dataAttr", () => {
  it("is the empty string when true and absent otherwise", () => {
    expect(dataAttr(true)).toBe("");
    expect(dataAttr(false)).toBeUndefined();
    expect(dataAttr(null)).toBeUndefined();
    expect(dataAttr(undefined)).toBeUndefined();
  });

  it("never produces the string 'false'", () => {
    // `[data-loading]` matches `data-loading="false"`, so this is the one
    // return value that would silently apply the wrong styles.
    expect(Object.values({ a: dataAttr(false) })).not.toContain("false");
  });
});

describe("ariaAttr", () => {
  it("is the string 'true' when true and absent otherwise", () => {
    expect(ariaAttr(true)).toBe("true");
    expect(ariaAttr(false)).toBeUndefined();
  });
});

describe("hasContent", () => {
  it("rejects false, which is what a conditioned-away slot evaluates to", () => {
    // `{show && <Divider/>}` is `false`, not `undefined`. A `!= null` check
    // passes it through and emits an empty wrapper part — which still takes a
    // gap as a flex item, so the row silently doubles its own spacing.
    expect(hasContent(false)).toBe(false);
  });

  it("rejects nothing-at-all in its other spellings", () => {
    expect(hasContent(null)).toBe(false);
    expect(hasContent(undefined)).toBe(false);
    expect(hasContent("")).toBe(false);
  });

  it("accepts the falsy values that do render", () => {
    // `0` renders as "0" and `true`, while unusual in a slot, is not nothing.
    // Treating every falsy value as empty would drop a legitimate zero.
    expect(hasContent(0)).toBe(true);
    expect(hasContent(true)).toBe(true);
  });

  it("rejects a list with nothing in it", () => {
    // `{items.map(…)}` on an empty list is the other everyday way a slot ends
    // up empty, and it arrives as `[]` rather than as any of the spellings
    // above — so the wrapper part gets emitted and takes its gap regardless.
    expect(hasContent([])).toBe(false);
  });

  it("rejects a list with nothing renderable in it", () => {
    expect(hasContent([false, null, undefined, ""])).toBe(false);
  });

  it("accepts a list with one renderable entry", () => {
    expect(hasContent([false, { type: "b" }])).toBe(true);
  });

  it("accepts ordinary content", () => {
    expect(hasContent("Save")).toBe(true);
    expect(hasContent({ type: "div" })).toBe(true);
  });
});
