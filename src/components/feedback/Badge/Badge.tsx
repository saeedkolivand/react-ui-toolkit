import React from 'react';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The variant of the badge
   */
  variant?: BadgeVariant;
  /**
   * The size of the badge
   */
  size?: BadgeSize;
  /**
   * Whether the badge is rounded
   */
  rounded?: boolean;
  /**
   * Whether the badge is outlined
   */
  outlined?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'primary',
  size = 'md',
  rounded = false,
  outlined = false,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors duration-200';

  const variantClasses = {
    primary: outlined
      ? 'border border-primary-500 text-primary-700 bg-transparent dark:border-primary-400 dark:text-primary-300'
      : 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300',
    secondary: outlined
      ? 'border border-gray-500 text-gray-700 bg-transparent dark:border-gray-400 dark:text-gray-300'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: outlined
      ? 'border border-green-500 text-green-700 bg-transparent dark:border-green-400 dark:text-green-300'
      : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    warning: outlined
      ? 'border border-yellow-500 text-yellow-700 bg-transparent dark:border-yellow-400 dark:text-yellow-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    error: outlined
      ? 'border border-red-500 text-red-700 bg-transparent dark:border-red-400 dark:text-red-300'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses,
    className
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
