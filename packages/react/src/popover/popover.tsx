"use client";

import type { ReactNode } from "react";
import type { Placement, PlacementAlias } from "@crosskit-ui/core";
import { AnchoredView } from "../anchored/anchored";
import { useAnchored, type TriggerKind } from "../anchored/use-anchored";

export interface PopoverProps {
  /** The body. Unlike a tooltip's, it may contain interactive elements. */
  content?: ReactNode;
  /** An optional heading above the content. */
  title?: ReactNode;
  children: ReactNode;
  placement?: PlacementAlias | Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  trigger?: TriggerKind | TriggerKind[];
  /** SECONDS. */
  mouseEnterDelay?: number;
  /** SECONDS. */
  mouseLeaveDelay?: number;
  arrow?: boolean;
  overlayClassName?: string;
  id?: string;
}

export function Popover({
  content,
  title,
  children,
  placement = "top",
  trigger = "hover",
  arrow = true,
  overlayClassName,
  ...rest
}: PopoverProps) {
  const anchored = useAnchored({
    ...rest,
    placement,
    trigger,
    arrow,
    scope: "popover",
    // `dialog`, not `tooltip`: the content is reachable and may hold a link, a
    // button or a form. A `tooltip` role tells a screen reader the opposite —
    // that this is a description of the trigger — and its contents then get
    // read as one flat string with the controls inside it unusable.
    role: "dialog",
  });

  return (
    <AnchoredView
      anchored={anchored}
      arrow={arrow}
      overlayClassName={overlayClassName}
      body={
        <>
          {title !== undefined && title !== null && title !== "" && (
            <div data-scope="popover" data-part="title">
              {title}
            </div>
          )}
          <div data-scope="popover" data-part="body">
            {content}
          </div>
        </>
      }
    >
      {children}
    </AnchoredView>
  );
}
