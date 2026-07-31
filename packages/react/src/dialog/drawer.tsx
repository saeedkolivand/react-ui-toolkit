"use client";

import type { ReactNode } from "react";
import { type Side, type Size } from "@crosskit-ui/core";
import { Portal } from "../portal/portal";
import { Icon } from "../icon/icon";
import { Button } from "../button/button";
import { useOverlay } from "./use-overlay";

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  onClose?: () => void;
  /** v0 called this `position`. */
  placement?: Side;
  size?: Size;
  role?: "dialog" | "alertdialog";
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  showCloseButton?: boolean;
  id?: string;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

/**
 * The same `useOverlay` as Modal. Only `data-ck="drawer"`, `data-placement` and
 * the animation differ — the focus trap, scroll lock, background inert, Escape
 * handling and ARIA wiring are all shared, which is the point of putting the
 * behaviour in one hook.
 */
export function Drawer({
  placement = "right",
  size = "md",
  showCloseButton = true,
  onClose,
  className,
  title,
  description,
  footer,
  children,
  ...overlay
}: DrawerProps) {
  const dialog = useOverlay({
    ...overlay,
    hasTitle: title != null,
    hasDescription: description != null,
  });

  if (!dialog.present) return null;

  const close = () => {
    onClose?.();
    dialog.close();
  };

  return (
    <Portal>
      <div {...dialog.backdropProps} data-ck="drawer" onClick={close} />
      <div {...dialog.positionerProps} data-ck="drawer">
        <div
          {...dialog.contentProps}
          data-ck="drawer"
          data-placement={placement}
          data-size={size}
          className={className}
        >
          {title != null && <h2 {...dialog.titleProps}>{title}</h2>}
          {description != null && <p {...dialog.descriptionProps}>{description}</p>}
          <div data-scope="dialog" data-part="body" data-ck="drawer">
            {children}
          </div>
          {footer != null && (
            <div data-scope="dialog" data-part="footer" data-ck="drawer">
              {footer}
            </div>
          )}
          {showCloseButton && (
            <Button
              type="text"
              size="small"
              icon={<Icon name="close" />}
              data-close-trigger=""
              aria-label="Close"
              onClick={close}
            />
          )}
        </div>
      </div>
    </Portal>
  );
}
