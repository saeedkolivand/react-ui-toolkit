"use client";

import { useState, type ReactNode } from "react";
import { hasContent, type Placement, type PlacementAlias } from "@crosskit-ui/core";
import type { TriggerKind } from "../anchored/use-anchored";
import { useConfig } from "../config/config-provider";
import { Button, type ButtonType } from "../button/button";
import { Icon } from "../icon/icon";
import { Popover } from "../popover/popover";

export interface PopconfirmProps {
  /** The question. Also the popup's accessible name. */
  title?: ReactNode;
  /** Optional detail under the question. */
  description?: ReactNode;
  children: ReactNode;
  /** Returning a promise holds OK busy until it settles, and a rejection keeps the popup open. */
  onConfirm?: () => void | Promise<void>;
  /** The Cancel button only. Escape and a press outside close without asking. */
  onCancel?: () => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  okType?: ButtonType;
  okDanger?: boolean;
  /** Drive the busy state yourself, alongside or instead of an async `onConfirm`. */
  okLoading?: boolean;
  /** Drop the Cancel button — for a confirm that only ever goes one way. */
  showCancel?: boolean;
  /** `false` removes it; anything else replaces the default warning symbol. */
  icon?: ReactNode | false;
  placement?: PlacementAlias | Placement;
  /**
   * Defaults to `click` alone, unlike Popover's hover-and-click. A confirm is a
   * question about something destructive, and a pointer crossing the trigger is
   * not the user asking it.
   */
  trigger?: TriggerKind | TriggerKind[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  disabled?: boolean;
  overlayClassName?: string;
  /** Lands on the trigger wrapper, which is this component's root. */
  className?: string;
  id?: string;
}

const DEFAULT_TRIGGER: TriggerKind[] = ["click"];

export function Popconfirm({
  title,
  description,
  children,
  onConfirm,
  onCancel,
  okText,
  cancelText,
  okType = "primary",
  okDanger = false,
  okLoading = false,
  showCancel = true,
  icon,
  trigger = DEFAULT_TRIGGER,
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  ...rest
}: PopconfirmProps) {
  const { locale } = useConfig();
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const [submitting, setSubmitting] = useState(false);
  const open = controlled ?? uncontrolled;

  // Held here rather than left to Popover, because both buttons have to close a
  // popup they are inside — and an uncontrolled Popover offers no way to say so.
  const setOpen = (next: boolean) => {
    if (controlled === undefined) setUncontrolled(next);
    if (next !== open) onOpenChange?.({ open: next });
  };

  const cancel = () => {
    onCancel?.();
    setOpen(false);
  };

  // The same await-a-thenable shape Modal's OK uses, with one difference: a
  // rejection leaves the popup OPEN. The question was asked because the answer
  // matters, and dismissing it on a failed action tells the user it worked.
  const confirm = async () => {
    const result = onConfirm?.();
    if (typeof (result as PromiseLike<void> | undefined)?.then !== "function") {
      setOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      await result;
      setOpen(false);
    } catch {
      // Swallowed deliberately — the promise is a busy signal, not an error
      // channel. Rethrowing would surface the consumer's already-handled
      // rejection as an unhandled one, since React discards what onClick returns.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Popover
      {...rest}
      open={open}
      onOpenChange={details => setOpen(details.open)}
      trigger={trigger}
      // Popover's `title` slot, so the popup gets `aria-labelledby` — a `dialog`
      // with no name is announced as just "dialog". The row inside is ours, so
      // no popconfirm styling lands on a popover part.
      //
      // The description is in here WITH the question rather than below in the
      // body, for two reasons. It reads better: the name of a confirm dialog
      // becomes "Delete this? This cannot be undone", which is the whole
      // question rather than half of it. And it aligns without arithmetic — the
      // two share a column beside the symbol, so there is no indent constant to
      // keep in step with the symbol's width, and nothing to correct when
      // `icon={false}` takes the symbol away.
      title={
        <span data-scope="popconfirm" data-part="header">
          {icon !== false && (
            <span data-scope="popconfirm" data-part="icon">
              {icon ?? <Icon name="warning" />}
            </span>
          )}
          <span data-scope="popconfirm" data-part="message">
            <span data-scope="popconfirm" data-part="title">
              {title}
            </span>
            {/* `hasContent`, not `!= null`: `{flag && <p/>}` is `false`, which
                walks straight past a null check and emits an empty box that
                still takes its share of the column gap. */}
            {hasContent(description) && (
              <span data-scope="popconfirm" data-part="description">
                {description}
              </span>
            )}
          </span>
        </span>
      }
      content={
        <div data-scope="popconfirm" data-part="actions">
          {showCancel && (
            <Button size="small" onClick={cancel}>
              {cancelText ?? locale.Popconfirm.cancelText}
            </Button>
          )}
          <Button
            size="small"
            type={okType}
            danger={okDanger}
            loading={okLoading || submitting}
            onClick={confirm}
          >
            {okText ?? locale.Popconfirm.okText}
          </Button>
        </div>
      }
    >
      {children}
    </Popover>
  );
}
