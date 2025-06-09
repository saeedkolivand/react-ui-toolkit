import React from "react";
import classNames from "classnames";

export type TagVariant = "default" | "outline" | "solid";
export type TagColor = "default" | "primary" | "success" | "warning" | "error" | "info";

export interface TagProps {
  children: React.ReactNode;
  variant?: TagVariant;
  color?: TagColor;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

const colorClasses = {
  default: {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    outline: "border-gray-300 text-gray-700",
    solid: "bg-gray-600 text-white",
  },
  primary: {
    default: "bg-primary-100 text-primary-700 border-primary-200",
    outline: "border-primary-500 text-primary-600",
    solid: "bg-primary-600 text-white",
  },
  success: {
    default: "bg-green-100 text-green-700 border-green-200",
    outline: "border-green-500 text-green-600",
    solid: "bg-green-600 text-white",
  },
  warning: {
    default: "bg-yellow-100 text-yellow-700 border-yellow-200",
    outline: "border-yellow-500 text-yellow-600",
    solid: "bg-yellow-600 text-white",
  },
  error: {
    default: "bg-red-100 text-red-700 border-red-200",
    outline: "border-red-500 text-red-600",
    solid: "bg-red-600 text-white",
  },
  info: {
    default: "bg-cyan-100 text-cyan-700 border-cyan-200",
    outline: "border-cyan-500 text-cyan-600",
    solid: "bg-cyan-600 text-white",
  },
};

export function Tag({
  children,
  variant = "default",
  color = "default",
  closable = false,
  onClose,
  className,
}: TagProps) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variantClasses = variant === "outline" ? "border" : "border-0";
  const colorClass = colorClasses[color][variant];

  const tagClasses = classNames(baseClasses, variantClasses, colorClass, className);

  return (
    <span className={tagClasses}>
      {children}
      {closable && (
        <button
          type="button"
          className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-current hover:bg-current hover:bg-opacity-20 focus:outline-none"
          onClick={onClose}
          aria-label="Remove tag"
        >
          <span className="sr-only">Remove tag</span>
          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </span>
  );
}
