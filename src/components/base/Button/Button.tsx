import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'success'
    | 'error'
    | 'warning'
    | 'info';
  /**
   * The size of the button
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Whether the button is in a loading state
   */
  loading?: boolean;
  /**
   * Whether the button is full width
   */
  fullWidth?: boolean;
  /**
   * Icon to display in the button
   */
  icon?: string;
  /**
   * Position of the icon relative to the text
   */
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800';

  const variantClasses = {
    primary:
      'bg-primary text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-400',
    secondary:
      'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 dark:bg-secondary-500 dark:hover:bg-secondary-600 dark:focus:ring-secondary-400',
    outline:
      'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:border-primary-400 dark:text-primary-300 dark:hover:bg-primary-900/30 dark:focus:ring-primary-400',
    ghost:
      'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 dark:text-primary-300 dark:hover:bg-primary-900/30 dark:focus:ring-primary-400',
    success:
      'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-400',
    error:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400',
    warning:
      'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-400',
    info: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    loading &&
      'relative cursor-wait after:content-[""] after:absolute after:inset-0 after:bg-white/15 after:rounded-md',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const renderIcon = () => {
    if (!icon) return null;
    return (
      <span data-testid="icon" className={iconPosition === 'left' ? 'mr-2' : 'ml-2'}>
        {icon}
      </span>
    );
  };

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <span className="mr-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
          {children}
        </>
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          {children}
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  );
};
