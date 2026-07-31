import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";

export type ColSpan = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type ColOffset = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface ColBreakpoint {
  span?: ColSpan;
  offset?: ColOffset;
}

export interface ColProps extends HTMLAttributes<HTMLDivElement> {
  span?: ColSpan;
  offset?: ColOffset;
  sm?: ColBreakpoint;
  md?: ColBreakpoint;
  lg?: ColBreakpoint;
  xl?: ColBreakpoint;
  order?: number | "first" | "last";
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Col({
  span,
  offset,
  sm,
  md,
  lg,
  xl,
  order,
  children,
  className,
  style,
  ref,
  ...rest
}: ColProps) {
  const numericOrder = typeof order === "number" ? order : undefined;

  return (
    <div
      ref={ref}
      data-scope="col"
      data-part="root"
      data-span={span}
      data-offset={offset}
      data-span-sm={sm?.span}
      data-offset-sm={sm?.offset}
      data-span-md={md?.span}
      data-offset-md={md?.offset}
      data-span-lg={lg?.span}
      data-offset-lg={lg?.offset}
      data-span-xl={xl?.span}
      data-offset-xl={xl?.offset}
      data-order={typeof order === "string" ? order : undefined}
      className={className}
      // `order` is unbounded, so it stays an inline custom property rather than
      // a generated class. Spans and offsets are enumerable and therefore static.
      style={
        numericOrder == null
          ? style
          : ({ ...style, ["--ck-col-order" as string]: String(numericOrder) } as CSSProperties)
      }
      {...rest}
    >
      {children}
    </div>
  );
}
