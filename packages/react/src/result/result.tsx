// Server-safe: pure markup, no hooks, no handlers.
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { hasContent, type IconName } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";

export type ResultStatus = "success" | "error" | "info" | "warning" | "404" | "403" | "500";

// ponytail: an icon per status rather than a bespoke illustration per HTTP code
// — the three codes are the only ones that would need artwork, and `icon=`
// already takes whatever a consumer wants to draw there.
const ICON_FOR: Record<ResultStatus, IconName> = {
  success: "check",
  error: "error",
  info: "info",
  warning: "warning",
  "404": "search",
  "403": "lock",
  "500": "wrench",
};

export interface ResultProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  status?: ResultStatus;
  title?: ReactNode;
  subTitle?: ReactNode;
  /** Replaces the built-in icon entirely. */
  icon?: ReactNode;
  /** The actions — rendered last, after any `children`. */
  extra?: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Result({
  status = "info",
  title,
  subTitle,
  icon,
  extra,
  children,
  className,
  ref,
  ...rest
}: ResultProps) {
  // `undefined` is "not specified" and takes the built-in icon; `null` and
  // `false` are how a caller asks for no icon at all. `icon ?? built-in` gets
  // the first right and the second wrong — it renders `false` into a box that
  // then takes the root gap on both sides of nothing.
  const iconNode = icon === undefined ? <Icon name={ICON_FOR[status]} /> : icon;

  return (
    <div
      ref={ref}
      data-scope="result"
      data-part="root"
      data-status={status}
      className={className}
      {...rest}
    >
      {hasContent(iconNode) && <div data-part="icon">{iconNode}</div>}
      {hasContent(title) && <div data-part="title">{title}</div>}
      {hasContent(subTitle) && <div data-part="subtitle">{subTitle}</div>}
      {hasContent(children) && <div data-part="content">{children}</div>}
      {hasContent(extra) && <div data-part="extra">{extra}</div>}
    </div>
  );
}
