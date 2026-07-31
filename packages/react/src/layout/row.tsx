import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr } from "@crosskit-ui/core";

export type RowJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type RowAlign = "start" | "center" | "end" | "stretch" | "baseline";

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  justify?: RowJustify;
  align?: RowAlign;
  /** Gap in 0.25rem steps, matching the scale v0's `gap-${n}` used. */
  spacing?: number;
  wrap?: boolean;
  reverse?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Row({
  justify,
  align,
  spacing,
  wrap = true,
  reverse = false,
  children,
  className,
  style,
  ref,
  ...rest
}: RowProps) {
  // An inline custom property, not a class. v0 built `gap-${spacing}` at
  // runtime, which only resolved because this repo's own Tailwind config
  // happened to contain those values — in a consumer's build it produced
  // nothing. This works for any number.
  const styleWithSpacing: CSSProperties | undefined =
    spacing == null ? style : { ...style, ["--ck-row-spacing" as string]: String(spacing) };

  return (
    <div
      ref={ref}
      data-scope="row"
      data-part="root"
      data-justify={justify}
      data-align={align}
      data-wrap={wrap ? undefined : "false"}
      data-reverse={dataAttr(reverse)}
      className={className}
      style={styleWithSpacing}
      {...rest}
    >
      {children}
    </div>
  );
}
