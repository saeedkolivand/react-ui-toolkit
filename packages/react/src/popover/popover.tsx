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
  /**
   * Defaults to hover AND click. Hover alone is the more faithful default, but
   * a popover exists to hold controls, and unlike the other two there is no
   * second way in: Tooltip has `focus` in its default and Dropdown answers
   * Enter and the arrows because its role demands it. Including `click` is what
   * makes a keyboard reach it at all, since activating the trigger with Enter
   * or Space dispatches one — and it costs a pointer user nothing.
   */
  trigger?: TriggerKind | TriggerKind[];
  /** SECONDS. */
  mouseEnterDelay?: number;
  /** SECONDS. */
  mouseLeaveDelay?: number;
  arrow?: boolean;
  /** Never opens, and closes if it already was. */
  disabled?: boolean;
  overlayClassName?: string;
  /** Lands on the trigger wrapper, which is this component's root. */
  className?: string;
  id?: string;
}

const DEFAULT_TRIGGER: TriggerKind[] = ["hover", "click"];

export function Popover({
  content,
  title,
  children,
  placement = "top",
  trigger = DEFAULT_TRIGGER,
  arrow = true,
  overlayClassName,
  className,
  ...rest
}: PopoverProps) {
  const anchored = useAnchored({
    ...rest,
    placement,
    trigger,
    arrow,
    scope: "popover",
    // The content holds controls, and it is portalled to the end of the
    // document — so Tab from the trigger walks past it into whatever follows in
    // the DOM, and the buttons inside are unreachable by keyboard. Moving focus
    // in is what makes them reachable, and it declines on a hover-open.
    takeFocus: true,
    // `dialog`, not `tooltip`: the content is reachable and may hold a link, a
    // button or a form. A `tooltip` role tells a screen reader the opposite —
    // that this is a description of the trigger — and its contents then get
    // read as one flat string with the controls inside it unusable.
    role: "dialog",
  });

  const hasTitle = title !== undefined && title !== null && title !== "";
  const titleId = `${anchored.contentId}-title`;

  return (
    <AnchoredView
      anchored={anchored}
      arrow={arrow}
      className={className}
      overlayClassName={overlayClassName}
      // A `dialog` with no accessible name is announced as just "dialog", which
      // tells a screen-reader user nothing about what they have been moved
      // into. The title is right there; this points at it.
      contentProps={hasTitle ? { "aria-labelledby": titleId } : undefined}
      body={
        <>
          {hasTitle && (
            <div id={titleId} data-scope="popover" data-part="title">
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
