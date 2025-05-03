import React from 'react';
import classNames from 'classnames';
import { Option as OptionComponent, OptionProps } from './Option';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Select({
  value,
  onChange,
  options,
  size = 'md',
  disabled = false,
  className,
  children,
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={classNames(
        'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500',
        {
          'text-sm px-2 py-1': size === 'sm',
          'text-base px-3 py-2': size === 'md',
          'text-lg px-4 py-3': size === 'lg',
          'bg-gray-100 cursor-not-allowed': disabled,
          'bg-white': !disabled,
        },
        className
      )}
    >
      {options
        ? options.map((option) => (
            <OptionComponent
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </OptionComponent>
          ))
        : children}
    </select>
  );
}

export const Option = OptionComponent; 