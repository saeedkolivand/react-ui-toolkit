import { afterEach, describe, expect, it, vi } from "vitest";
import { createFocusTrap, focusTrapDepth } from "./focus-trap";

const html = (markup: string) => {
  document.body.innerHTML = markup;
  return document.body;
};

/**
 * jsdom does not move focus on Tab, so the assertion is on what the trap
 * *decides*: whether it claimed the key, and where it sent focus. That is
 * exactly the logic worth unit-testing; the browser half is the parity suite's.
 */
const tab = (shiftKey = false) => {
  const event = new KeyboardEvent("keydown", { key: "Tab", shiftKey, cancelable: true });
  document.dispatchEvent(event);
  return event;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("focus trap", () => {
  const markup = `
    <button id="before">before</button>
    <div id="trap" tabindex="-1">
      <button id="first">first</button>
      <button id="middle">middle</button>
      <button id="last">last</button>
    </div>
    <button id="after">after</button>
  `;

  const el = (id: string) => document.getElementById(id)!;

  it("focuses the first tabbable element on activate", () => {
    html(markup);
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    expect(document.activeElement?.id).toBe("first");
    trap.deactivate();
  });

  it("honours an explicit initial focus", () => {
    html(markup);
    const trap = createFocusTrap(() => el("trap"), { initialFocus: () => el("middle") });
    trap.activate();
    expect(document.activeElement?.id).toBe("middle");
    trap.deactivate();
  });

  it("wraps forward from the last element", () => {
    html(markup);
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    el("last").focus();

    const event = tab();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("first");
    trap.deactivate();
  });

  it("wraps backward from the first element", () => {
    // The direction most implementations get wrong, because Shift+Tab from the
    // first element is the only case the browser would have handled silently.
    html(markup);
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    el("first").focus();

    const event = tab(true);
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("last");
    trap.deactivate();
  });

  it("leaves Tab alone in the middle of the trap", () => {
    html(markup);
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    el("middle").focus();

    expect(tab().defaultPrevented).toBe(false);
    trap.deactivate();
  });

  it("reports which edge wrapped", () => {
    html(markup);
    const onWrap = vi.fn();
    const trap = createFocusTrap(() => el("trap"), { onWrap });
    trap.activate();

    el("last").focus();
    tab();
    el("first").focus();
    tab(true);

    expect(onWrap.mock.calls.map(c => c[0])).toEqual(["forward", "backward"]);
    trap.deactivate();
  });

  it("pulls focus back when it has escaped", () => {
    html(markup);
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    el("after").focus();

    const event = tab();
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe("first");
    trap.deactivate();
  });

  it("holds focus on the container when nothing inside is tabbable", () => {
    html('<div id="trap" tabindex="-1"><span>text</span></div>');
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    expect(document.activeElement?.id).toBe("trap");

    // An empty dialog is still a trap; Tab must not escape it.
    expect(tab().defaultPrevented).toBe(true);
    trap.deactivate();
  });

  it("restores focus to whatever had it before", () => {
    html(markup);
    el("before").focus();
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    expect(document.activeElement?.id).toBe("first");

    trap.deactivate();
    expect(document.activeElement?.id).toBe("before");
  });

  it("captures the return target at activate, not at construction", () => {
    // Adapters build the trap at mount — mandatory in Angular, where the
    // machine must be a field initializer. Capturing at construction records
    // whatever had focus then, usually <body>, and close sends focus there.
    html(markup);
    const trap = createFocusTrap(() => el("trap"));
    el("before").focus();
    trap.activate();
    trap.deactivate();
    expect(document.activeElement?.id).toBe("before");
  });

  it("honours an explicit return target", () => {
    html(markup);
    el("before").focus();
    const trap = createFocusTrap(() => el("trap"), { returnFocus: () => el("after") });
    trap.activate();
    trap.deactivate();
    expect(document.activeElement?.id).toBe("after");
  });

  it("does not steal focus that moved elsewhere during close", () => {
    // Something deliberately took focus while closing; yanking it back is worse
    // than leaving it.
    html(markup);
    el("before").focus();
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    el("after").focus();

    trap.deactivate();
    expect(document.activeElement?.id).toBe("after");
  });

  it("skips restoring to an element that has been removed", () => {
    html(markup);
    el("before").focus();
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    el("before").remove();

    expect(() => trap.deactivate()).not.toThrow();
  });

  it("stops handling Tab once deactivated", () => {
    html(markup);
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    trap.deactivate();
    el("last").focus();

    expect(tab().defaultPrevented).toBe(false);
  });

  it("ignores a second activate", () => {
    html(markup);
    const trap = createFocusTrap(() => el("trap"));
    trap.activate();
    el("middle").focus();
    trap.activate();
    // Re-running initial focus would yank the user back to the first element.
    expect(document.activeElement?.id).toBe("middle");
    trap.deactivate();
  });

  describe("nesting", () => {
    it("gives Tab to the topmost trap only, and hands it back on deactivate", () => {
      // Both traps used to keep their own document listener, so both fired and
      // the outer one — whose container is inert while an overlay sits above it,
      // hence empty of tabbables — cancelled every Tab before the inner could
      // act on it.
      const body = html(`
        <div id="outer"><button id="o1">o1</button><button id="o2">o2</button></div>
        <div id="inner"><button id="i1">i1</button><button id="i2">i2</button></div>
      `);
      const outer = createFocusTrap(() => body.querySelector("#outer"));
      const inner = createFocusTrap(() => body.querySelector("#inner"));

      outer.activate();
      inner.activate();
      expect(focusTrapDepth()).toBe(2);

      // At the inner trap's last element, so only the topmost wrapping is visible.
      body.querySelector<HTMLElement>("#i2")!.focus();
      tab();
      expect(document.activeElement).toBe(body.querySelector("#i1"));

      inner.deactivate();
      expect(focusTrapDepth()).toBe(1);

      body.querySelector<HTMLElement>("#o2")!.focus();
      tab();
      expect(document.activeElement).toBe(body.querySelector("#o1"));

      outer.deactivate();
      expect(focusTrapDepth()).toBe(0);
    });

    it("removes by identity, so traps can close out of order", () => {
      const body = html('<div id="a"><button>a</button></div><div id="b"><button>b</button></div>');
      const a = createFocusTrap(() => body.querySelector("#a"));
      const b = createFocusTrap(() => body.querySelector("#b"));

      a.activate();
      b.activate();
      // The one underneath leaves first — popping would drop the wrong entry.
      a.deactivate();
      expect(focusTrapDepth()).toBe(1);

      body.querySelector<HTMLElement>("#b")!.querySelector("button")!.focus();
      tab();
      expect(document.activeElement).toBe(body.querySelector("#b")!.querySelector("button"));

      b.deactivate();
      expect(focusTrapDepth()).toBe(0);
    });
  });
});
