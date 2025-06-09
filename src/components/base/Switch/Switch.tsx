import React from "react";
import { twMerge } from "tailwind-merge";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /**
   * Label for the switch
   */
  label?: string;
  /**
   * Helper text to be displayed below the switch
   */
  helperText?: string;
  /**
   * Error message to be displayed
   */
  error?: string;
  /**
   * The size of the switch
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether the switch is checked
   */
  checked?: boolean;
  /**
   * Whether the switch is in loading state
   */
  loading?: boolean;
  /**
   * Callback when the switch state changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      size = "md",
      disabled,
      checked,
      loading,
      onChange,
      ...props
    },
    _ref
  ) => {
    const switchSizes = {
      sm: {
        switch: "w-8 h-4",
        thumb: "h-3 w-3",
        translate: "translate-x-4",
        spinner: "h-2.5 w-2.5",
      },
      md: {
        switch: "w-11 h-6",
        thumb: "h-5 w-5",
        translate: "translate-x-5",
        spinner: "h-3.5 w-3.5",
      },
      lg: {
        switch: "w-14 h-7",
        thumb: "h-6 w-6",
        translate: "translate-x-7",
        spinner: "h-4 w-4",
      },
    };

    const labelSizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const switchClasses = twMerge(
      "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800",
      switchSizes[size].switch,
      checked ? "bg-primary-600 dark:bg-primary-500" : "bg-gray-200 dark:bg-gray-600",
      disabled && "cursor-not-allowed opacity-50",
      loading && "cursor-wait",
      className
    );

    const thumbClasses = twMerge(
      "pointer-events-none inline-flex items-center justify-center transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-gray-100",
      switchSizes[size].thumb,
      checked ? switchSizes[size].translate : "translate-x-0"
    );

    const spinnerClasses = twMerge(
      "animate-spin rounded-full border-[1.5px] border-current border-t-transparent",
      switchSizes[size].spinner
    );

    const labelClasses = twMerge(
      "ml-3 font-medium text-gray-700 dark:text-gray-200",
      labelSizeClasses[size],
      disabled && "text-gray-400 dark:text-gray-500",
      error && "text-red-500 dark:text-red-400",
      loading && "opacity-70"
    );

    const handleChange = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled && !loading && onChange) {
        const syntheticEvent = {
          target: { checked: !checked },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative">
        <div className="flex items-center">
          <div
            className={switchClasses}
            role="switch"
            aria-checked={checked}
            onClick={handleChange}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              disabled={disabled || loading}
              onChange={onChange}
              name={props.name}
              {...props}
            />
            <span className={thumbClasses}>{loading && <div className={spinnerClasses} />}</span>
          </div>
          {label && <span className={labelClasses}>{label}</span>}
        </div>
        {(helperText || error) && (
          <p
            className={twMerge(
              "mt-1 text-sm",
              error ? "text-red-500 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";
