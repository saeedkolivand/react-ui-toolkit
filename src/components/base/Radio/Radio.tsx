import React from 'react';
import { twMerge } from 'tailwind-merge';

export type RadioSize = 'sm' | 'md' | 'lg';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /**
   * Label for the radio button
   */
  label?: string;
  /**
   * Helper text to be displayed below the radio button
   */
  helperText?: string;
  /**
   * Error message to be displayed
   */
  error?: string;
  /**
   * The size of the radio button
   */
  size?: RadioSize;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, helperText, error, size = 'md', disabled, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const radioClasses = twMerge(
      'form-radio border-gray-300 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-primary-400 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800 dark:bg-gray-800',
      sizeClasses[size],
      error && 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400',
      className
    );

    const labelClasses = twMerge(
      'ml-2 font-medium text-gray-700 dark:text-gray-200',
      labelSizeClasses[size],
      disabled && 'text-gray-400 dark:text-gray-500',
      error && 'text-red-500 dark:text-red-400'
    );

    return (
      <div className="relative">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="radio"
              className={radioClasses}
              disabled={disabled}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error || helperText ? `${props.id}-description` : undefined}
              {...props}
            />
          </div>
          {label && (
            <div className="ml-2">
              <label htmlFor={props.id} className={labelClasses}>
                {label}
              </label>
            </div>
          )}
        </div>
        {(helperText || error) && (
          <p
            className={twMerge(
              'mt-1 text-sm',
              error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            )}
            id={`${props.id}-description`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
