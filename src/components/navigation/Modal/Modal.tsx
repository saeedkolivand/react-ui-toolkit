import React, { useEffect, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { Button } from '../../base/Button/Button';
import { Icon } from '../../base/Icon/Icon';

export interface ModalProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
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
  /**
   * The content of the modal
   */
  children: ReactNode;
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
      sizeClasses[size],
      scrollable && 'max-h-[calc(100vh-2rem)] overflow-y-auto',
      className
    );

    const backdropClasses = twMerge(
      'fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70'
    );

    const containerClasses = twMerge(
      'fixed inset-0 z-50 overflow-y-auto',
      centered ? 'flex items-center justify-center' : 'flex items-start',
      'p-4 sm:p-6 md:p-8'
    );

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              className={backdropClasses}
              onClick={closeOnBackdropClick ? onClose : undefined}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Modal */}
            <div className={containerClasses}>
              <motion.div
                ref={ref}
                className={modalClasses}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: -10 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                style={{ transform: 'translateY(-10%)' }}
                {...props}
              >
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <Icon name="close" size="lg" />
                  </Button>
                )}
                {children}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);
