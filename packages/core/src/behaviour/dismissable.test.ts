import { afterEach, describe, expect, it, vi } from "vitest";
import { dismissableDepth, pushDismissable } from "./dismissable";
import { lockScroll, scrollLockDepth } from "./scroll-lock";
import { getTabbables, isTabbable } from "./dom";

const html = (markup: string) => {
  document.body.innerHTML = markup;
  return document.body;
};

const press = (key: string, target: EventTarget = document) =>
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));

const pointerDown = (target: EventTarget) =>
  target.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, cancelable: true }));

afterEach(() => {
  document.body.innerHTML = "";
});

describe("dismissable", () => {
  it("closes on Escape", () => {
    const node = html('<div id="layer"></div>').querySelector<HTMLElement>("#layer");
    const onDismiss = vi.fn();
    const remove = pushDismissable(() => node, { onDismiss });

    press("Escape");
    expect(onDismiss).toHaveBeenCalledWith("escape");
    remove();
  });

  it("closes on a pointer press outside", () => {
    const body = html('<div id="layer"></div><button id="outside">x</button>');
    const onDismiss = vi.fn();
    const remove = pushDismissable(() => body.querySelector("#layer"), { onDismiss });

    pointerDown(body.querySelector("#outside")!);
    expect(onDismiss).toHaveBeenCalledWith("outside");
    remove();
  });

  it("ignores a press inside", () => {
    const body = html('<div id="layer"><button id="inner">x</button></div>');
    const onDismiss = vi.fn();
    const remove = pushDismissable(() => body.querySelector("#layer"), { onDismiss });

    pointerDown(body.querySelector("#inner")!);
    expect(onDismiss).not.toHaveBeenCalled();
    remove();
  });

  it("ignores a press on an excluded node, such as the trigger", () => {
    const body = html('<button id="trigger">x</button><div id="layer"></div>');
    const onDismiss = vi.fn();
    const remove = pushDismissable(() => body.querySelector("#layer"), {
      onDismiss,
      exclude: () => [body.querySelector<HTMLElement>("#trigger")],
    });

    pointerDown(body.querySelector("#trigger")!);
    // Without this the trigger closes the layer and immediately reopens it,
    // which reads as the layer never opening at all.
    expect(onDismiss).not.toHaveBeenCalled();
    remove();
  });

  describe("layer stack", () => {
    it("dismisses only the topmost layer on Escape", () => {
      const body = html('<div id="one"></div><div id="two"></div>');
      const first = vi.fn();
      const second = vi.fn();
      const removeFirst = pushDismissable(() => body.querySelector("#one"), {
        onDismiss: first,
      });
      const removeSecond = pushDismissable(() => body.querySelector("#two"), {
        onDismiss: second,
      });

      press("Escape");
      expect(second).toHaveBeenCalledTimes(1);
      expect(first).not.toHaveBeenCalled();

      removeSecond();
      press("Escape");
      expect(first).toHaveBeenCalledTimes(1);
      removeFirst();
    });

    it("does not dismiss an outer layer when the inner one is clicked", () => {
      // A click inside the second dialog is "outside" the first, and would
      // close it from underneath without the stack.
      const body = html('<div id="one"></div><div id="two"><button id="inner">x</button></div>');
      const first = vi.fn();
      const removeFirst = pushDismissable(() => body.querySelector("#one"), {
        onDismiss: first,
      });
      const removeSecond = pushDismissable(() => body.querySelector("#two"), {
        onDismiss: vi.fn(),
      });

      pointerDown(body.querySelector("#inner")!);
      expect(first).not.toHaveBeenCalled();
      removeSecond();
      removeFirst();
    });

    it("removes by identity, so layers may close out of order", () => {
      const body = html('<div id="one"></div><div id="two"></div>');
      const first = vi.fn();
      const second = vi.fn();
      const removeFirst = pushDismissable(() => body.querySelector("#one"), {
        onDismiss: first,
      });
      const removeSecond = pushDismissable(() => body.querySelector("#two"), {
        onDismiss: second,
      });

      // The outer layer closes first — popping would remove the wrong one and
      // leave the inner layer unreachable.
      removeFirst();
      press("Escape");
      expect(second).toHaveBeenCalledTimes(1);
      expect(first).not.toHaveBeenCalled();
      removeSecond();
    });

    it("empties the stack and is safe to remove twice", () => {
      const remove = pushDismissable(() => null, { onDismiss: vi.fn() });
      expect(dismissableDepth()).toBe(1);
      remove();
      remove();
      expect(dismissableDepth()).toBe(0);
    });
  });

  it("respects escape: false and outside: false", () => {
    const body = html('<div id="layer"></div><button id="outside">x</button>');
    const onDismiss = vi.fn();
    const remove = pushDismissable(() => body.querySelector("#layer"), {
      onDismiss,
      escape: false,
      outside: false,
    });

    press("Escape");
    pointerDown(body.querySelector("#outside")!);
    expect(onDismiss).not.toHaveBeenCalled();
    remove();
  });

  it("leaves an already-handled Escape alone", () => {
    const onDismiss = vi.fn();
    const remove = pushDismissable(() => null, { onDismiss });

    const event = new KeyboardEvent("keydown", { key: "Escape", cancelable: true });
    event.preventDefault();
    document.dispatchEvent(event);

    expect(onDismiss).not.toHaveBeenCalled();
    remove();
  });
});

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

describe("tabbable query", () => {
  it("excludes disabled and negative-tabindex elements", () => {
    const body = html(`
      <button id="a">a</button>
      <button id="b" disabled>b</button>
      <div id="c" tabindex="-1">c</div>
      <a id="d" href="#">d</a>
      <a id="e">e</a>
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["a", "d"]);
  });

  it("sorts positive tabindex ahead of document order", () => {
    // Using positive tabindex is a mistake, but honouring it means a consumer's
    // markup behaves the same inside a trap as outside one.
    const body = html(`
      <button id="natural">n</button>
      <button id="second" tabindex="2">2</button>
      <button id="first" tabindex="1">1</button>
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["first", "second", "natural"]);
  });

  it("treats a radio group as one stop", () => {
    const body = html(`
      <input type="radio" name="g" id="r1">
      <input type="radio" name="g" id="r2" checked>
      <input type="radio" name="g" id="r3">
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["r2"]);
  });

  it("uses the first radio when none is checked", () => {
    const body = html(`
      <input type="radio" name="g" id="r1">
      <input type="radio" name="g" id="r2">
    `);
    expect(getTabbables(body).map(el => el.id)).toEqual(["r1"]);
  });

  it("excludes anything inside an inert subtree", () => {
    const body = html('<div inert><button id="a">a</button></div>');
    expect(isTabbable(body.querySelector<HTMLElement>("#a")!)).toBe(false);
  });
});
