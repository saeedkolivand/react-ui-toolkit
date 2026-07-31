import React from "react";
import { twMerge } from "tailwind-merge";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * The variant of the input
   */
  variant?: "default" | "filled" | "outline";
  /**
   * The size of the input
   */
  size?: InputSize;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message
   */
  errorMessage?: string;
  /**
   * Label for the input
   */
  label?: string;
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  /**
   * Prefix to display before the input
   */
  prefix?: string;
  /**
   * Suffix to display after the input
   */
  suffix?: string;
  /**
   * Whether the input should take full width
   */
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  className,
  variant = "default",
  size = "md",
  error = false,
  errorMessage,
  label,
  disabled,
  helperText,
  prefix,
  suffix,
  fullWidth = true,
  ...props
}) => {
  const baseClasses =
    "w-full rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:bg-gray-800 dark:text-white";

  const variantClasses = {
    default:
      "border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400 dark:focus:ring-primary-400",
    filled:
      "bg-gray-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:focus:bg-gray-800 dark:focus:border-primary-400 dark:focus:ring-primary-400",
    outline:
      "bg-transparent border border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:focus:border-primary-400 dark:focus:ring-primary-400",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const errorClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400"
    : "";

  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    errorClasses,
    disabled && "opacity-50 cursor-not-allowed bg-gray-50",
    className
  );

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{prefix}</span>
        )}
        <input
          className={twMerge(classes, prefix && "pl-8", suffix && "pr-8")}
          disabled={disabled}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{suffix}</span>
        )}
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
};
