"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Placement, PlacementAlias } from "@crosskit-ui/core";
import { AnchoredView } from "../anchored/anchored";
import { useAnchored, type TriggerKind } from "../anchored/use-anchored";

export interface TooltipProps {
  /** The tooltip text. An empty one never opens, which is what makes
   *  `title={row.note}` safe to write without a conditional around it. */
  title?: ReactNode;
  children: ReactNode;
  /** The twelve names: `top`, `topLeft`, `bottomRight`, `leftTop`, … */
  placement?: PlacementAlias | Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  /**
   * Defaults to hover AND focus. Hover alone is the more faithful default but
   * leaves the tooltip unreachable by keyboard, and a tooltip nobody can read
   * without a mouse is not a tooltip.
   */
  trigger?: TriggerKind | TriggerKind[];
  /** SECONDS. */
  mouseEnterDelay?: number;
  /** SECONDS. */
  mouseLeaveDelay?: number;
  arrow?: boolean;
  /** Never opens, and closes if it already was. */
  disabled?: boolean;
  /** Any CSS colour. Sets the background and, with it, the arrow's. */
  color?: string;
  /** A class on the popup rather than on the trigger. */
  overlayClassName?: string;
  /** Lands on the trigger wrapper, which is this component's root. */
  className?: string;
  id?: string;
}

const DEFAULT_TRIGGER: TriggerKind[] = ["hover", "focus"];

export function Tooltip({
  title,
  children,
  placement = "top",
  trigger = DEFAULT_TRIGGER,
  arrow = true,
  disabled,
  color,
  overlayClassName,
  className,
  ...rest
}: TooltipProps) {
  // An empty title means there is nothing to say. Checked before the hook is
  // given `disabled` rather than around the render, so no timer is ever
  // scheduled and no layer is ever pushed for a tooltip that cannot show.
  const empty = title === undefined || title === null || title === "" || title === false;

  const anchored = useAnchored({
    ...rest,
    placement,
    trigger,
    arrow,
    // Either reason closes it: an explicit `disabled`, or nothing to say.
    disabled: disabled || empty,
    scope: "tooltip",
    role: "tooltip",
  });

  return (
    <AnchoredView
      anchored={anchored}
      arrow={arrow}
      className={className}
      overlayClassName={overlayClassName}
      positionerProps={
        // A custom property rather than `background`, so one value drives the
        // box and the arrow — which is a separate element and would otherwise
        // end up a different colour from the thing it points at.
        //
        // On the POSITIONER, because that is the only ancestor of both. The
        // arrow is a sibling of the content, not a child of it — it has to be,
        // or a scrolling menu would clip it — so a property set on the content
        // inherits to nothing that matters. Which is precisely the outcome this
        // indirection exists to prevent, and it did not.
        color ? { style: { "--ck-tooltip-bg": color } as CSSProperties } : undefined
      }
      body={title}
    >
      {children}
    </AnchoredView>
  );
}
