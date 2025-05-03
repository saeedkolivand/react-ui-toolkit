import React from 'react';
import { twMerge } from 'tailwind-merge';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the spinner
   */
  size?: SpinnerSize;
  /**
   * The variant of the spinner
   */
  variant?: SpinnerVariant;
  /**
   * The label for screen readers
   */
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  size = 'md',
  variant = 'primary',
  label = 'Loading...',
  ...props
}) => {
  const baseClasses =
    'inline-block animate-spin rounded-full border-2 border-current border-t-transparent';

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const variantClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  const classes = twMerge(baseClasses, sizeClasses[size], variantClasses[variant], className);

  return (
    <div role="status" {...props}>
      <div className={classes} />
      <span className="sr-only">{label}</span>
    </div>
  );
};
