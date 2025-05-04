import React from 'react';
import { twMerge } from 'tailwind-merge';

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Label for the checkbox
   */
  label?: string;
  /**
   * Error state
   */
  error?: boolean;
  /**
   * Error message
   */
  errorMessage?: string;
  /**
   * The size of the checkbox
   */
  size?: CheckboxSize;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error = false, errorMessage, size = 'md', disabled, ...props }, ref) => {
    const baseClasses =
      'rounded border transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-offset-0 dark:focus:ring-offset-gray-800';

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const stateClasses = {
      default:
        'border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:text-primary-400 dark:focus:ring-primary-400 dark:bg-gray-800',
      error:
        'border-red-500 text-red-600 focus:ring-red-500 dark:border-red-400 dark:text-red-400 dark:focus:ring-red-400',
      disabled: 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700',
    };

    const checkboxClasses = twMerge(
      baseClasses,
      sizeClasses[size],
      error ? stateClasses.error : stateClasses.default,
      disabled && stateClasses.disabled,
      className
    );

    return (
      <div className="flex flex-col">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className={checkboxClasses}
            disabled={disabled}
            ref={ref}
            {...props}
          />
          {label && (
            <span
              className={twMerge(
                'ml-2',
                labelSizeClasses[size],
                'text-gray-900 dark:text-gray-100',
                disabled && 'text-gray-500 dark:text-gray-400'
              )}
            >
              {label}
            </span>
          )}
        </label>
        {error && errorMessage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
