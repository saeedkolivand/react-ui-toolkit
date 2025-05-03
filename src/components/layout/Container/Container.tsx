import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Maximum width of the container
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none';
  /**
   * Whether to add padding to the container
   */
  padding?: boolean;
  /**
   * Whether the container should be centered
   */
  center?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      className,
      maxWidth = 'lg',
      padding = true,
      center = true,
      children,
      ...props
    },
    ref
  ) => {
    const maxWidthClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
      none: '',
    };

    const containerClasses = twMerge(
      'w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
      maxWidthClasses[maxWidth],
      padding && 'px-4 sm:px-6 lg:px-8',
      center && 'mx-auto',
      className
    );

    return (
      <div
        ref={ref}
        className={containerClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
); 