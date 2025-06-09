import React, { useEffect, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { Button, Icon } from "@/components";

export interface DrawerProps extends Omit<HTMLMotionProps<"div">, "ref" | "children"> {
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
  position?: "left" | "right" | "top" | "bottom";
  /**
   * The size of the drawer
   */
  size?: "sm" | "md" | "lg" | "xl" | "full";
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
  children: ReactNode;
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      className,
      children,
      isOpen,
      onClose,
      position = "right",
      size = "md",
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
          if (event.key === "Escape") {
            onClose();
          }
        };
        document.addEventListener("keydown", handleEsc);
        return () => {
          document.removeEventListener("keydown", handleEsc);
        };
      }
    }, [isOpen, closeOnEsc, onClose]);

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = "";
        };
      }
    }, [isOpen]);

    const sizeClasses = {
      sm: "w-72",
      md: "w-96",
      lg: "w-[32rem]",
      xl: "w-[40rem]",
      full: "w-screen",
    };

    const positionClasses = {
      left: "left-0 top-0 bottom-0",
      right: "right-0 top-0 bottom-0",
      top: "top-0 left-0 right-0",
      bottom: "bottom-0 left-0 right-0",
    };

    const drawerClasses = twMerge(
      "fixed bg-white dark:bg-gray-800 shadow-xl",
      position === "left" || position === "right" ? sizeClasses[size] : "",
      position === "left" || position === "right" ? "h-full" : "w-full",
      positionClasses[position],
      className
    );

    const backdropClasses = twMerge("fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70");

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <div
            data-testid="drawer-dialog"
            className="relative z-50"
            aria-labelledby="drawer-title"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              data-testid="drawer-backdrop"
              className={backdropClasses}
              onClick={handleBackdropClick}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Drawer */}
            <motion.div
              ref={ref}
              className={drawerClasses}
              initial={{
                opacity: 0,
                x: position === "left" ? "-100%" : position === "right" ? "100%" : 0,
                y: position === "top" ? "-100%" : position === "bottom" ? "100%" : 0,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                opacity: 0,
                x: position === "left" ? "-100%" : position === "right" ? "100%" : 0,
                y: position === "top" ? "-100%" : position === "bottom" ? "100%" : 0,
              }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
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

Drawer.displayName = "Drawer";
