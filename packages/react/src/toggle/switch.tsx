import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { dataAttr, type Size } from "@crosskit-ui/core";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  size?: Size;
  label?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

/**
 * One real checkbox, one change event.
 *
 * v0 put an onClick on the wrapper that synthesised a fake `{target:{checked}}`
 * event AND an onChange on the inner input, so which one fired — and what shape
 * the payload had — depended on where you clicked. A single native control
 * cannot reproduce that; the label makes the whole thing clickable without a
 * second handler.
 */
export function Switch({ size = "md", label, disabled, id, className, ref, ...rest }: SwitchProps) {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <label
      data-scope="switch"
      data-part="root"
      data-disabled={dataAttr(disabled)}
      htmlFor={inputId}
      className={className}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        data-part="hidden-input"
        disabled={disabled}
        {...rest}
      />
      <span data-part="control" data-size={size}>
        <span data-part="thumb" />
      </span>
      {label != null && <span data-part="label">{label}</span>}
    </label>
  );
}
