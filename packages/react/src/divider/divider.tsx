import type { HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr, type Orientation } from "@crosskit-ui/core";

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** v0 called this `type`; renamed to match the shared Orientation vocabulary. */
  orientation?: Orientation;
  /** Where an optional label sits. v0 called this `orientation`, which collided. */
  align?: "start" | "center" | "end";
  dashed?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Divider({
  orientation = "horizontal",
  align = "center",
  dashed = false,
  children,
  className,
  ref,
  ...rest
}: DividerProps) {
  const vertical = orientation === "vertical";

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      data-scope="divider"
      data-part="root"
      data-orientation={orientation}
      data-align={align}
      data-dashed={dataAttr(dashed)}
      className={className}
      {...rest}
    >
      {!vertical && (
        <>
          <span data-part="line" />
          {children != null && <span data-part="label">{children}</span>}
          {children != null && <span data-part="line" />}
        </>
      )}
    </div>
  );
}
