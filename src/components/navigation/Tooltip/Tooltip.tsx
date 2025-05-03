import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';

export interface TooltipProps {
  /**
   * The content to be displayed in the tooltip
   */
  content: React.ReactNode;
  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement;
  /**
   * The position of the tooltip relative to the trigger element
   */
  position?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * The delay before showing the tooltip (in milliseconds)
   */
  showDelay?: number;
  /**
   * The delay before hiding the tooltip (in milliseconds)
   */
  hideDelay?: number;
  /**
   * Whether the tooltip is disabled
   */
  disabled?: boolean;
  /**
   * Additional classes to be applied to the tooltip
   */
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  showDelay = 200,
  hideDelay = 100,
  disabled = false,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const spacing = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = triggerRect.top - tooltipRect.height - spacing;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.right + spacing;
        break;
      case 'bottom':
        top = triggerRect.bottom + spacing;
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        left = triggerRect.left - tooltipRect.width - spacing;
        break;
    }

    setTooltipPosition({ top, left });
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      requestAnimationFrame(updatePosition);
    }, showDelay);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const tooltipClasses = twMerge(
    'fixed px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg z-50',
    'transition-opacity duration-200',
    !isVisible && 'opacity-0 pointer-events-none',
    className
  );

  const clonedTrigger = React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  });

  return (
    <>
      {clonedTrigger}
      {createPortal(
        <div
          ref={tooltipRef}
          className={tooltipClasses}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
          role="tooltip"
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}; 