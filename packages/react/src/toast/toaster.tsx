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
      if (!event.altKey || event.key.toLowerCase() !== "t") return;
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
  const hold = useCallback(
    (signal: "pointer" | "focus", next: boolean) => {
      held.current[signal] = next;
      const any = held.current.pointer || held.current.focus;
      if (any) toaster.pause();
      else toaster.resume();
    },
    [toaster]
  );

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
      onMouseEnter={() => hold("pointer", true)}
      onMouseLeave={() => hold("pointer", false)}
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
