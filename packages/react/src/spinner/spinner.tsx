import type { HTMLAttributes, Ref } from "react";
import type { Size, Status } from "@crosskit-ui/core";

export type SpinnerVariant = "primary" | "secondary" | Status;

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
  variant?: SpinnerVariant;
  /** Announced to assistive tech; the visual is decorative. */
  label?: string;
  ref?: Ref<HTMLDivElement>;
}

export function Spinner({
  size = "md",
  variant = "primary",
  label = "Loading…",
  className,
  ref,
  ...rest
}: SpinnerProps) {
  return (
    <div
      ref={ref}
      role="status"
      data-scope="spinner"
      data-part="root"
      data-variant={variant}
      className={className}
      {...rest}
    >
      <span data-part="indicator" data-size={size} />
      <span data-part="visually-hidden">{label}</span>
    </div>
  );
}
