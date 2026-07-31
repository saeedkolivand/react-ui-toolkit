import type { HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr } from "@crosskit-ui/core";

export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: ContainerMaxWidth;
  padding?: boolean;
  center?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Container({
  maxWidth = "lg",
  padding = true,
  center = true,
  children,
  className,
  ref,
  ...rest
}: ContainerProps) {
  return (
    <div
      ref={ref}
      data-scope="container"
      data-part="root"
      data-max-width={maxWidth === "none" ? undefined : maxWidth}
      data-padded={dataAttr(padding)}
      data-centered={dataAttr(center)}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}
