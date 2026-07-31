import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFocusTrap } from "./focus-trap";
import { createPresence } from "./presence";

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
});

describe("presence", () => {
  const frame = () => new Promise(resolve => requestAnimationFrame(resolve));

  /** jsdom has no Web Animations; the exit path only asks whether one is running. */
  const stubAnimations = (running: boolean) => {
    const animation = { playState: running ? "running" : "finished" } as Animation;
    Element.prototype.getAnimations = () => (running ? [animation] : []);
  };

  beforeEach(() => {
    document.body.innerHTML = '<div id="node"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.useRealTimers();
  });

  const node = () => document.getElementById("node")!;

  it("is present immediately when opened", () => {
    stubAnimations(false);
    const presence = createPresence(false);
    presence.setOpen(true);
    expect(presence.present).toBe(true);
  });

  it("unmounts at once when nothing is animating", async () => {
    stubAnimations(false);
    const presence = createPresence(true);
    presence.setNode(node());
    presence.setOpen(false);

    await frame();
    expect(presence.present).toBe(false);
  });

  it("stays present until the animation ends", async () => {
    // The whole point: without this, `data-state="closed"` never gets a frame
    // and every exit animation silently does nothing.
    stubAnimations(true);
    const presence = createPresence(true);
    presence.setNode(node());
    presence.setOpen(false);

    await frame();
    expect(presence.present).toBe(true);

    node().dispatchEvent(new Event("animationend"));
    expect(presence.present).toBe(false);
  });

  it("ignores a child's animation ending", async () => {
    stubAnimations(true);
    const presence = createPresence(true);
    presence.setNode(node());
    presence.setOpen(false);
    await frame();

    const child = document.createElement("span");
    node().append(child);
    child.dispatchEvent(new Event("animationend", { bubbles: true }));
    // Unmounting here would cut the parent's own animation short.
    expect(presence.present).toBe(true);

    node().dispatchEvent(new Event("animationend"));
    expect(presence.present).toBe(false);
  });

  it("unmounts on the timeout when no end event ever arrives", async () => {
    vi.useFakeTimers();
    stubAnimations(true);
    const presence = createPresence(true);
    presence.setNode(node());
    presence.setOpen(false);

    // rAF under fake timers still needs a tick to run the queued callback.
    await vi.advanceTimersByTimeAsync(20);
    expect(presence.present).toBe(true);

    await vi.advanceTimersByTimeAsync(1000);
    expect(presence.present).toBe(false);
  });

  it("cancels a pending exit when reopened", async () => {
    stubAnimations(true);
    const onChange = vi.fn();
    const presence = createPresence(true, { onChange });
    presence.setNode(node());
    presence.setOpen(false);
    await frame();

    presence.setOpen(true);
    node().dispatchEvent(new Event("animationend"));
    // The stale end event must not unmount a node that reopened.
    expect(presence.present).toBe(true);
  });

  it("reports changes once each", async () => {
    stubAnimations(false);
    const onChange = vi.fn();
    const presence = createPresence(true, { onChange });
    presence.setNode(node());

    presence.setOpen(true);
    expect(onChange).not.toHaveBeenCalled();

    presence.setOpen(false);
    await frame();
    expect(onChange).toHaveBeenCalledExactlyOnceWith(false);
  });
});
