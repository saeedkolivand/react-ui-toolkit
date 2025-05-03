import React from 'react';
import classNames from 'classnames';

export interface OptionProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Option({ value, children, disabled = false, className }: OptionProps) {
  return (
    <option
      value={value}
      disabled={disabled}
      className={classNames(
        'px-3 py-2 text-sm',
        {
          'text-gray-400 cursor-not-allowed': disabled,
          'text-gray-900': !disabled,
        },
        className
      )}
    >
      {children}
    </option>
  );
} 