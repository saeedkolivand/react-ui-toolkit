// Formats through Intl with the locale from context, so it reads context.
"use client";

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { hasContent } from "@crosskit-ui/core";
import { useConfig } from "../config/config-provider";
import { Spinner } from "../spinner/spinner";

export interface StatisticProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "prefix"> {
  title?: ReactNode;
  value?: number | string;
  /** Fixed decimal places. Ignored when `value` is already a string. */
  precision?: number;
  prefix?: ReactNode;
  suffix?: ReactNode;
  /** Takes over entirely — the escape hatch from `Intl`'s formatting. */
  formatter?: (value: number | string) => ReactNode;
  loading?: boolean;
  valueStyle?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

export function Statistic({
  title,
  value,
  precision,
  prefix,
  suffix,
  formatter,
  loading = false,
  valueStyle,
  className,
  ref,
  ...rest
}: StatisticProps) {
  const { locale } = useConfig();

  // `Intl.NumberFormat` rather than separator props. It groups and places the
  // decimal mark the way the reader's locale does — 1,234.5 or 1.234,5 or
  // ١٬٢٣٤٫٥ — which is a thing a `groupSeparator` prop can only approximate one
  // locale at a time. `formatter` is the way out for anything it cannot do.
  const formatted = formatter
    ? formatter(value ?? "")
    : typeof value === "number"
      ? new Intl.NumberFormat(locale.tag, {
          minimumFractionDigits: precision,
          maximumFractionDigits: precision,
        }).format(value)
      : value;

  return (
    <div ref={ref} data-scope="statistic" data-part="root" className={className} {...rest}>
      {hasContent(title) && <div data-part="title">{title}</div>}
      {loading ? (
        <Spinner size="sm" />
      ) : (
        <div data-part="value" style={valueStyle}>
          {hasContent(prefix) && <span data-part="prefix">{prefix}</span>}
          {/* The number itself, so a consumer can style it apart from the
              affixes — which are usually a currency mark or a unit, not part
              of the figure. */}
          <span data-part="number">{formatted}</span>
          {hasContent(suffix) && <span data-part="suffix">{suffix}</span>}
        </div>
      )}
    </div>
  );
}
