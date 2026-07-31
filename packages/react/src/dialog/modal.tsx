"use client";

import type { ReactNode } from "react";
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
  const dialog = useOverlay({
    ...overlay,
    hasTitle: title != null,
    hasDescription: description != null,
  });

  // Gated on presence, never on `open`: unmounting the instant open flips means
  // data-state="closed" never gets a frame and the exit animation does nothing.
  if (!dialog.present) return null;

  // Every route out of the dialog is a cancel, so Escape, the mask and the close
  // button all report the same way a consumer's own Cancel button would.
  const cancel = () => {
    onCancel?.();
    dialog.close();
  };

  return (
    <Portal>
      <div {...dialog.backdropProps} data-ck="modal" onClick={cancel} />
      <div {...dialog.positionerProps} data-ck="modal" data-centered={dataAttr(centered)}>
        <div
          {...dialog.contentProps}
          data-ck="modal"
          data-size={size}
          data-scrollable={dataAttr(scrollable)}
          // An unbounded value, so it is an inline custom property rather than a
          // variant — the theme compiler enumerates variants, and a width cannot
          // be enumerated.
          style={width === undefined ? undefined : { inlineSize: width }}
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
                  <Button onClick={cancel}>{cancelText ?? locale.Modal.cancelText}</Button>
                  <Button
                    type={okType}
                    danger={okDanger}
                    loading={confirmLoading}
                    onClick={() => onOk?.()}
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
              onClick={cancel}
            />
          )}
        </div>
      </div>
    </Portal>
  );
}
