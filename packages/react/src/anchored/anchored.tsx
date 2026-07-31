"use client";

/**
 * The markup half of an anchored overlay. `use-anchored.ts` is the behaviour
 * half.
 *
 * Tooltip, Popover and Dropdown render exactly this — a trigger, and a portalled
 * positioner wrapping a content box — and differ only in what goes inside the
 * box. Keeping the shell here is what stops one of them growing a part the
 * other two lack, which is the divergence the parity suite exists to catch and
 * the cheapest kind to simply not create.
 */

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Portal } from "../portal/portal";
import type { Anchored } from "./use-anchored";

export interface AnchoredViewProps {
  anchored: Anchored;
  /** The consumer's trigger. */
  children: ReactNode;
  /** What goes inside the content box. */
  body: ReactNode;
  arrow?: boolean;
  /** Ant's name for a class on the popup rather than on the trigger. */
  overlayClassName?: string;
  /** Merged onto the content AFTER ours, so a caller can override anything. */
  contentProps?: Record<string, unknown>;
}

/**
 * Puts the ARIA on the element the user actually focuses.
 *
 * Attributes only — no ref, no handlers — so this cannot clobber a ref the
 * consumer already put on their child, and cannot swallow their onClick. The
 * anchor and every listener stay on our wrapper, where they work whatever the
 * child turns out to be: a component that ignores `ref` would otherwise leave
 * the popup unpositioned at the top-left of the viewport, and nothing in the
 * types could warn about it.
 */
function withAria(children: ReactNode, aria: Record<string, string | undefined>): ReactNode {
  if (!isValidElement(children)) return children;
  // The rule is right in general — cloning is fragile because it silently
  // overwrites whatever the child already had. It is safe in this one case
  // precisely because `aria` is attributes we own and nothing else: no ref to
  // clobber, no handler to swallow, and every key namespaced `aria-`.
  // eslint-disable-next-line @eslint-react/no-clone-element
  return cloneElement(children as ReactElement<Record<string, unknown>>, aria);
}

export function AnchoredView({
  anchored,
  children,
  body,
  arrow = true,
  overlayClassName,
  contentProps,
}: AnchoredViewProps) {
  const { present, triggerProps, triggerAria, positionerProps, arrowProps } = anchored;

  return (
    <>
      {/* A real box, never display:contents. The wrapper is what the positioner
          measures, and `contents` generates none — `getBoundingClientRect` on it
          returns zeros, so the popup would anchor to the top-left corner of the
          page. It is also what receives the pointer and focus listeners. */}
      <span {...triggerProps}>{withAria(children, triggerAria)}</span>
      {/* Gate on presence, NEVER on `open`, or [data-state="closed"] never gets
          a frame and the exit animation silently does nothing. */}
      {present && (
        <Portal>
          {/* Portalled to document.body because the positioner is
              `position: fixed` with viewport coordinates, and any ancestor with
              a transform, filter, perspective, backdrop-filter or contain:paint
              would capture it as the containing block. */}
          <div {...positionerProps}>
            {/* A sibling of the content, not a child of it. The menu's content
                box scrolls (`overflow-y: auto`), which would clip an arrow that
                by definition sits outside the box — and `applyPosition` writes
                `--ck-arrow-x/y` and `data-placement` onto the positioner, so
                this is also the element those coordinates are relative to. */}
            {arrow && <span {...arrowProps} />}
            <div {...anchored.contentProps} className={overlayClassName} {...contentProps}>
              {body}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
