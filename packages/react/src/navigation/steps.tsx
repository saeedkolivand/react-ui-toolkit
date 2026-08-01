// Owns a click handler when `onChange` is given, so it is a client component.
"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr, hasContent } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";

export type StepStatus = "wait" | "process" | "finish" | "error";
export type StepsSize = "default" | "small";

export interface StepItem {
  title?: ReactNode;
  subTitle?: ReactNode;
  description?: ReactNode;
  /** Replaces the number or tick in the marker. */
  icon?: ReactNode;
  /** Overrides the status derived from `current`. */
  status?: StepStatus;
  disabled?: boolean;
}

// `children` omitted alongside `onChange`: the content comes from `items`.
export interface StepsProps extends Omit<HTMLAttributes<HTMLElement>, "onChange" | "children"> {
  items: StepItem[];
  /** Zero-based, before `initial` is applied to the displayed numbers. */
  current?: number;
  /** Given, the steps become buttons. Absent, they are inert markup. */
  onChange?: (current: number) => void;
  direction?: "horizontal" | "vertical";
  /** Where the title sits relative to the marker. Horizontal steps only. */
  labelPlacement?: "horizontal" | "vertical";
  size?: StepsSize;
  /** The status of the *current* step; the others derive from their position. */
  status?: StepStatus;
  /** Dots instead of numbers, for a compact progress read. */
  progressDot?: boolean;
  /** The number the first step displays. */
  initial?: number;
  ref?: Ref<HTMLElement>;
}

/**
 * Everything before `current` is done, everything after is pending, and
 * `current` itself carries whatever the group says it is — which is how one
 * `status="error"` marks the step that failed rather than the whole list.
 */
const statusOf = (index: number, current: number, groupStatus: StepStatus): StepStatus =>
  index < current ? "finish" : index > current ? "wait" : groupStatus;

export function Steps({
  items,
  current = 0,
  onChange,
  direction = "horizontal",
  labelPlacement = "horizontal",
  size = "default",
  status = "process",
  progressDot = false,
  initial = 0,
  className,
  ref,
  ...rest
}: StepsProps) {
  const interactive = onChange !== undefined;

  return (
    <nav
      ref={ref}
      data-scope="steps"
      data-part="root"
      data-direction={direction}
      data-label-placement={direction === "horizontal" ? labelPlacement : undefined}
      data-size={size}
      data-progress-dot={dataAttr(progressDot)}
      className={className}
      {...rest}
    >
      <ol data-part="list">
        {items.map((item, index) => {
          const itemStatus = item.status ?? statusOf(index, current, status);
          const label = (
            <>
              <span data-part="marker" aria-hidden="true">
                {item.icon ??
                  (progressDot ? null : itemStatus === "finish" ? (
                    <Icon name="check" size="sm" />
                  ) : itemStatus === "error" ? (
                    <Icon name="close" size="sm" />
                  ) : (
                    index + initial
                  ))}
              </span>
              <span data-part="content">
                {hasContent(item.title) && (
                  <span data-part="title">
                    {item.title}
                    {hasContent(item.subTitle) && <span data-part="subtitle">{item.subTitle}</span>}
                  </span>
                )}
                {hasContent(item.description) && (
                  <span data-part="description">{item.description}</span>
                )}
              </span>
            </>
          );

          return (
            <li
              // The index is the identity here: a step's whole meaning is its
              // position in the sequence, so there is nothing stabler to key on
              // and reordering the list *is* renumbering the steps.
              key={index}
              data-part="item"
              data-status={itemStatus}
              data-disabled={dataAttr(item.disabled)}
              // The list says where you are; the marker is decorative, so the
              // state has to be announced from somewhere that is not it.
              aria-current={index === current ? "step" : undefined}
            >
              {interactive ? (
                <button
                  type="button"
                  data-part="trigger"
                  disabled={item.disabled}
                  onClick={() => onChange(index)}
                >
                  {label}
                </button>
              ) : (
                <span data-part="trigger">{label}</span>
              )}
              {/* The connector between this step and the next. Last step has
                  none, so a trailing line does not run off the end. */}
              {index < items.length - 1 && <span data-part="separator" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
