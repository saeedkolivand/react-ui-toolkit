// Server-safe: pure markup, no hooks, no handlers.
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import { dataAttr } from "@crosskit-ui/core";

export type FlexGap = "small" | "middle" | "large";

export interface FlexProps extends Omit<HTMLAttributes<HTMLDivElement>, "wrap"> {
  vertical?: boolean;
  /** Any `justify-content` value — unbounded, so it lands inline. */
  justify?: CSSProperties["justifyContent"];
  /** Any `align-items` value — unbounded, so it lands inline. */
  align?: CSSProperties["alignItems"];
  /** Shorthand for this element's own `flex`, for a Flex nested in a Flex. */
  flex?: CSSProperties["flex"];
  gap?: FlexGap | number | string;
  /** `true`/`false` are the shorthand for `"wrap"`/`"nowrap"`. */
  wrap?: boolean | CSSProperties["flexWrap"];
  /** Render as something other than a `div`. Props are not inferred from it. */
  component?: ElementType;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const PRESET: Record<FlexGap, string> = {
  small: "var(--ck-space-sm)",
  middle: "var(--ck-space-md)",
  large: "var(--ck-space-lg)",
};

/** A preset resolves to its token, a number to pixels, a string is taken as-is. */
export const flexGap = (gap: FlexGap | number | string | undefined): string | undefined => {
  if (gap == null) return undefined;
  if (typeof gap === "number") return `${gap}px`;
  return PRESET[gap as FlexGap] ?? gap;
};

export function Flex({
  vertical = false,
  justify,
  align,
  flex,
  gap,
  wrap,
  component: Component = "div",
  children,
  className,
  style,
  ref,
  ...rest
}: FlexProps) {
  // `justify`, `align`, `flex` and a non-preset `gap` accept the whole CSS value
  // space, so there is no finite set of selectors to compile them into. They are
  // the documented boundary of the theme compiler: unbounded props stay inline.
  const inline: CSSProperties = { ...style };
  if (justify !== undefined) inline.justifyContent = justify;
  if (align !== undefined) inline.alignItems = align;
  if (flex !== undefined) inline.flex = flex;
  if (gap !== undefined) inline.gap = flexGap(gap);
  if (wrap !== undefined)
    inline.flexWrap = wrap === true ? "wrap" : wrap === false ? "nowrap" : wrap;

  return (
    <Component
      ref={ref}
      data-scope="flex"
      data-part="root"
      data-vertical={dataAttr(vertical)}
      className={className}
      style={inline}
      {...rest}
    >
      {children}
    </Component>
  );
}
