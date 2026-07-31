"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { dataAttr, type ModalSize } from "@crosskit-ui/core";
import { useConfig } from "../config/config-provider";
import { Portal } from "../portal/portal";
import { Icon } from "../icon/icon";
import { Button, type ButtonType } from "../button/button";
import { useOverlay } from "./use-overlay";

export interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  /** The confirm button. Returning a promise keeps it busy until it settles. */
  onOk?: () => void | Promise<void>;
  /** Cancel, the close button, Escape, and clicking the mask all arrive here. */
  onCancel?: () => void;
  okText?: ReactNode;
  cancelText?: ReactNode;
  okType?: ButtonType;
  okDanger?: boolean;
  confirmLoading?: boolean;
  /** `null` removes the footer entirely; anything else replaces the default pair. */
  footer?: ReactNode | null;
  size?: ModalSize;
  /** Overrides `size` with an explicit inline size. */
  width?: number | string;
  role?: "dialog" | "alertdialog";
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  id?: string;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

export function Modal({
  size = "md",
  width,
  showCloseButton = true,
  centered = true,
  scrollable = true,
  okText,
  cancelText,
  okType = "primary",
  okDanger = false,
  confirmLoading = false,
  onOk,
  onCancel,
  footer,
  className,
  title,
  description,
  children,
  ...overlay
}: ModalProps) {
  const { locale } = useConfig();
  const [submitting, setSubmitting] = useState(false);

  // Every route out that the user initiated reports here — Escape and a press
  // outside go through the hook, Cancel and the close button call it directly.
  const cancel = () => onCancel?.();

  const dialog = useOverlay({
    ...overlay,
    onDismiss: cancel,
    hasTitle: title != null,
    hasDescription: description != null,
  });

  // Awaited, so an async handler holds the button busy on its own and a second
  // click cannot submit twice. `confirmLoading` still works for a consumer
  // driving the state itself.
  const confirm = async () => {
    if (!onOk) return;
    const result = onOk();
    // Any thenable, not only a native Promise: an async function from a
    // transpiled target, or a library's own deferred, is the same signal.
    if (typeof (result as PromiseLike<void> | undefined)?.then !== "function") return;
    setSubmitting(true);
    try {
      await result;
    } catch {
      // Swallowed deliberately. The promise is a busy signal here, not an error
      // channel — a failed submit is something `onOk` handles itself. Rethrowing
      // (or omitting this) would surface the consumer's own already-handled
      // rejection as an unhandled one, since React discards what onClick returns:
      // an "Uncaught (in promise)" in the console, the dev error overlay, and any
      // global unhandledrejection reporter, for a 422 the consumer caught.
    } finally {
      setSubmitting(false);
    }
  };

  // Gated on presence, never on `open`: unmounting the instant open flips means
  // data-state="closed" never gets a frame and the exit animation does nothing.
  if (!dialog.present) return null;

  const cancelAndClose = () => {
    cancel();
    dialog.close();
  };

  return (
    <Portal>
      {/* No onClick. Backdrop and positioner are both `position: fixed; inset: 0`
          at the same z-index, and the positioner comes second in DOM order — so
          the browser delivers a mask press to the positioner, and this handler
          would only ever fire in an environment without layout. The dismissable
          layer's own pointerdown is what actually catches it, which is also what
          makes `closeOnInteractOutside` and `alertdialog` apply to it. */}
      <div {...dialog.backdropProps} data-ck="modal" />
      <div {...dialog.positionerProps} data-ck="modal" data-centered={dataAttr(centered)}>
        <div
          {...dialog.contentProps}
          data-ck="modal"
          data-size={size}
          data-scrollable={dataAttr(scrollable)}
          // An unbounded value, so it is an inline custom property rather than a
          // variant — the theme compiler enumerates variants, and a width cannot
          // be enumerated. The size rules read it as their `max-width`, which is
          // what makes it actually override them: setting `inline-size` here left
          // `max-width: 28rem` from `data-size` clamping it.
          style={
            width === undefined
              ? undefined
              : ({
                  "--ck-modal-width": typeof width === "number" ? `${width}px` : width,
                } as CSSProperties)
          }
          className={className}
        >
          {title != null && <h2 {...dialog.titleProps}>{title}</h2>}
          {description != null && <p {...dialog.descriptionProps}>{description}</p>}
          <div data-scope="dialog" data-part="body" data-ck="modal">
            {children}
          </div>
          {footer !== null && (
            <div data-scope="dialog" data-part="footer" data-ck="modal">
              {footer ?? (
                <>
                  <Button onClick={cancelAndClose}>{cancelText ?? locale.Modal.cancelText}</Button>
                  <Button
                    type={okType}
                    danger={okDanger}
                    loading={confirmLoading || submitting}
                    onClick={confirm}
                  >
                    {okText ?? locale.Modal.okText}
                  </Button>
                </>
              )}
            </div>
          )}
          {showCloseButton && (
            <Button
              type="text"
              size="small"
              icon={<Icon name="close" />}
              data-close-trigger=""
              aria-label="Close"
              onClick={cancelAndClose}
            />
          )}
        </div>
      </div>
    </Portal>
  );
}
