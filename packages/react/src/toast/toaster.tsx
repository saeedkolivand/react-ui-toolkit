"use client";

import { useId } from "react";
import * as toast from "@zag-js/toast";
import { useMachine, normalizeProps } from "@zag-js/react";
import type { IconName, Toaster as ToasterStore } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";

// Same mapping as Alert, so a success toast and a success alert look alike.
const ICON_FOR: Record<string, IconName> = {
  success: "check",
  error: "error",
  warning: "warning",
  info: "info",
};

export interface ToasterProps {
  /** The store from `createToaster()`. */
  toaster: ToasterStore;
  /** Suppress the per-type icon. */
  hideIcon?: boolean;
  id?: string;
}

export function Toaster({ toaster, hideIcon, id }: ToasterProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const service = useMachine(toast.group.machine, { id: id ?? autoId, store: toaster });
  const api = toast.group.connect(service, normalizeProps);

  return (
    <div {...api.getGroupProps()}>
      {api.getToasts().map((item, index) => (
        <ToastItem key={item.id} item={item} index={index} parent={service} hideIcon={hideIcon} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  item: toast.Props;
  index: number;
  parent: toast.GroupService;
  hideIcon?: boolean;
}

/**
 * Split out because each toast needs its own machine, and a machine needs a
 * component to live in.
 */
function ToastItem({ item, index, parent, hideIcon }: ToastItemProps) {
  const service = useMachine(toast.machine, { ...item, parent, index });
  const api = toast.connect(service, normalizeProps);
  const icon = ICON_FOR[api.type];

  return (
    <div {...api.getRootProps()}>
      {!hideIcon && icon && <Icon name={icon} data-part="icon" />}
      {api.title != null && <h3 {...api.getTitleProps()}>{api.title}</h3>}
      {api.description != null && <p {...api.getDescriptionProps()}>{api.description}</p>}
      {/* The action lives on the toast's own options, not on the api — the api
          only supplies the trigger's props and click handling. */}
      {item.action && <button {...api.getActionTriggerProps()}>{item.action.label}</button>}
      {api.closable && (
        <button {...api.getCloseTriggerProps()} aria-label="Dismiss">
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
}
