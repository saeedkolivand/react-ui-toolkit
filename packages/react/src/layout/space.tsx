// Server-safe: pure markup, no hooks, no handlers.
import {
  Children,
  Fragment,
  isValidElement,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { dataAttr, hasContent } from "@crosskit-ui/core";
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
        //
        // Keyed from the child, not from the index — otherwise the key
        // `Children.toArray` just assigned is thrown away one line later. React
        // then matches fragments by position, walks in, finds a single element
        // whose key changed and remounts it rather than moving the node. The
        // order still comes out right, so nothing looks wrong: what is lost is
        // DOM identity, and with it a caret mid-edit, scroll position and any
        // state the child holds. The index remains the fallback for the
        // children that carry no key at all — bare strings and numbers.
        <Fragment key={isValidElement(child) && child.key !== null ? child.key : index}>
          {index > 0 && hasContent(split) && (
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
