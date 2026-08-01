import type { ToastPlacement } from "../types";

export type ToastType = "info" | "success" | "error" | "warning" | "loading";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

/**
 * `title` and `description` are `unknown` because `core` has no framework in it
 * and each adapter renders a different node type. The adapter casts once, at
 * the one place it renders them.
 */
export interface ToastOptions {
  id?: string;
  type?: ToastType;
  title?: unknown;
  description?: unknown;
  action?: ToastAction;
  closable?: boolean;
  /** Milliseconds on screen. `Infinity` never auto-dismisses. */
  duration?: number;
  /**
   * Milliseconds between `dismiss()` and removal — the window the exit
   * animation runs in. A toast stays in the list as `data-state="closed"` for
   * this long, which is the presence rule in CLAUDE.md: unmounting the instant
   * it closes means the closed state never gets a frame.
   */
  removeDelay?: number;
  onStatusChange?: (state: ToastState) => void;
}

export type ToastState = "open" | "closed";

export interface ToastItem extends ToastOptions {
  id: string;
  type: ToastType;
  duration: number;
  removeDelay: number;
  state: ToastState;
}

export interface ToastQueueOptions {
  placement?: ToastPlacement;
  /** Rendered at once. The rest wait rather than being dropped. */
  max?: number;
  duration?: number;
  removeDelay?: number;
}

export interface ToastQueue {
  readonly placement: ToastPlacement;
  create(options?: ToastOptions): string;
  info(options?: ToastOptions): string;
  success(options?: ToastOptions): string;
  error(options?: ToastOptions): string;
  warning(options?: ToastOptions): string;
  loading(options?: ToastOptions): string;
  update(id: string, options: ToastOptions): void;
  /** No id dismisses everything currently on screen. */
  dismiss(id?: string): void;
  remove(id: string): void;
  /** Hovering or focusing the group holds every countdown. */
  pause(): void;
  resume(): void;
  subscribe(listener: () => void): () => void;
  /**
   * Stable between changes, so `useSyncExternalStore` and its equivalents do
   * not see a new array on every render and loop.
   */
  getToasts(): readonly ToastItem[];
}

// `loading` has no natural end — it ends when the thing it reports ends.
const DEFAULT_DURATION: Record<ToastType, number> = {
  info: 5000,
  success: 5000,
  warning: 5000,
  error: 5000,
  loading: Number.POSITIVE_INFINITY,
};

interface Countdown {
  remaining: number;
  startedAt: number;
  handle: ReturnType<typeof setTimeout> | undefined;
}

/**
 * The queue is a plain store with no framework in it, so a toaster is a
 * module-level value rather than a context or a provider:
 *
 *   export const toaster = createToastQueue();   // once, anywhere
 *   <Toaster toaster={toaster} />                // once, at the app root
 *   toaster.success({ title: "Saved" })          // anywhere, no hook
 */
