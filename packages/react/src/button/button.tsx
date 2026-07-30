// NO "use client": a Button is server-safe. A consumer's own onClick is THEIR
// client boundary, not ours — putting a directive here would needlessly pull
// every consuming tree into the client bundle.
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr, type Size, type Variant } from "@crosskit-ui/core";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  /**
   * Defaults to "button". The v0 component had no default, so a Button inside a
   * <form> silently acted as submit. See MIGRATION.md.
   */
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  type = "button",
  disabled,
  children,
  className,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      data-scope="button"
      data-part="root"
      data-variant={variant}
      data-size={size}
      data-loading={dataAttr(loading)}
      data-disabled={dataAttr(disabled)}
      data-full-width={dataAttr(fullWidth)}
      disabled={disabled || loading}
      className={className}
      // rest LAST so consumers (and composing components) can override anything
      {...rest}
    >
      {children != null && <span data-part="label">{children}</span>}
    </button>
  );
}
