import * as toast from "@zag-js/toast";

export type Toaster = toast.Store;
export type ToasterOptions = toast.StoreProps;
export type ToastOptions = toast.Options;
export type ToastType = toast.Type;

/**
 * The toast queue is a plain store with no framework in it, so the toaster is a
 * module-level singleton rather than a context or a provider.
 *
 * v0 needed `NotificationProvider` (a context, a useState queue, four
 * useCallbacks, a portal and an AnimatePresence) plus `useNotification()` in
 * every consumer. This replaces all of it:
 *
 *   export const toaster = createToaster();   // once, anywhere
 *   <Toaster :toaster="toaster" />            // once, at the app root
 *   toaster.success({ title: "Saved" })       // anywhere, no hook, no inject
 *
 * The same three lines work identically in React, Vue, Svelte and Angular —
 * there is no provider, context or DI token in any of them.
 */
export function createToaster(options: ToasterOptions = {}): Toaster {
  return toast.createStore({
    placement: "bottom-end",
    // v0 capped at 5 and dropped the rest; zag queues the overflow instead.
    max: 5,
    duration: 5000,
    ...options,
  });
}
