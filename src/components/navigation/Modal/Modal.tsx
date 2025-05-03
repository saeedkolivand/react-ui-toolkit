import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback when the modal should close
   */
  onClose: () => void;
  /**
   * The size of the modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Whether to close the modal when clicking the backdrop
   */
  closeOnBackdropClick?: boolean;
  /**
   * Whether to close the modal when pressing escape
   */
  closeOnEsc?: boolean;
  /**
   * Whether to center the modal vertically
   */
  centered?: boolean;
  /**
   * Whether to show a scrollbar when content overflows
   */
  scrollable?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      className,
      children,
      isOpen,
      onClose,
      size = 'md',
      showCloseButton = true,
      closeOnBackdropClick = true,
      closeOnEsc = true,
      centered = true,
      scrollable = true,
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
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      full: 'sm:max-w-full sm:m-4',
    };

    const modalClasses = twMerge(
      'relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full mx-auto',
      'transform transition-all ease-in-out duration-300',
      sizeClasses[size],
      scrollable && 'max-h-[calc(100vh-2rem)] overflow-y-auto',
      className
    );

    const backdropClasses = twMerge(
      'fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70',
      'transform transition-opacity duration-300 ease-in-out'
    );

    const containerClasses = twMerge(
      'fixed inset-0 z-50 overflow-y-auto',
      centered ? 'flex items-center' : 'flex items-start',
      'p-4 sm:p-6 md:p-8'
    );

    if (!isOpen) return null;

    return createPortal(
      <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <div
          className={backdropClasses}
          onClick={closeOnBackdropClick ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className={containerClasses}>
          <div ref={ref} className={modalClasses} {...props}>
            {showCloseButton && (
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
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
        </div>
      </div>,
      document.body
    );
  }
);
