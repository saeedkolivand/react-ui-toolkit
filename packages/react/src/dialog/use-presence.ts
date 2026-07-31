"use client";

import * as presence from "@zag-js/presence";
import { useMachine, normalizeProps } from "@zag-js/react";

/**
 * Keeps a node mounted through its exit animation.
 *
 * Gate rendering on `present`, NEVER on `api.open` — otherwise the node
 * unmounts the instant open flips false, [data-state="closed"] never gets a
 * frame, and every exit animation in the library silently does nothing.
 */
export function usePresence(present: boolean) {
  const service = useMachine(presence.machine, { present });
  const api = presence.connect(service, normalizeProps);
  // Named setNode, not `ref`: a property called `ref` makes the React lint
  // rules treat this object as a ref and flag reading it during render.
  return { present: api.present, setNode: api.setNode };
}
