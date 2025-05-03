import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Option({ value, children, disabled = false, className, ...props }: OptionProps) {
  const baseClasses = 'transition-colors duration-200 ease-in-out';
  
  const stateClasses = {
    default: 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700',
    disabled: 'text-gray-400 dark:text-gray-500 cursor-not-allowed bg-gray-50 dark:bg-gray-800',
  };

  const classes = twMerge(
    baseClasses,
    disabled ? stateClasses.disabled : stateClasses.default,
    className
  );

  return (
    <option
      value={value}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </option>
  );
} 