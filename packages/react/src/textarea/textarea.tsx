import {
  useId,
  type ChangeEvent,
  type ReactNode,
  type Ref,
  type TextareaHTMLAttributes,
} from "react";
import { ariaAttr, dataAttr, type FieldVariant, type Size } from "@crosskit-ui/core";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  variant?: FieldVariant;
  size?: Size;
  label?: ReactNode;
  helperText?: ReactNode;
  invalid?: boolean;
  errorMessage?: ReactNode;
  autoResize?: boolean;
  fullWidth?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  variant = "default",
  size = "md",
  label,
  helperText,
  invalid = false,
  errorMessage,
  autoResize = false,
  fullWidth = true,
  disabled,
  id,
  className,
  onChange,
  defaultValue,
  value,
  ref,
  ...rest
}: TextareaProps) {
  const autoId = useId();
  const textareaId = id ?? autoId;
  const describedBy = errorMessage
    ? `${textareaId}-error`
    : helperText
      ? `${textareaId}-helper`
      : undefined;

  // Auto-resize is CSS (see field.css). All this does is mirror the value onto
  // the wrapper so the invisible replica can size the grid cell — one DOM write,
  // no hooks, no measurement. The `field-sizing: content` path ignores it.
  const mirror = (el: HTMLTextAreaElement) => {
    el.parentElement?.setAttribute("data-value", el.value);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (autoResize) mirror(event.currentTarget);
    onChange?.(event);
  };

  return (
    <div
      data-scope="textarea"
      data-part="field"
      data-variant={variant}
      data-invalid={dataAttr(invalid)}
      data-full-width={dataAttr(fullWidth)}
      className={className}
    >
      {label != null && (
        <label data-part="label" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <div
        data-scope="textarea"
        data-part="control"
        data-auto-resize={dataAttr(autoResize)}
        // Seeds the replica so an initial multi-line value is sized correctly —
        // v0 only ever resized on user input, so this case was always wrong.
        data-value={autoResize ? String(value ?? defaultValue ?? "") : undefined}
      >
        <textarea
          ref={ref}
          id={textareaId}
          data-scope="textarea"
          data-part="input"
          data-size={size}
          disabled={disabled}
          aria-invalid={ariaAttr(invalid)}
          aria-describedby={describedBy}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...rest}
        />
      </div>
      {errorMessage != null ? (
        <p id={`${textareaId}-error`} data-part="error-text">
          {errorMessage}
        </p>
      ) : (
        helperText != null && (
          <p id={`${textareaId}-helper`} data-part="helper-text">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}
