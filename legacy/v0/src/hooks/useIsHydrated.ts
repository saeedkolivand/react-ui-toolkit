import { useSyncExternalStore } from "react";

// Never changes after hydration, so the subscribe callback is a no-op.
const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * `true` once React has hydrated on the client, `false` during SSR and the
 * initial hydration pass.
 *
 * Portals need this. Touching `document` while rendering breaks SSR, and the
 * usual workaround — a `mounted` flag set from an effect — costs a cascading
 * re-render on every mount and trips `react-hooks/set-state-in-effect`.
 * `useSyncExternalStore` expresses the same thing without either problem.
 */
export const useIsHydrated = (): boolean =>
  useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
