import React, { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, HTMLMotionProps, Variants } from 'framer-motion';
import { Button } from '../../base/Button/Button';
import { Icon } from '../../base/Icon';

export interface DrawerProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
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
  /**
   * The content of the drawer
   */
  children: React.ReactNode;
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

    const drawerVariants: Variants = {
      open: {
        x: position === 'left' ? 0 : position === 'right' ? 0 : 0,
        y: position === 'top' ? 0 : position === 'bottom' ? 0 : 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
      closed: {
        x: position === 'left' ? '-100%' : position === 'right' ? '100%' : 0,
        y: position === 'top' ? '-100%' : position === 'bottom' ? '100%' : 0,
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      },
    };

    const backdropVariants: Variants = {
      open: {
        opacity: 1,
        transition: {
          duration: 0.2,
        },
      },
      closed: {
        opacity: 0,
        transition: {
          duration: 0.2,
        },
      },
    };

    const drawerClasses = twMerge(
      'fixed bg-white shadow-xl',
      sizeClasses[size],
      positionClasses[position],
      className
    );

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div className="relative z-50" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeOnBackdropClick ? onClose : undefined}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              ref={ref}
              className={drawerClasses}
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
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
        )}
      </AnimatePresence>,
      document.body
    );
  }
);

Drawer.displayName = 'Drawer';
