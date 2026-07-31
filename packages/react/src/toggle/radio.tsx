import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { ariaAttr, dataAttr, type Orientation, type Size } from "@crosskit-ui/core";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: Size;
  label?: ReactNode;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Radio({
  size = "md",
  label,
  invalid = false,
  disabled,
  id,
  className,
  ref,
  ...rest
}: RadioProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <label
      data-scope="radio"
      data-part="root"
      data-disabled={dataAttr(disabled)}
      data-invalid={dataAttr(invalid)}
      htmlFor={inputId}
      className={className}
    >
      <input
        ref={ref}
        id={inputId}
        type="radio"
        data-part="control"
        data-size={size}
        disabled={disabled}
        aria-invalid={ariaAttr(invalid)}
        {...rest}
      />
      {label != null && <span data-part="label">{label}</span>}
    </label>
  );
}

export interface RadioGroupProps {
  /** Shared `name`, which is what makes native radios mutually exclusive. */
  name?: string;
  orientation?: Orientation;
  label?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * A grouping wrapper, not a controller. Native radios already handle selection
 * and arrow-key navigation once they share a `name`; this adds the group
 * semantics screen readers need, which v0 never provided.
 */
export function RadioGroup({
  name,
  orientation = "horizontal",
  label,
  children,
  className,
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={typeof label === "string" ? label : undefined}
      data-scope="radio-group"
      data-part="root"
      data-orientation={orientation}
      data-name={name}
      className={className}
    >
      {children}
    </div>
  );
}
