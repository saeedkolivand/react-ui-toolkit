import type { HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr, type Size } from "@crosskit-ui/core";

/** v0 called the red variant "danger" here but "error" everywhere else; unified on "error". */
export type CardVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  elevated?: boolean;
  bordered?: boolean;
  variant?: CardVariant;
  size?: Size;
  fullWidth?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Card({
  header,
  footer,
  hoverable = false,
  elevated = false,
  bordered = true,
  variant = "default",
  size = "md",
  fullWidth = true,
  children,
  className,
  ref,
  ...rest
}: CardProps) {
  return (
    <div
      ref={ref}
      data-scope="card"
      data-part="root"
      data-variant={variant}
      data-size={size}
      data-bordered={dataAttr(bordered)}
      data-elevated={dataAttr(elevated)}
      data-hoverable={dataAttr(hoverable)}
      data-full-width={dataAttr(fullWidth)}
      className={className}
      {...rest}
    >
      {header != null && <div data-part="header">{header}</div>}
      <div data-part="body">{children}</div>
      {footer != null && <div data-part="footer">{footer}</div>}
    </div>
  );
}
