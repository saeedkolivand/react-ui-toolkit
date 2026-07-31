// Owns a dismiss handler, so it is a client component despite trivial markup.
"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import type { IconName, Status } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";
import { Button } from "../button/button";

const ICON_FOR: Record<Status, IconName> = {
  info: "info",
  success: "check",
  warning: "warning",
  error: "error",
};

// `title` is omitted from the native attributes on purpose: the DOM's own
// `title` is a string (the browser tooltip), whereas ours is renderable content.
// Keeping both would make the prop unusable with anything but a plain string.
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: Status;
  title?: ReactNode;
  showIcon?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Alert({
  variant = "info",
  title,
  showIcon = true,
  dismissible = false,
  onDismiss,
  children,
  className,
  ref,
  ...rest
}: AlertProps) {
  return (
    <div
      ref={ref}
      role="alert"
      data-scope="alert"
      data-part="root"
      data-variant={variant}
      className={className}
      {...rest}
    >
      {showIcon && <Icon name={ICON_FOR[variant]} size="md" />}
      <div data-part="content">
        {title != null && <h3 data-part="title">{title}</h3>}
        {children != null && <div data-part="description">{children}</div>}
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          data-part="close-trigger"
          onClick={onDismiss}
          aria-label="Dismiss"
          icon="close"
        />
      )}
    </div>
  );
}
