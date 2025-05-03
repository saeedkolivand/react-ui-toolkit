import React from 'react';
import { twMerge } from 'tailwind-merge';
import styles from './Textarea.module.scss';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * The variant of the textarea
   */
  variant?: 'default' | 'filled' | 'outlined';
  /**
   * The size of the textarea
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Label for the textarea
   */
  label?: string;
  /**
   * Helper text to be displayed below the textarea
   */
  helperText?: string;
  /**
   * Error message to be displayed
   */
  error?: string;
  /**
   * Whether the textarea is full width
   */
  fullWidth?: boolean;
  /**
   * Whether to auto-resize the textarea based on content
   */
  autoResize?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      label,
      helperText,
      error,
      fullWidth = false,
      autoResize = false,
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-600 dark:focus:border-primary-400 dark:focus:ring-primary-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 dark:text-white dark:shadow-none';

    const variantClasses = {
      default: 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800',
      filled: 'border-transparent bg-gray-100 focus:bg-white dark:bg-gray-700 dark:focus:bg-gray-800',
      outlined: 'border-gray-300 bg-transparent dark:border-gray-600',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm min-h-[80px]',
      md: 'px-4 py-2 text-base min-h-[100px]',
      lg: 'px-6 py-3 text-lg min-h-[120px]',
    };

    const containerClasses = twMerge(
      'relative',
      fullWidth && 'w-full',
      className
    );

    const textareaClasses = twMerge(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:border-red-400 dark:focus:ring-red-400',
      autoResize && styles.autoResize,
      className
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize) {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
      }
      onChange?.(e);
    };

    return (
      <div className={containerClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {(helperText || error) && (
          <p
            className={twMerge(
              'mt-1 text-sm',
              error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
            )}
            id={error ? `${props.id}-error` : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
); 