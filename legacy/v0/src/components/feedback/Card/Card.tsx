import React from "react";
import { twMerge } from "tailwind-merge";

export type CardVariant = "default" | "primary" | "secondary" | "success" | "warning" | "danger";
export type CardSize = "sm" | "md" | "lg";

export interface CardProps {
  /**
   * The content of the card
   */
  children: React.ReactNode;
  /**
   * The header content of the card
   */
  header?: React.ReactNode;
  /**
   * The footer content of the card
   */
  footer?: React.ReactNode;
  /**
   * Whether to add a hover effect
   */
  hoverable?: boolean;
  /**
   * Whether to add a shadow effect
   */
  elevated?: boolean;
  /**
   * Whether the card has a border
   */
  bordered?: boolean;
  /**
   * The variant of the card
   */
  variant?: CardVariant;
  /**
   * The size of the card padding
   */
  size?: CardSize;
  /**
   * Whether to make the card full width
   */
  fullWidth?: boolean;
  /**
   * Additional classes to be applied to the card
   */
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-white",
  primary: "bg-blue-50 border-blue-200",
  secondary: "bg-gray-50 border-gray-200",
  success: "bg-green-50 border-green-200",
  warning: "bg-yellow-50 border-yellow-200",
  danger: "bg-red-50 border-red-200",
};

const sizeStyles: Record<CardSize, string> = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  hoverable = false,
  elevated = false,
  bordered = true,
  variant = "default",
  size = "md",
  fullWidth = true,
  className,
}) => {
  const cardClasses = twMerge(
    "rounded-lg overflow-hidden transition-all duration-200",
    variantStyles[variant],
    !fullWidth && "inline-block",
    bordered && "border",
    elevated && "shadow-md",
    hoverable && "hover:shadow-lg hover:translate-y-[-2px]",
    className
  );

  const headerClasses = twMerge(
    "border-b",
    sizeStyles[size],
    variant === "default"
      ? "border-gray-200"
      : `border-opacity-50 ${variantStyles[variant].split(" ")[1]}`
  );

  const contentClasses = sizeStyles[size];

  const footerClasses = twMerge(
    "border-t",
    sizeStyles[size],
    variant === "default"
      ? "border-gray-200 bg-gray-50"
      : `border-opacity-50 ${variantStyles[variant].split(" ")[1]} bg-opacity-50 ${
          variantStyles[variant].split(" ")[0]
        }`
  );

  return (
    <div className={cardClasses}>
      {header && <div className={headerClasses}>{header}</div>}
      <div className={contentClasses}>{children}</div>
      {footer && <div className={footerClasses}>{footer}</div>}
    </div>
  );
};
