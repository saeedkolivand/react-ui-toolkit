import {
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { ariaAttr, dataAttr, type Size } from "@crosskit-ui/core";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  size?: Size;
  label?: ReactNode;
  invalid?: boolean;
  /** Renders the mixed state. This is a DOM *property*, not an attribute. */
  indeterminate?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Checkbox({
  size = "md",
  label,
  invalid = false,
  indeterminate = false,
  disabled,
  id,
  className,
  ref,
  ...rest
}: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const innerRef = useRef<HTMLInputElement>(null);

  // `indeterminate` has no HTML attribute — it exists only as a DOM property,
  // which is why it needs an effect rather than a prop on the element.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      data-scope="checkbox"
      data-part="root"
      data-disabled={dataAttr(disabled)}
      data-invalid={dataAttr(invalid)}
      htmlFor={inputId}
      className={className}
    >
      <input
        ref={node => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        id={inputId}
        type="checkbox"
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
