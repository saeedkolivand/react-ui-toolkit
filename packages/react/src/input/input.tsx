import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { ariaAttr, dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  variant?: FieldVariant;
  size?: Size;
  label?: ReactNode;
  helperText?: ReactNode;
  /** Marks the field invalid. v0 called this `error`. */
  invalid?: boolean;
  errorMessage?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  fullWidth?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  variant = "default",
  size = "md",
  label,
  helperText,
  invalid = false,
  errorMessage,
  prefix,
  suffix,
  fullWidth = true,
  disabled,
  id,
  className,
  ref,
  ...rest
}: InputProps) {
  // Called unconditionally — `id ?? useId()` would be a conditional hook.
  const autoId = useId();
  const inputId = id ?? autoId;
  const describedBy = errorMessage
    ? `${inputId}-error`
    : helperText
      ? `${inputId}-helper`
      : undefined;

  return (
    <div
      data-scope="input"
      data-part="field"
      data-variant={variant}
      data-invalid={dataAttr(invalid)}
      data-has-prefix={dataAttr(prefix != null)}
      data-has-suffix={dataAttr(suffix != null)}
      data-full-width={dataAttr(fullWidth)}
      className={className}
    >
      {label != null && (
        <label data-part="label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div data-scope="input" data-part="control">
        {prefix != null && <span data-part="prefix">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          data-scope="input"
          data-part="input"
          data-size={size}
          disabled={disabled}
          aria-invalid={ariaAttr(invalid)}
          aria-describedby={describedBy}
          {...rest}
        />
        {suffix != null && <span data-part="suffix">{suffix}</span>}
      </div>
      {errorMessage != null ? (
        <p id={`${inputId}-error`} data-part="error-text">
          {errorMessage}
        </p>
      ) : (
        helperText != null && (
          <p id={`${inputId}-helper`} data-part="helper-text">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}
