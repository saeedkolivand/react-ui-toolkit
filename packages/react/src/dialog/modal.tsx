"use client";

import { useId, type ReactNode } from "react";
import * as dialog from "@zag-js/dialog";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import { dataAttr, type ModalSize } from "@crosskit-ui/core";
import { usePresence } from "../use-presence";
import { Button } from "../button/button";

export interface ModalProps {
  /** Controlled. v0 called this `isOpen`. */
  open?: boolean;
  defaultOpen?: boolean;
  /** v0 had `onClose: () => void`; this reports both directions. */
  onOpenChange?: (details: { open: boolean }) => void;
  size?: ModalSize;
  role?: "dialog" | "alertdialog";
  modal?: boolean;
  /** v0 called this `closeOnEsc`. */
  closeOnEscape?: boolean;
  /** v0 called this `closeOnBackdropClick`. */
  closeOnInteractOutside?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  id?: string;
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
}

export function Modal({
  size = "md",
  showCloseButton = true,
  centered = true,
  scrollable = true,
  id,
  className,
  title,
  description,
  footer,
  children,
  ...machineProps
}: ModalProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const service = useMachine(dialog.machine, { id: id ?? autoId, ...machineProps });
  const api = dialog.connect(service, normalizeProps);
  const { present, setNode } = usePresence(api.open);

  if (!present) return null;

  return (
    <Portal>
      <div {...api.getBackdropProps()} data-ck="modal" />
      {/* data-* applied directly rather than through mergeProps: we are only
          adding attributes, not merging handlers, and zag's prop types do not
          admit arbitrary data-* keys. */}
      <div {...api.getPositionerProps()} data-ck="modal" data-centered={dataAttr(centered)}>
        <div
          ref={setNode}
          {...api.getContentProps()}
          data-ck="modal"
          data-size={size}
          data-scrollable={dataAttr(scrollable)}
          className={className}
        >
          {title != null && <h2 {...api.getTitleProps()}>{title}</h2>}
          {description != null && <p {...api.getDescriptionProps()}>{description}</p>}
          <div data-scope="dialog" data-part="body" data-ck="modal">
            {children}
          </div>
          {footer != null && (
            <div data-scope="dialog" data-part="footer" data-ck="modal">
              {footer}
            </div>
          )}
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              icon="close"
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
