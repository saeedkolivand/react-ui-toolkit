// Server-safe: pure markup, no hooks, no handlers.
import {
  Children,
  Fragment,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { dataAttr } from "@crosskit-ui/core";
import { flexGap, type FlexGap } from "./flex";

export type SpaceSize = FlexGap | number;
export type SpaceAlign = "start" | "end" | "center" | "baseline";

export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  align?: SpaceAlign;
  direction?: "horizontal" | "vertical";
  /** One value for both axes, or `[horizontal, vertical]`. */
  size?: SpaceSize | [SpaceSize, SpaceSize];
  /** Rendered between items — a `<Divider>`, a bullet, anything. */
  split?: ReactNode;
  wrap?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Space({
  align,
  direction = "horizontal",
  size = "small",
  split,
  wrap = false,
  children,
  className,
  style,
  ref,
  ...rest
}: SpaceProps) {
  // A row of controls of unequal height reads as broken when they sit on
  // different baselines, so horizontal centres unless told otherwise. A column
  // has no such default — stretching is what it usually wants.
  const resolvedAlign = align ?? (direction === "horizontal" ? "center" : undefined);

  const [x, y] = Array.isArray(size) ? size : [size, size];

  // `Children.toArray` drops null and undefined and keys what survives, which is
  // what stops `{flag && <Button/>}` between two items from leaving a stray
  // split behind. It flattens fragments too, so a mapped list is spaced item by
  // item rather than as a single block.
  const items = Children.toArray(children);

  return (
    <div
      ref={ref}
      data-scope="space"
      data-part="root"
      data-direction={direction}
      data-align={resolvedAlign}
      data-wrap={dataAttr(wrap)}
      className={className}
      style={
        {
          ...style,
          "--ck-space-x": flexGap(x),
          "--ck-space-y": flexGap(y),
        } as CSSProperties
      }
      {...rest}
    >
      {items.map((child, index) => (
        // A fragment, not an element: the split and the item have to be
        // siblings of the flex container. Anything wrapping the pair becomes the
        // flex item and swallows the gap between them.
        <Fragment key={index}>
          {index > 0 && split != null && (
            <span data-part="split" aria-hidden="true">
              {split}
            </span>
          )}
          <div data-part="item">{child}</div>
        </Fragment>
      ))}
    </div>
  );
}
