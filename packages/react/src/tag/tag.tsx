import type { HTMLAttributes, ReactNode, Ref } from "react";
import { Icon } from "../icon/icon";

export type TagVariant = "default" | "outline" | "solid";
export type TagColor = "default" | "primary" | "success" | "warning" | "error" | "info";

export interface TagProps extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  variant?: TagVariant;
  color?: TagColor;
  closable?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

export function Tag({
  variant = "default",
  color = "default",
  closable = false,
  onClose,
  children,
  className,
  ref,
  ...rest
}: TagProps) {
  return (
    <span
      ref={ref}
      data-scope="tag"
      data-part="root"
      data-variant={variant}
      data-color={color}
      className={className}
      {...rest}
    >
      {children}
      {closable && (
        <button type="button" data-part="close-trigger" onClick={onClose} aria-label="Remove">
          <Icon name="close" size="sm" />
        </button>
      )}
    </span>
  );
}
