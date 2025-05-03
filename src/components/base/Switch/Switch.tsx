import React from 'react';
import { twMerge } from 'tailwind-merge';
import styles from './Switch.module.scss';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
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
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      size = 'md',
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    const switchSizes = {
      sm: {
        switch: 'w-8 h-4',
        thumb: 'h-3 w-3',
        translate: 'translate-x-4',
      },
      md: {
        switch: 'w-11 h-6',
        thumb: 'h-5 w-5',
        translate: 'translate-x-5',
      },
      lg: {
        switch: 'w-14 h-7',
        thumb: 'h-6 w-6',
        translate: 'translate-x-7',
      },
    };

    const labelSizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const switchClasses = twMerge(
      'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-800',
      switchSizes[size].switch,
      checked ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-gray-600',
      disabled && 'cursor-not-allowed opacity-50',
      className
    );

    const thumbClasses = twMerge(
      'pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out dark:bg-gray-100',
      switchSizes[size].thumb,
      checked ? switchSizes[size].translate : 'translate-x-0'
    );

    const labelClasses = twMerge(
      'ml-3 font-medium text-gray-700 dark:text-gray-200',
      labelSizeClasses[size],
      disabled && 'text-gray-400 dark:text-gray-500',
      error && 'text-red-500 dark:text-red-400'
    );

    return (
      <div className="relative">
        <div className="flex items-center">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              ref={ref}
              className="sr-only"
              disabled={disabled}
              checked={checked}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error || helperText ? `${props.id}-description` : undefined
              }
              {...props}
            />
            <div className={switchClasses}>
              <span
                className={thumbClasses}
                aria-hidden="true"
              />
            </div>
            {label && (
              <span className={labelClasses}>
                {label}
              </span>
            )}
          </label>
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