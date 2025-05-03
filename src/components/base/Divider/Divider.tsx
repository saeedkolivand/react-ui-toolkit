import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The direction of the divider
   * @default 'horizontal'
   */
  type?: 'horizontal' | 'vertical';
  /**
   * The orientation of the divider text
   * @default 'center'
   */
  orientation?: 'left' | 'right' | 'center';
  /**
   * Whether the divider is dashed
   * @default false
   */
  dashed?: boolean;
  /**
   * The text to show in the divider
   */
  children?: React.ReactNode;
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    { type = 'horizontal', orientation = 'center', dashed = false, children, className, ...props },
    ref
  ) => {
    const baseClasses = twMerge(
      'relative',
      type === 'horizontal' ? 'w-full h-px' : 'h-full w-px',
      dashed ? 'border-dashed' : 'border-solid',
      'border-gray-300',
      className
    );

    if (children && type === 'horizontal') {
      return (
        <div className="flex items-center w-full my-4">
          <div
            className={twMerge(
              'flex-1 h-px',
              dashed ? 'border-dashed' : 'border-solid',
              'border-t-2 border-gray-300',
              orientation === 'left' ? 'w-1/4' : orientation === 'right' ? 'w-3/4' : 'w-full'
            )}
          />
          <span className="px-4 text-gray-500 text-sm whitespace-nowrap">{children}</span>
          <div
            className={twMerge(
              'flex-1 h-px',
              dashed ? 'border-dashed' : 'border-solid',
              'border-t-2 border-gray-300',
              orientation === 'left' ? 'w-3/4' : orientation === 'right' ? 'w-1/4' : 'w-full'
            )}
          />
        </div>
      );
    }

    return <div ref={ref} className={baseClasses} {...props} />;
  }
);

Divider.displayName = 'Divider';
