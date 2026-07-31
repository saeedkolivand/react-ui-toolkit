"use client";

import { useId, type ReactNode } from "react";
import * as dialog from "@zag-js/dialog";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import { type Side, type Size } from "@crosskit-ui/core";
import { usePresence } from "../use-presence";
import { Icon } from "../icon/icon";
import { Button } from "../button/button";

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
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
 * The same @zag-js/dialog machine as Modal. Only `data-ck="drawer"`,
 * `data-placement` and the animation differ — the focus trap, scroll lock,
 * Escape handling and ARIA wiring are all shared, which is the whole point of
 * putting behaviour in a machine.
 */
export function Drawer({
  placement = "right",
  size = "md",
  showCloseButton = true,
  id,
  className,
  title,
  description,
  footer,
  children,
  ...machineProps
}: DrawerProps) {
  const autoId = useId();
  const service = useMachine(dialog.machine, { id: id ?? autoId, ...machineProps });
  const api = dialog.connect(service, normalizeProps);
  const { present, setNode } = usePresence(api.open);

  if (!present) return null;

  return (
    <Portal>
      <div {...api.getBackdropProps()} data-ck="drawer" />
      <div {...api.getPositionerProps()} data-ck="drawer">
        <div
          ref={setNode}
          {...api.getContentProps()}
          data-ck="drawer"
          data-placement={placement}
          data-size={size}
          className={className}
        >
          {title != null && <h2 {...api.getTitleProps()}>{title}</h2>}
          {description != null && <p {...api.getDescriptionProps()}>{description}</p>}
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
              onClick={() => api.setOpen(false)}
            />
          )}
        </div>
      </div>
    </Portal>
  );
}
