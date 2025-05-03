import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the drawer is open
   */
  isOpen: boolean;
  /**
   * Callback when the drawer should close
   */
  onClose: () => void;
  /**
   * The position of the drawer
   */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /**
   * The size of the drawer (width for left/right, height for top/bottom)
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to close the drawer when clicking the backdrop
   */
  closeOnBackdropClick?: boolean;
  /**
   * Whether to close the drawer when pressing escape
   */
  closeOnEsc?: boolean;
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      children,
      isOpen,
      onClose,
      position = 'right',
      size = 'md',
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEsc = true,
      ...props
    },
    ref
  ) => {
    useEffect(() => {
      if (isOpen && closeOnEsc) {
        const handleEsc = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
        document.addEventListener('keydown', handleEsc);
        return () => {
          document.removeEventListener('keydown', handleEsc);
        };
      }
    }, [isOpen, closeOnEsc, onClose]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = '';
        };
      }
    }, [isOpen]);

    const sizeClasses = {
      sm: position === 'left' || position === 'right' ? 'w-72' : 'h-72',
      md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
      lg: position === 'left' || position === 'right' ? 'w-[32rem]' : 'h-[32rem]',
      xl: position === 'left' || position === 'right' ? 'w-[40rem]' : 'h-[40rem]',
      full: position === 'left' || position === 'right' ? 'w-screen' : 'h-screen',
    };

    const positionClasses = {
      left: 'left-0 top-0 bottom-0',
      right: 'right-0 top-0 bottom-0',
      top: 'top-0 left-0 right-0',
      bottom: 'bottom-0 left-0 right-0',
    };

    const transformClasses = {
      left: 'transform -translate-x-full',
      right: 'transform translate-x-full',
      top: 'transform -translate-y-full',
      bottom: 'transform translate-y-full',
    };

    const drawerClasses = twMerge(
      'fixed bg-white shadow-xl',
      'transition-transform duration-300 ease-in-out',
      sizeClasses[size],
      positionClasses[position],
      !isOpen && transformClasses[position],
      className
    );

    const backdropClasses = twMerge(
      'fixed inset-0 bg-black bg-opacity-50',
      'transition-opacity duration-300 ease-in-out',
      !isOpen && 'opacity-0 pointer-events-none'
    );

    if (!isOpen) return null;

    return createPortal(
      <div className="relative z-50" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div
          className={backdropClasses}
          onClick={closeOnBackdropClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Drawer */}
        <div ref={ref} className={drawerClasses} {...props}>
          {showCloseButton && (
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
