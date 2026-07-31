import { afterEach, describe, expect, it, vi } from "vitest";
import { dismissableDepth, pushDismissable } from "./dismissable";

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
