// Server-safe: pure markup, no hooks, no handlers.
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr, hasContent } from "@crosskit-ui/core";

export type DescriptionsSize = "small" | "middle" | "default";

export interface DescriptionItem {
  key?: string;
  label?: ReactNode;
  children: ReactNode;
  /** Columns this item occupies. Clamped to the row width. */
  span?: number;
}

export interface DescriptionsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title" | "children"
> {
  items: DescriptionItem[];
  title?: ReactNode;
  extra?: ReactNode;
  bordered?: boolean;
  /** Items per row. */
  column?: number;
  layout?: "horizontal" | "vertical";
  size?: DescriptionsSize;
  /** Append a colon after each label. Horizontal, unbordered layouts only. */
  colon?: boolean;
  ref?: Ref<HTMLDivElement>;
}

/**
 * How many items wide this one is, clamped to the row.
 *
 * Unclamped, a span wider than the row makes the grid add a column for one
 * item and every row below it loses its alignment.
 */
const itemSpan = (item: DescriptionItem, column: number): number | undefined =>
  item.span === undefined ? undefined : Math.min(Math.max(1, item.span), Math.max(1, column));

const tracks = (count: number | undefined): CSSProperties | undefined =>
  count === undefined ? undefined : { ["--ck-descriptions-span" as string]: String(count) };

export function Descriptions({
  items,
  title,
  extra,
  bordered = false,
  column = 3,
  layout = "horizontal",
  size = "default",
  colon = true,
  className,
  ref,
  ...rest
}: DescriptionsProps) {
  const vertical = layout === "vertical";

  return (
    <div
      ref={ref}
      data-scope="descriptions"
      data-part="root"
      data-layout={layout}
      data-size={size}
      data-bordered={dataAttr(bordered)}
      data-colon={dataAttr(colon && !vertical && !bordered)}
      className={className}
      {...rest}
    >
      {(hasContent(title) || hasContent(extra)) && (
        <div data-part="header">
          {hasContent(title) && <div data-part="title">{title}</div>}
          {hasContent(extra) && <div data-part="extra">{extra}</div>}
        </div>
      )}
      {/* A real description list, not a table. `dt`/`dd` is what a screen
          reader already knows how to pair, and the columns are grid on top of
          it — so `bordered` and `column` are presentation rather than two
          different DOM shapes to keep in step. */}
      <dl
        data-part="list"
        style={{ ["--ck-descriptions-columns" as string]: String(Math.max(1, column)) }}
      >
        {items.map((item, index) => {
          const width = itemSpan(item, column);
          return (
            // A wrapper per pair, which `<dl>` explicitly allows. It is
            // `display: contents` in the horizontal layout, so the label and
            // value land in the outer grid and the labels of every row still
            // line up — and a real box in the vertical one, which is the only
            // way the value sits *under* its own label rather than beside it.
            // A flat grid cannot do the second: with three columns and
            // alternating `dt`/`dd`, the first row comes out label, value,
            // label and every pair after it is off by one.
            <div
              key={item.key ?? index}
              data-part="pair"
              style={vertical ? tracks(width) : undefined}
            >
              <dt data-part="label">{item.label}</dt>
              {/* Horizontal counts in tracks, not items: one item is two, so
                  the label keeps its one and the value takes `width * 2 - 1`. */}
              <dd data-part="content" style={vertical ? undefined : tracks(width && width * 2 - 1)}>
                {item.children}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
