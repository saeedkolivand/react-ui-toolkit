import React from "react";
import { twMerge } from "tailwind-merge";
import { Icon, Button } from "@/components";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The variant of the alert
   */
  variant?: AlertVariant;
  /**
   * Whether the alert is dismissible
   */
  dismissible?: boolean;
  /**
   * Callback when the alert is dismissed
   */
  onDismiss?: () => void;
  /**
   * The title of the alert
   */
  title?: string;
  /**
   * Whether to show an icon
   */
  showIcon?: boolean;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = "info",
  dismissible = false,
  onDismiss,
  title,
  showIcon = true,
  children,
  ...props
}) => {
  const baseClasses = "relative rounded-lg p-4 mb-4 transition-colors duration-200";

  const variantClasses = {
    info: "bg-blue-50 text-blue-800 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800",
    success:
      "bg-green-50 text-green-800 border border-green-100 dark:bg-green-900/30 dark:text-green-100 dark:border-green-800",
    warning:
      "bg-yellow-50 text-yellow-800 border border-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-100 dark:border-yellow-800",
    error:
      "bg-red-50 text-red-800 border border-red-100 dark:bg-red-900/30 dark:text-red-100 dark:border-red-800",
  };

  const iconClasses = {
    info: "text-blue-400 dark:text-blue-300",
    success: "text-green-400 dark:text-green-300",
    warning: "text-yellow-400 dark:text-yellow-300",
    error: "text-red-400 dark:text-red-300",
  };

  const classes = twMerge(baseClasses, variantClasses[variant], className);

  const getIcon = () => {
    switch (variant) {
      case "info":
        return <Icon name="info" size="md" className={iconClasses[variant]} />;
      case "success":
        return <Icon name="check" size="md" className={iconClasses[variant]} />;
      case "warning":
        return <Icon name="warning" size="md" className={iconClasses[variant]} />;
      case "error":
        return <Icon name="error" size="md" className={iconClasses[variant]} />;
    }
  };

  return (
    <div className={classes} role="alert" {...props}>
      <div className="flex">
        {showIcon && (
          <div className={twMerge("flex-shrink-0 mr-3", iconClasses[variant])}>{getIcon()}</div>
        )}
        <div className="flex-1">
          {title && <h3 className="text-sm font-medium mb-1">{title}</h3>}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {dismissible && (
          <Button
            variant="ghost"
            size="sm"
            className={twMerge(
              "flex-shrink-0 ml-3 w-5 h-5 p-0 min-w-0",
              `text-${variant}-500 hover:bg-${variant}-100 dark:hover:bg-${variant}-900/50`
            )}
            onClick={onDismiss}
            aria-label="Dismiss"
          >
            <Icon name="close" size="sm" />
          </Button>
        )}
      </div>
    </div>
  );
};
