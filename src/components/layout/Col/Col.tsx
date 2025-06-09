import React from "react";
import { twMerge } from "tailwind-merge";

export interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns to span (1-12)
   */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * Column offset (0-11)
   */
  offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  /**
   * Order of the column
   */
  order?: number | "first" | "last";
  /**
   * Responsive column spans
   */
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * Responsive column offsets
   */
  smOffset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  mdOffset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  lgOffset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  xlOffset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  /**
   * Responsive column order
   */
  smOrder?: number | "first" | "last";
  mdOrder?: number | "first" | "last";
  lgOrder?: number | "first" | "last";
  xlOrder?: number | "first" | "last";
}

const getWidthClass = (span?: number) => {
  if (!span) return "";
  return `w-${span}/12`;
};

const getOffsetClass = (offset?: number) => {
  if (!offset) return "";
  return `ml-${offset}/12`;
};

const getOrderClass = (order?: number | "first" | "last") => {
  if (!order) return "";
  if (order === "first") return "order-first";
  if (order === "last") return "order-last";
  return `order-${order}`;
};

export const Col = React.forwardRef<HTMLDivElement, ColProps>(
  (
    {
      span,
      offset,
      order,
      sm,
      md,
      lg,
      xl,
      smOffset,
      mdOffset,
      lgOffset,
      xlOffset,
      smOrder,
      mdOrder,
      lgOrder,
      xlOrder,
      className,
      ...props
    },
    ref
  ) => {
    const colClasses = twMerge(
      "flex-shrink-0",
      getWidthClass(span),
      getOffsetClass(offset),
      getOrderClass(order),
      sm && `sm:${getWidthClass(sm)}`,
      md && `md:${getWidthClass(md)}`,
      lg && `lg:${getWidthClass(lg)}`,
      xl && `xl:${getWidthClass(xl)}`,
      smOffset && `sm:${getOffsetClass(smOffset)}`,
      mdOffset && `md:${getOffsetClass(mdOffset)}`,
      lgOffset && `lg:${getOffsetClass(lgOffset)}`,
      xlOffset && `xl:${getOffsetClass(xlOffset)}`,
      smOrder && `sm:${getOrderClass(smOrder)}`,
      mdOrder && `md:${getOrderClass(mdOrder)}`,
      lgOrder && `lg:${getOrderClass(lgOrder)}`,
      xlOrder && `xl:${getOrderClass(xlOrder)}`,
      className
    );

    return <div ref={ref} className={colClasses} {...props} />;
  }
);

Col.displayName = "Col";
