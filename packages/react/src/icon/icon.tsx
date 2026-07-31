// Server-safe: pure markup, no hooks, no handlers.
import type { SVGAttributes, Ref } from "react";
import { ICON_VIEW_BOX, iconPaths, type IconName, type IconSize } from "@crosskit-ui/core";

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, "name"> {
  name: IconName;
  size?: IconSize;
  ref?: Ref<SVGSVGElement>;
}

export function Icon({ name, size = "md", className, ref, ...rest }: IconProps) {
  const paths = iconPaths[name];
  if (!paths) return null;

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={ICON_VIEW_BOX}
      aria-hidden="true"
      focusable="false"
      data-scope="icon"
      data-part="root"
      data-size={size}
      className={className}
      {...rest}
    >
      {paths.map(d => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
