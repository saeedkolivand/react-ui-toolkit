import { afterEach, describe, expect, it } from "vitest";
import { lockScroll, scrollLockDepth } from "./scroll-lock";

describe("scroll lock", () => {
  afterEach(() => {
    while (scrollLockDepth() > 0) lockScroll()();
    document.body.removeAttribute("style");
  });

  it("locks and restores the original styles", () => {
    document.body.style.overflow = "auto";
    const release = lockScroll();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");
    release();
    expect(document.body.style.overflow).toBe("auto");
    expect(document.body.style.position).toBe("");
  });

  it("counts references so the first release does not unlock", () => {
    const first = lockScroll();
    const second = lockScroll();
    expect(scrollLockDepth()).toBe(2);

    first();
    expect(document.body.style.overflow).toBe("hidden");
    second();
    expect(document.body.style.overflow).toBe("");
  });

  it("compensates for the scrollbar on the inline axis, not the right edge", () => {
    // In RTL the document scrollbar sits on the left, which is inline-end.
    // Compensating with `padding-right` both fails to fill the gap it left and
    // adds one on the other side — content jumps by twice the gutter.
    Object.defineProperty(window, "innerWidth", { value: 1015, configurable: true });
    Object.defineProperty(document.documentElement, "clientWidth", {
      value: 1000,
      configurable: true,
    });

    const release = lockScroll();
    expect(document.body.style.paddingInlineEnd).toBe("15px");
    expect(document.body.style.paddingRight).toBe("");
    release();
    expect(document.body.style.paddingInlineEnd).toBe("");
  });

  it("ignores a release called twice", () => {
    // A double unmount must not decrement the count twice and unlock early.
    const first = lockScroll();
    const second = lockScroll();
    first();
    first();
    expect(document.body.style.overflow).toBe("hidden");
    second();
    expect(scrollLockDepth()).toBe(0);
  });
});
