import type { HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr, type Size, type Status } from "@crosskit-ui/core";

export type BadgeVariant = "primary" | "secondary" | Status;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: Size;
  rounded?: boolean;
  outlined?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

export function Badge({
  variant = "primary",
  size = "md",
  rounded = false,
  outlined = false,
  children,
  className,
  ref,
  ...rest
}: BadgeProps) {
  return (
    <span
      ref={ref}
      data-scope="badge"
      data-part="root"
      data-variant={variant}
      data-size={size}
      data-rounded={dataAttr(rounded)}
      data-outlined={dataAttr(outlined)}
      className={className}
      {...rest}
    >
      {children}
    </span>
  );
}
