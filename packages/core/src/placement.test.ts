import { describe, expect, it } from "vitest";
import { isFocusVisible, resolvePlacement, type LegacyPlacement } from "./placement";

describe("resolvePlacement", () => {
  it("falls back when nothing is given", () => {
    expect(resolvePlacement(undefined)).toBe("top");
    expect(resolvePlacement(undefined, "bottom")).toBe("bottom");
  });

  it("passes canonical names through untouched", () => {
    expect(resolvePlacement("bottom-end")).toBe("bottom-end");
    expect(resolvePlacement("left")).toBe("left");
  });

  it("translates all twelve v0 names", () => {
    const cases: Record<LegacyPlacement, string> = {
      top: "top",
      left: "left",
      right: "right",
      bottom: "bottom",
      topLeft: "top-start",
      topRight: "top-end",
      bottomLeft: "bottom-start",
      bottomRight: "bottom-end",
      leftTop: "left-start",
      leftBottom: "left-end",
      rightTop: "right-start",
      rightBottom: "right-end",
    };
    for (const [legacy, expected] of Object.entries(cases)) {
      expect(resolvePlacement(legacy as LegacyPlacement)).toBe(expected);
    }
  });
});

describe("isFocusVisible", () => {
  it("is false for a non-element target", () => {
    expect(isFocusVisible(null)).toBe(false);
    expect(isFocusVisible(new EventTarget())).toBe(false);
  });

  it("treats focus as visible when :focus-visible is unsupported", () => {
    const el = { matches: () => throwUnsupported() } as unknown as Element;
    Object.setPrototypeOf(el, Element.prototype);
    expect(isFocusVisible(el)).toBe(true);
  });
});

function throwUnsupported(): never {
  throw new SyntaxError("unsupported pseudo-class");
}
