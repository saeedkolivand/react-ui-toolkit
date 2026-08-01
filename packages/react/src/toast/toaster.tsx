"use client";

import { useCallback, useEffect, useId, useRef, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { IconName, ToastItem, ToastQueue } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";

// Same mapping as Alert, so a success toast and a success alert look alike.
const ICON_FOR: Record<string, IconName> = {
  success: "check",
  error: "error",
  warning: "warning",
  info: "info",
};

export interface ToasterProps {
  /** The queue from `createToastQueue()`. */
  toaster: ToastQueue;
  /** Suppress the per-type icon. */
  hideIcon?: boolean;
  id?: string;
}

// Rendered on the server and before hydration. A module constant, not a literal
// in the call: `useSyncExternalStore` compares snapshots by identity, and a
// fresh `[]` on every call is an infinite render.
const EMPTY: readonly ToastItem[] = [];
const serverSnapshot = () => EMPTY;

export function Toaster({ toaster, hideIcon, id }: ToasterProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const groupId = id ?? autoId;
  const groupRef = useRef<HTMLDivElement>(null);

  const subscribe = useCallback((onChange: () => void) => toaster.subscribe(onChange), [toaster]);
  const getSnapshot = useCallback(() => toaster.getToasts(), [toaster]);
  const toasts = useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);

  const [side, align] = toaster.placement.split("-");

  // alt+T reaches the region from anywhere, which is the only way a keyboard
  // user gets to a toast's action before it expires. The label announces the
  // shortcut, so it has to actually exist.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.code !== "KeyT") return;
      const group = groupRef.current;
      if (!group || group.childElementCount === 0) return;
      event.preventDefault();
      group.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Hovering or focusing anywhere in the group holds every countdown, so a
  // toast cannot expire out from under a pointer heading for its action.
  //
  // Two independent signals, counted separately rather than both driving one
  // `pause()`/`resume()` pair: whichever ended first used to release the
  // other's hold, so brushing the pointer across a group that already had
  // focus in it started the countdown again with focus still there — the exact
  // thing these handlers exist to prevent.
  const held = useRef({ pointer: false, focus: false });
  const apply = useCallback(() => {
    if (held.current.pointer || held.current.focus) toaster.pause();
    else toaster.resume();
  }, [toaster]);
  const hold = useCallback(
    (signal: "pointer" | "focus", next: boolean) => {
      held.current[signal] = next;
      apply();
    },
    [apply]
  );

  // Re-read both signals from the DOM whenever the list changes, because a
  // node removed while it holds one produces no release. Closing a toast by
  // clicking its close button is the ordinary way to hit this — the pointer is
  // necessarily over the toast — and the browser fires no boundary event for a
  // node that is already detached, so the hold would stay raised for the rest
  // of the page's life and nothing would ever count down again.
  //
  // The old shape could not have this bug: each toast owned its own hold and
  // took it away with it. One group-level pair of signals has to be reconciled
  // against reality instead.
  const pointerAt = useRef<{ x: number; y: number } | undefined>(undefined);
  const trackPointer = useCallback((event: { clientX: number; clientY: number }) => {
    pointerAt.current = { x: event.clientX, y: event.clientY };
  }, []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const at = pointerAt.current;
    // Not `:hover`. That is the browser's own bookkeeping and it has not caught
    // up at commit time — the removed node took its `:hover` with it and the
    // toast that just slid into its slot has not been hit-tested yet, so the
    // query reads empty for a pointer that never left the group, and no
    // boundary event follows to correct it.
    //
    // Hit-testing the last known pointer position answers from the layout that
    // exists now. Against a descendant rather than the group, because the group
    // sets `pointer-events: none` to keep the page underneath clickable.
    // Optional call because jsdom does not implement `elementFromPoint`. There
    // it reads as "pointer is not over the group", which is right for every
    // case a unit test can construct — jsdom has no hover state to be over
    // anything with. The real behaviour is asserted in the browser suite.
    const under = at ? (document.elementFromPoint?.(at.x, at.y) ?? null) : null;
    held.current.pointer = under !== null && group.contains(under);
    held.current.focus = group.contains(document.activeElement);
    apply();
  }, [toasts, apply]);

  return (
    <div
      ref={groupRef}
      data-scope="toast"
      data-part="group"
      // Marks the flow-layout group. v1's adapters position every toast
      // absolutely through inline custom properties; this one is a flex column,
      // and `toast.css` keys the two sets of rules apart on this attribute.
      data-ck-layout="flow"
      data-placement={toaster.placement}
      data-side={side}
      data-align={align}
      id={groupId}
      tabIndex={-1}
      role="region"
      // One region that exists before anything lands in it, so additions get
      // announced. A live region created at the same moment as its content is
      // announced unreliably.
      aria-label={`Notifications, ${toaster.placement} (alt+T)`}
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic="false"
      onMouseEnter={event => {
        trackPointer(event);
        hold("pointer", true);
      }}
      onMouseMove={trackPointer}
      onMouseLeave={() => {
        pointerAt.current = undefined;
        hold("pointer", false);
      }}
      onFocus={() => hold("focus", true)}
      onBlur={() => hold("focus", false)}
    >
      {toasts.map(item => (
        <ToastView
          key={item.id}
          item={item}
          groupId={groupId}
          toaster={toaster}
          hideIcon={hideIcon}
        />
      ))}
    </div>
  );
}

interface ToastViewProps {
  item: ToastItem;
  groupId: string;
  toaster: ToastQueue;
  hideIcon?: boolean;
}

function ToastView({ item, groupId, toaster, hideIcon }: ToastViewProps) {
  const base = `${groupId}-${item.id}`;
  const icon = ICON_FOR[item.type];
  // The one cast: `core` types these `unknown` because it has no framework in
  // it, and this is the single place they become nodes.
  const title = item.title as ReactNode;
  const description = item.description as ReactNode;

  return (
    <div
      data-scope="toast"
      data-part="root"
      id={base}
      data-state={item.state}
      data-type={item.type}
      role="status"
      aria-atomic="true"
      aria-labelledby={title != null ? `${base}-title` : undefined}
      aria-describedby={description != null ? `${base}-description` : undefined}
      tabIndex={0}
    >
      {!hideIcon && icon && <Icon name={icon} data-part="icon" />}
      {title != null && (
        <h3 data-scope="toast" data-part="title" id={`${base}-title`}>
          {title}
        </h3>
      )}
      {description != null && (
        <p data-scope="toast" data-part="description" id={`${base}-description`}>
          {description}
        </p>
      )}
      {item.action && (
        <button
          type="button"
          data-scope="toast"
          data-part="action-trigger"
          onClick={() => {
            item.action?.onClick();
            toaster.dismiss(item.id);
          }}
        >
          {item.action.label}
        </button>
      )}
      {item.closable && (
        <button
          type="button"
          data-scope="toast"
          data-part="close-trigger"
          aria-label="Dismiss"
          onClick={() => toaster.dismiss(item.id)}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
}
