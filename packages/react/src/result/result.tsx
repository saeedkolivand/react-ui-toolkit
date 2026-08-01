// Server-safe: pure markup, no hooks, no handlers.
import type { HTMLAttributes, ReactNode, Ref } from "react";
import type { IconName } from "@crosskit-ui/core";
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
  return (
    <div
      ref={ref}
      data-scope="result"
      data-part="root"
      data-status={status}
      className={className}
      {...rest}
    >
      <div data-part="icon">{icon ?? <Icon name={ICON_FOR[status]} />}</div>
      {title != null && <div data-part="title">{title}</div>}
      {subTitle != null && <div data-part="subtitle">{subTitle}</div>}
      {children != null && <div data-part="content">{children}</div>}
      {extra != null && <div data-part="extra">{extra}</div>}
    </div>
  );
}
