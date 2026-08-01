import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createToastQueue } from "./toast-queue";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const ids = (q: ReturnType<typeof createToastQueue>) => q.getToasts().map(t => t.id);
const states = (q: ReturnType<typeof createToastQueue>) => q.getToasts().map(t => t.state);

describe("createToastQueue", () => {
  it("starts empty", () => {
    expect(createToastQueue().getToasts()).toHaveLength(0);
  });

  it("returns the id it created", () => {
    const q = createToastQueue();
    expect(q.create({ title: "Saved" })).toBe(ids(q)[0]);
  });

  it("defaults the type to info and takes an explicit one", () => {
    const q = createToastQueue();
    q.create({ title: "a" });
    q.success({ title: "b" });
    expect(q.getToasts().map(t => t.type)).toEqual(["info", "success"]);
  });

  it("notifies subscribers and stops after unsubscribe", () => {
    const q = createToastQueue();
    const listener = vi.fn();
    const off = q.subscribe(listener);
    q.create({ title: "a" });
    expect(listener).toHaveBeenCalledTimes(1);
    off();
    q.create({ title: "b" });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("keeps the snapshot identical between changes", () => {
    const q = createToastQueue();
    q.create({ title: "a" });
    const first = q.getToasts();
    expect(q.getToasts()).toBe(first);
    q.create({ title: "b" });
    // A new array only when something actually changed — otherwise a
    // `useSyncExternalStore` consumer re-renders forever.
    expect(q.getToasts()).not.toBe(first);
  });

  it("auto-dismisses after the duration, then removes after the delay", () => {
    const q = createToastQueue();
    q.create({ title: "a", duration: 1000, removeDelay: 200 });
    vi.advanceTimersByTime(999);
    expect(states(q)).toEqual(["open"]);
    vi.advanceTimersByTime(1);
    // Still present, so `data-state="closed"` gets a frame to animate in.
    expect(states(q)).toEqual(["closed"]);
    vi.advanceTimersByTime(199);
    expect(q.getToasts()).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(q.getToasts()).toHaveLength(0);
  });

  it("never auto-dismisses a loading toast", () => {
    const q = createToastQueue();
    q.loading({ title: "Uploading" });
    vi.advanceTimersByTime(60_000);
    expect(states(q)).toEqual(["open"]);
  });

  it("holds the countdown while paused and resumes with the remainder", () => {
    const q = createToastQueue();
    q.create({ title: "a", duration: 1000 });
    vi.advanceTimersByTime(600);
    q.pause();
    vi.advanceTimersByTime(10_000);
    expect(states(q)).toEqual(["open"]);
    q.resume();
    vi.advanceTimersByTime(399);
    expect(states(q)).toEqual(["open"]);
    vi.advanceTimersByTime(1);
    expect(states(q)).toEqual(["closed"]);
  });

  it("ignores a second pause and a resume that never paused", () => {
    const q = createToastQueue();
    q.create({ title: "a", duration: 1000 });
    vi.advanceTimersByTime(400);
    q.pause();
    q.pause();
    q.resume();
    // 600 left, not 1000: the repeated pause must not bank the remainder twice.
    vi.advanceTimersByTime(600);
    expect(states(q)).toEqual(["closed"]);
  });

  it("dismisses by id and fires onStatusChange once", () => {
    const q = createToastQueue();
    const onStatusChange = vi.fn();
    const id = q.create({ title: "a", onStatusChange });
    q.dismiss(id);
    q.dismiss(id);
    expect(states(q)).toEqual(["closed"]);
    expect(onStatusChange).toHaveBeenCalledExactlyOnceWith("closed");
  });

  it("dismisses everything when given no id", () => {
    const q = createToastQueue();
    q.create({ title: "a" });
    q.create({ title: "b" });
    q.dismiss();
    expect(states(q)).toEqual(["closed", "closed"]);
  });

  it("updates in place rather than adding", () => {
    const q = createToastQueue();
    const id = q.create({ title: "Uploading", type: "loading" });
    q.update(id, { title: "Uploaded", type: "success" });
    expect(q.getToasts()).toHaveLength(1);
    expect(q.getToasts()[0]).toMatchObject({ title: "Uploaded", type: "success" });
  });

  it("treats a repeated id as an update, not a duplicate", () => {
    const q = createToastQueue();
    q.create({ id: "save", title: "Saving" });
    q.create({ id: "save", title: "Saved" });
    expect(q.getToasts()).toHaveLength(1);
    expect(q.getToasts()[0]!.title).toBe("Saved");
  });

  it("restarts the countdown when an update changes the duration", () => {
    const q = createToastQueue();
    const id = q.create({ title: "a", duration: 1000 });
    vi.advanceTimersByTime(900);
    q.update(id, { duration: 1000 });
    vi.advanceTimersByTime(999);
    expect(states(q)).toEqual(["open"]);
    vi.advanceTimersByTime(1);
    expect(states(q)).toEqual(["closed"]);
  });

  it("keeps the countdown running when an update leaves the duration alone", () => {
    const q = createToastQueue();
    const id = q.create({ title: "a", duration: 1000 });
    vi.advanceTimersByTime(900);
    q.update(id, { title: "b" });
    vi.advanceTimersByTime(100);
    expect(states(q)).toEqual(["closed"]);
  });

  it("re-derives the duration when an update changes the type", () => {
    const q = createToastQueue();
    const id = q.loading({ title: "Uploading" });
    vi.advanceTimersByTime(60_000);
    expect(states(q)).toEqual(["open"]);
    // The type carries the duration with it. Resolving once at create left this
    // toast infinite, so the update-in-place path the docs advertise hung on
    // screen forever.
    q.update(id, { title: "Uploaded", type: "success" });
    vi.advanceTimersByTime(4999);
    expect(states(q)).toEqual(["open"]);
    vi.advanceTimersByTime(1);
    expect(states(q)).toEqual(["closed"]);
  });

  it("stops counting when an update turns a toast into a loading one", () => {
    const q = createToastQueue();
    const id = q.success({ title: "Saved" });
    q.update(id, { title: "Saving again", type: "loading" });
    vi.advanceTimersByTime(60_000);
    expect(states(q)).toEqual(["open"]);
  });

  it("keeps a duration the caller chose across a type change", () => {
    const q = createToastQueue();
    const id = q.create({ title: "a", type: "info", duration: 1000 });
    q.update(id, { type: "success" });
    vi.advanceTimersByTime(999);
    expect(states(q)).toEqual(["open"]);
    vi.advanceTimersByTime(1);
    expect(states(q)).toEqual(["closed"]);
  });

  it("never expires a loading toast on the group duration", () => {
    const q = createToastQueue({ duration: 100 });
    q.loading({ title: "Uploading" });
    // A group default replaces the finite per-type defaults, not the infinite
    // one: loading ends when the work it reports ends.
    vi.advanceTimersByTime(60_000);
    expect(states(q)).toEqual(["open"]);
  });

  it("holds overflow back rather than dropping it", () => {
    const q = createToastQueue({ max: 2 });
    q.create({ id: "a", title: "a", duration: 1000 });
    q.create({ id: "b", title: "b", duration: 1000 });
    q.create({ id: "c", title: "c", duration: 1000 });
    expect(ids(q)).toEqual(["a", "b"]);
    // `a` closes at 1000 and leaves at 1200, which is when `c` gets its slot.
    vi.advanceTimersByTime(1200);
    expect(ids(q)).toContain("c");
  });

  it("re-derives the duration of a waiting toast too", () => {
    const q = createToastQueue({ max: 1 });
    q.create({ id: "a", title: "a", duration: 1000 });
    q.loading({ id: "b", title: "Uploading" });
    // Retyped while still held back, so the re-derivation has to happen on the
    // waiting branch — otherwise it is promoted still infinite and never goes.
    q.update("b", { title: "Uploaded", type: "success" });
    vi.advanceTimersByTime(1200);
    expect(ids(q)).toEqual(["b"]);
    vi.advanceTimersByTime(5000);
    expect(states(q)).toEqual(["closed"]);
  });

  it("keeps a duration chosen while waiting across a later type change", () => {
    const q = createToastQueue({ max: 1 });
    q.create({ id: "a", title: "a", duration: 1000 });
    q.create({ id: "b", title: "b", type: "info" });
    q.update("b", { duration: 2000 });
    // `chosenDurations` used to be recorded after the waiting branch returned,
    // so a duration that arrived this way was never noted and the retype below
    // silently replaced it with the new type's default.
    q.update("b", { type: "success" });
    vi.advanceTimersByTime(1200);
    expect(ids(q)).toEqual(["b"]);
    vi.advanceTimersByTime(1999);
    expect(states(q)).toEqual(["open"]);
    vi.advanceTimersByTime(1);
    expect(states(q)).toEqual(["closed"]);
  });

  it("does not start a waiting toast's countdown before it is shown", () => {
    const q = createToastQueue({ max: 1 });
    q.create({ id: "a", title: "a", duration: 1000 });
    q.create({ id: "b", title: "b", duration: 1000 });
    vi.advanceTimersByTime(1200);
    // `b` has only just appeared, so its full second is still ahead of it.
    expect(ids(q)).toEqual(["b"]);
    vi.advanceTimersByTime(999);
    expect(states(q)).toEqual(["open"]);
  });

  it("does not run a promoted toast's countdown while paused", () => {
    const q = createToastQueue({ max: 1 });
    q.create({ id: "a", title: "a", duration: 1000 });
    q.create({ id: "b", title: "b", duration: 1000 });
    q.pause();
    q.remove("a");
    expect(ids(q)).toEqual(["b"]);
    vi.advanceTimersByTime(10_000);
    expect(states(q)).toEqual(["open"]);
  });

  it("dismisses a waiting toast without ever showing it", () => {
    const q = createToastQueue({ max: 1 });
    q.create({ id: "a", title: "a", duration: 1000 });
    q.create({ id: "b", title: "b" });
    q.dismiss("b");
    vi.advanceTimersByTime(1200);
    expect(ids(q)).toEqual([]);
  });

  it("does not start a countdown when an update lands while paused", () => {
    const q = createToastQueue();
    const id = q.loading({ title: "Uploading" });
    q.pause();
    // The promise-toast path: held open under the pointer, the promise
    // resolves, and the update must not expire it under the hand reaching for
    // its action.
    q.update(id, { title: "Uploaded", type: "success", duration: 1000 });
    vi.advanceTimersByTime(10_000);
    expect(states(q)).toEqual(["open"]);
    q.resume();
    vi.advanceTimersByTime(1000);
    expect(states(q)).toEqual(["closed"]);
  });

  it("re-creates an id that is still inside its exit window", () => {
    const q = createToastQueue();
    q.create({ id: "save", title: "Saving", removeDelay: 200 });
    q.dismiss("save");
    q.create({ id: "save", title: "Saved" });
    // Open, not a patched corpse — and the earlier toast's pending removal must
    // not delete the replacement when it fires.
    expect(states(q)).toEqual(["open"]);
    expect(q.getToasts()[0]!.title).toBe("Saved");
    vi.advanceTimersByTime(400);
    expect(q.getToasts()).toHaveLength(1);
    expect(states(q)).toEqual(["open"]);
  });

  it("removes immediately when asked, skipping the exit window", () => {
    const q = createToastQueue();
    const id = q.create({ title: "a" });
    q.remove(id);
    expect(q.getToasts()).toHaveLength(0);
  });

  it("survives a remove that already happened", () => {
    const q = createToastQueue();
    const id = q.create({ title: "a", duration: 1000, removeDelay: 200 });
    q.dismiss(id);
    q.remove(id);
    // The removeDelay timer still fires against an id that is gone.
    expect(() => vi.advanceTimersByTime(500)).not.toThrow();
    expect(q.getToasts()).toHaveLength(0);
  });

  it("carries the placement it was given", () => {
    expect(createToastQueue({ placement: "top-start" }).placement).toBe("top-start");
    expect(createToastQueue().placement).toBe("bottom-end");
  });

  it("lets the group duration override the per-type default", () => {
    const q = createToastQueue({ duration: 100 });
    q.create({ title: "a" });
    vi.advanceTimersByTime(100);
    expect(states(q)).toEqual(["closed"]);
  });

  it("starts a toast created while paused only on resume", () => {
    const q = createToastQueue();
    q.pause();
    q.create({ title: "a", duration: 1000 });
    vi.advanceTimersByTime(5000);
    expect(states(q)).toEqual(["open"]);
    q.resume();
    vi.advanceTimersByTime(1000);
    expect(states(q)).toEqual(["closed"]);
  });
});
