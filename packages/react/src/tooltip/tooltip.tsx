"use client";

import { useId, type ReactNode } from "react";
import * as tooltip from "@zag-js/tooltip";
import { useMachine, normalizeProps, Portal } from "@zag-js/react";
import {
  isFocusVisible,
  resolvePlacement,
  type LegacyPlacement,
  type Placement,
} from "@crosskit-ui/core";
import { usePresence } from "../use-presence";

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  /** Accepts Floating UI names and v0's Ant names (`topLeft`, `rightBottom`, …). */
  placement?: Placement | LegacyPlacement;
  /** v0 called this `visible`. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  /** v0 called this `showDelay`. */
  openDelay?: number;
  /** v0 called this `hideDelay`. */
  closeDelay?: number;
  disabled?: boolean;
  /** v0 called this `overlayClassName`. */
  contentClassName?: string;
  id?: string;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement,
  openDelay,
  closeDelay,
  disabled,
  contentClassName,
  id,
  className,
  ...machineProps
}: TooltipProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const service = useMachine(tooltip.machine, {
    id: id ?? autoId,
    openDelay,
    closeDelay,
    disabled,
    positioning: { placement: resolvePlacement(placement) },
    ...machineProps,
  });
  const api = tooltip.connect(service, normalizeProps);
  const { present, setNode } = usePresence(api.open);

  return (
    <>
      {/* The trigger wraps rather than clones, so the consumer's element is
          untouched. focusin/focusout stand in for zag's focus/blur, which do
          not bubble up to a wrapper — see the note in overlay.css for why the
          wrapper is a real box and not display:contents. */}
      <span
        {...api.getTriggerProps()}
        className={className}
        onFocus={e => {
          if (isFocusVisible(e.target)) api.setOpen(true);
        }}
        onBlur={() => api.setOpen(false)}
      >
        {children}
      </span>
      {/* Gate on presence, NEVER on api.open, or [data-state="closed"] never
          gets a frame and the exit animation silently does nothing. */}
      {present && (
        <Portal>
          <div {...api.getPositionerProps()}>
            <div ref={setNode} {...api.getContentProps()} className={contentClassName}>
              {content}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
