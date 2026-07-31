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
        {...rest}
      />
      {label != null && <span data-part="label">{label}</span>}
    </label>
  );
}

export interface RadioGroupProps {
  /**
   * NOTE: there is deliberately no `name` here. Native radios are made mutually
   * exclusive by sharing a `name`, and only the radios themselves can carry it —
   * the group cannot inject props into arbitrary children. v0's group took a
   * `name` and silently dropped it. Put `name` on each `<Radio>`.
   */
  orientation?: Orientation;
  label?: ReactNode;
  /** Marks the whole group invalid. aria-invalid is NOT supported on role="radio" — it belongs on the radiogroup. Only svelte-check flags this, so it shipped in all four adapters; data-invalid stays for styling. */
  invalid?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * A grouping wrapper, not a controller. Native radios already handle selection
 * and arrow-key navigation once they share a `name`; this adds the group
 * semantics screen readers need, which v0 never provided.
 */
export function RadioGroup({
  orientation = "horizontal",
  label,
  invalid = false,
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
      data-invalid={dataAttr(invalid)}
      aria-invalid={ariaAttr(invalid)}
      className={className}
    >
      {children}
    </div>
  );
}
