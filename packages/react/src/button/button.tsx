// NO "use client": a Button is server-safe. A consumer's own onClick is THEIR
// client boundary, not ours — putting a directive here would needlessly pull
// every consuming tree into the client bundle.
import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr, type IconName, type Size, type Variant } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";
import { Spinner } from "../spinner/spinner";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: IconName;
  iconPosition?: "left" | "right";
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
  icon,
  iconPosition = "left",
  type = "button",
  disabled,
  children,
  className,
  ref,
  ...rest
}: ButtonProps) {
  // No data-part override: stamping a part name onto a composed child replaces
  // the child's own, which breaks the child's styling. The stylesheet targets
  // it as `[data-scope="button"] > [data-scope="icon"]` instead.
  const iconEl = icon ? <Icon name={icon} size={size} /> : null;

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
      data-icon-position={icon ? iconPosition : undefined}
      disabled={disabled || loading}
      className={className}
      // rest LAST so consumers (and composing components) can override anything
      {...rest}
    >
      {loading && <Spinner size={size} label="" />}
      {iconPosition === "left" && iconEl}
      {children != null && <span data-part="label">{children}</span>}
      {iconPosition === "right" && iconEl}
    </button>
  );
}
