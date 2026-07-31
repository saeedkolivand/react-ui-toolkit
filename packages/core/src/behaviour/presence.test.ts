import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPresence } from "./presence";

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

  it("survives a reopen inside the same frame", async () => {
    // The pending frame could not be cancelled by checking `present`: only an
    // exit sets it false, so it is always still true when the frame runs. A
    // close then reopen before that frame — routine for a tooltip, and what a
    // double-invoked effect produces — attached to the *enter* animation and
    // unmounted an open node when it finished.
    stubAnimations(true);
    const presence = createPresence(true);
    presence.setNode(node());

    presence.setOpen(false);
    presence.setOpen(true);
    await frame();
    node().dispatchEvent(new Event("animationend"));

    expect(presence.present).toBe(true);
  });

  it("unmounts where getAnimations does not exist, rather than never", async () => {
    // Not every environment has it — jsdom does not, nor do embedded engines.
    // Calling it unguarded threw inside a requestAnimationFrame callback, where
    // nothing catches the error, so the node stayed mounted forever. Absent has
    // to read as "cannot be animating".
    // Removed from the prototype, which is where `stubAnimations` puts it —
    // deleting the element's own property would find nothing to delete.
    const original = Element.prototype.getAnimations;
    // @ts-expect-error — removing an optional DOM method is the whole point.
    delete Element.prototype.getAnimations;

    try {
      const presence = createPresence(true);
      presence.setNode(node());
      presence.setOpen(false);
      await frame();
      expect(presence.present).toBe(false);
    } finally {
      Element.prototype.getAnimations = original;
    }
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
