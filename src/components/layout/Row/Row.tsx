import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Horizontal alignment of columns
   */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /**
   * Vertical alignment of columns
   */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /**
   * Space between columns
   */
  spacing?: number;
  /**
   * Whether to wrap columns to multiple lines
   */
  wrap?: boolean;
  /**
   * Whether to reverse the order of columns
   */
  reverse?: boolean;
}

const getJustifyClass = (justify?: string) => {
  if (!justify) return '';
  switch (justify) {
    case 'start':
      return 'justify-start';
    case 'end':
      return 'justify-end';
    case 'center':
      return 'justify-center';
    case 'between':
      return 'justify-between';
    case 'around':
      return 'justify-around';
    case 'evenly':
      return 'justify-evenly';
    default:
      return '';
  }
};

const getAlignClass = (align?: string) => {
  if (!align) return '';
  switch (align) {
    case 'start':
      return 'items-start';
    case 'end':
      return 'items-end';
    case 'center':
      return 'items-center';
    case 'baseline':
      return 'items-baseline';
    case 'stretch':
      return 'items-stretch';
    default:
      return '';
  }
};

export const Row = React.forwardRef<HTMLDivElement, RowProps>(
  ({ justify, align, spacing, wrap, reverse, className, ...props }, ref) => {
    const rowClasses = twMerge(
      'flex flex-wrap',
      getJustifyClass(justify),
      getAlignClass(align),
      spacing && `gap-${spacing}`,
      wrap ? 'flex-wrap' : 'flex-nowrap',
      reverse && 'flex-row-reverse',
      className
    );

    return <div ref={ref} className={rowClasses} {...props} />;
  }
);

Row.displayName = 'Row';