export function createToastQueue(options: ToastQueueOptions = {}): ToastQueue {
  const {
    placement = "bottom-end",
    max = 5,
    duration: groupDuration,
    // Paired with the flow exit transition in `toast.css`, which is set to
    // `--ck-duration-md` for exactly this reason. A shorter delay than the
    // transition clips the exit; a longer one leaves an invisible node in the
    // list holding a slot.
    removeDelay: groupRemoveDelay = 200,
  } = options;

  let seq = 0;
  let paused = false;
  let live: ToastItem[] = [];
  // Overflow waits here rather than being dropped: a burst of six with `max: 5`
  // should still show the sixth, not swallow it.
  const waiting: ToastItem[] = [];
  const countdowns = new Map<string, Countdown>();
  const listeners = new Set<() => void>();
  let snapshot: readonly ToastItem[] = live;

  const publish = () => {
    snapshot = live;
    for (const listener of listeners) listener();
  };

  const start = (item: ToastItem) => {
    if (!Number.isFinite(item.duration)) return;
    const countdown = countdowns.get(item.id) ?? {
      remaining: item.duration,
      startedAt: 0,
      handle: undefined,
    };
    countdown.startedAt = Date.now();
    countdown.handle = setTimeout(() => dismiss(item.id), countdown.remaining);
    countdowns.set(item.id, countdown);
  };

  const hold = (id: string) => {
    const countdown = countdowns.get(id);
    if (!countdown || countdown.handle === undefined) return;
    clearTimeout(countdown.handle);
    countdown.handle = undefined;
    // Bank what is left, so resuming does not restart the full duration.
    countdown.remaining = Math.max(0, countdown.remaining - (Date.now() - countdown.startedAt));
  };

  const promote = () => {
    while (live.length < max && waiting.length > 0) {
      const next = waiting.shift()!;
      live = [...live, next];
      if (!paused) start(next);
    }
  };

  const patch = (id: string, changes: Partial<ToastItem>) => {
    const index = live.findIndex(item => item.id === id);
    if (index < 0) return undefined;
    const updated = { ...live[index]!, ...changes };
    live = [...live.slice(0, index), updated, ...live.slice(index + 1)];
    return updated;
  };

  const create = (o: ToastOptions = {}): string => {
    const id = o.id ?? `ck-toast-${++seq}`;
    // A repeated id updates rather than stacking a duplicate — which is what
    // makes `create({ id: "save" })` usable as an upsert.
    if (live.some(item => item.id === id) || waiting.some(item => item.id === id)) {
      update(id, o);
      return id;
    }
    const type = o.type ?? "info";
    const item: ToastItem = {
      ...o,
      id,
      type,
      duration: o.duration ?? groupDuration ?? DEFAULT_DURATION[type],
      removeDelay: o.removeDelay ?? groupRemoveDelay,
      state: "open",
    };
    if (live.length >= max) {
      waiting.push(item);
    } else {
      live = [...live, item];
      if (!paused) start(item);
    }
    publish();
    return id;
  };

  const update = (id: string, o: ToastOptions) => {
    const index = waiting.findIndex(item => item.id === id);
    if (index >= 0) {
      waiting[index] = { ...waiting[index]!, ...o, id };
      return;
    }
    const before = live.find(item => item.id === id);
    if (!before) return;
    const updated = patch(id, { ...o, id, type: o.type ?? before.type });
    // A new duration restarts the countdown; without this, `update` could only
    // ever shorten a toast's life by accident.
    if (updated && o.duration !== undefined && updated.state === "open") {
      hold(id);
      countdowns.delete(id);
      start(updated);
    }
    publish();
  };

  const dismiss = (id?: string) => {
    if (id === undefined) {
      for (const item of live) dismiss(item.id);
      // Waiting toasts have never been seen, so they go without an exit.
      waiting.length = 0;
      return;
    }
    const waitingIndex = waiting.findIndex(item => item.id === id);
    if (waitingIndex >= 0) {
      waiting.splice(waitingIndex, 1);
      return;
    }
    const current = live.find(item => item.id === id);
    if (!current || current.state === "closed") return;
    hold(id);
    countdowns.delete(id);
    const closed = patch(id, { state: "closed" });
    setTimeout(() => remove(id), current.removeDelay);
    publish();
    closed?.onStatusChange?.("closed");
  };

  const remove = (id: string) => {
    const index = live.findIndex(item => item.id === id);
    if (index < 0) return;
    hold(id);
    countdowns.delete(id);
    live = [...live.slice(0, index), ...live.slice(index + 1)];
    promote();
    publish();
  };

  const withType =
    (type: ToastType) =>
    (o: ToastOptions = {}) =>
      create({ ...o, type });

  return {
    placement,
    create,
    info: withType("info"),
    success: withType("success"),
    error: withType("error"),
    warning: withType("warning"),
    loading: withType("loading"),
    update,
    dismiss,
    remove,
    pause() {
      if (paused) return;
      paused = true;
      for (const item of live) if (item.state === "open") hold(item.id);
    },
    resume() {
      if (!paused) return;
      paused = false;
      for (const item of live) if (item.state === "open") start(item);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getToasts: () => snapshot,
  };
}
