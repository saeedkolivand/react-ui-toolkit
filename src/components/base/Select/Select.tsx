import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Option as OptionComponent, OptionProps } from './Option';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  errorMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Select({
  value,
  onChange,
  options,
  size = 'md',
  error = false,
  errorMessage,
  label,
  disabled = false,
  className,
  children,
  ...props
}: SelectProps) {
  const baseClasses =
    'block w-full rounded-md border transition-all duration-200 ease-in-out appearance-none outline-none bg-white dark:bg-gray-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700';

  const sizeClasses = {
    sm: 'text-sm px-2 py-1.5',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  const stateClasses = {
    default:
      'border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-0 dark:border-gray-600 dark:hover:border-gray-500',
    error:
      'border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-0 dark:border-red-400 dark:hover:border-red-300',
  };

  const selectClasses = twMerge(
    baseClasses,
    sizeClasses[size],
    error ? stateClasses.error : stateClasses.default,
    'pr-10', // Space for the custom dropdown indicator
    className
  );

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={selectClasses}
          {...props}
        >
          {options
            ? options.map(option => (
                <OptionComponent key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </OptionComponent>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}

export const Option = OptionComponent;
