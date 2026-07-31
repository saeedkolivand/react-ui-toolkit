import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr, type Size, type Status } from "@crosskit-ui/core";

export type ProgressVariant = "primary" | Status;

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Omit (or pass null) for an indeterminate bar. */
  value?: number | null;
  max?: number;
  variant?: ProgressVariant;
  size?: Size;
  label?: ReactNode;
  showValue?: boolean;
  striped?: boolean;
  animated?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function Progress({
  value,
  max = 100,
  variant = "primary",
  size = "md",
  label,
  showValue = false,
  striped = false,
  animated = false,
  className,
  style,
  ref,
  ...rest
}: ProgressProps) {
  // v0 took a separate `indeterminate` boolean AND treated a missing value as
  // indeterminate, so the two could disagree. Now the value alone decides.
  const indeterminate = value == null;
  const percent = indeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      ref={ref}
      data-scope="progress"
      data-part="root"
      data-variant={variant}
      data-indeterminate={dataAttr(indeterminate)}
      className={className}
      style={style}
      {...rest}
    >
      {(label != null || showValue) && (
        <div data-part="label">
          <span>{label}</span>
          {showValue && !indeterminate && (
            <span data-part="value-text">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div
        data-part="track"
        data-size={size}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
      >
        <div
          data-part="range"
          data-striped={dataAttr(striped)}
          data-animated={dataAttr(animated)}
          style={{ ["--ck-progress-percent" as string]: String(percent) } as CSSProperties}
        />
      </div>
    </div>
  );
}
