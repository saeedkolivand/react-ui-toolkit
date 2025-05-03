import React from 'react';
import { twMerge } from 'tailwind-merge';

export type ProgressSize = 'sm' | 'md' | 'lg';
export type ProgressVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

const sizeTextClasses: Record<ProgressSize, string> = {
  sm: 'text-[10px] leading-3',
  md: 'text-xs',
  lg: 'text-sm',
};

const variantClasses: Record<ProgressVariant, string> = {
  primary: 'bg-primary-600',
  secondary: 'bg-gray-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-600',
  error: 'bg-red-600',
};

const variantTrackClasses: Record<ProgressVariant, string> = {
  primary: 'bg-primary-100',
  secondary: 'bg-gray-200',
  success: 'bg-green-100',
  warning: 'bg-yellow-100',
  error: 'bg-red-100',
};

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The current value of the progress bar (0-100)
   */
  value?: number;
  /**
   * The maximum value of the progress bar
   */
  max?: number;
  /**
   * The variant of the progress bar
   */
  variant?: ProgressVariant;
  /**
   * The size of the progress bar
   */
  size?: ProgressSize;
  /**
   * Whether to show the value label
   */
  showValue?: boolean;
  /**
   * Whether to show stripes
   */
  striped?: boolean;
  /**
   * Whether to animate the stripes
   */
  animated?: boolean;
  /**
   * Whether the progress is indeterminate
   */
  indeterminate?: boolean;
  /**
   * Label for accessibility
   */
  label?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  className,
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showValue = false,
  striped = false,
  animated = false,
  indeterminate = false,
  label,
  ...props
}): JSX.Element => {
  const isIndeterminate = indeterminate || typeof value !== 'number';
  const percentage = isIndeterminate ? 0 : Math.min(100, Math.max(0, (value! / max) * 100));
  
  const baseClasses = 'relative w-full min-w-[8rem] overflow-hidden rounded-full transition-all duration-300';
  const containerClasses = twMerge(
    baseClasses,
    variantTrackClasses[variant],
    sizeClasses[size],
    className
  );

  const stripedClasses = striped && !isIndeterminate
    ? 'bg-[length:1rem_100%] bg-gradient-to-r from-white/20 via-white/20 to-transparent bg-repeat-x'
    : '';

  const animationClasses = animated ? (
    isIndeterminate 
      ? 'relative before:absolute before:inset-0 before:w-1/3 before:animate-indeterminate before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent'
      : striped 
        ? 'animate-progress-stripes'
        : ''
  ) : '';

  const progressClasses = twMerge(
    'absolute inset-0 flex items-center transition-all duration-300 ease-out',
    variantClasses[variant],
    stripedClasses,
    animationClasses,
    isIndeterminate ? 'w-full' : undefined
  );

  const valueClasses = twMerge(
    'absolute inset-0 flex items-center justify-center font-medium text-white',
    sizeTextClasses[size]
  );

  const valueLabel = isIndeterminate ? 'Loading...' : `${Math.round(percentage)}%`;
  const ariaLabel = label || `Progress ${isIndeterminate ? 'loading' : `${Math.round(percentage)}%`}`;

  return (
    <div
      className={containerClasses}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={isIndeterminate ? undefined : value}
      aria-valuetext={valueLabel}
      {...props}
    >
      <div 
        className={progressClasses} 
        style={isIndeterminate ? undefined : { width: `${percentage}%` }}
      >
        {showValue && !isIndeterminate && size !== 'sm' && (
          <span className={valueClasses}>{valueLabel}</span>
        )}
      </div>
    </div>
  );
}; 