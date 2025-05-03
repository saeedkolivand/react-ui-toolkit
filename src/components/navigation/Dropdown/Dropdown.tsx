import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

export interface DropdownProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  trigger?: 'hover' | 'click';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
  className?: string;
  overlayClassName?: string;
}

export interface MenuItemProps {
  key: string;
  children: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface MenuProps {
  children: React.ReactNode;
  className?: string;
}

export function Menu({ children, className }: MenuProps) {
  return <div className={twMerge('py-1 min-w-[120px]', className)}>{children}</div>;
}

export function MenuItem({
  key,
  children,
  disabled = false,
  danger = false,
  className,
  onClick,
}: MenuItemProps) {
  const baseClasses =
    'px-4 py-2 text-sm transition-colors duration-200 ease-in-out cursor-pointer flex items-center';

  const stateClasses = {
    default: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700',
    disabled: 'text-gray-400 cursor-not-allowed dark:text-gray-500',
    danger: 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20',
  };

  const classes = twMerge(
    baseClasses,
    disabled ? stateClasses.disabled : danger ? stateClasses.danger : stateClasses.default,
    className
  );

  return (
    <div key={key} className={classes} onClick={disabled ? undefined : onClick}>
      {children}
    </div>
  );
}

Menu.Item = MenuItem;

export function Dropdown({
  children,
  overlay,
  trigger = 'hover',
  placement = 'bottom',
  disabled = false,
  className,
  overlayClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (trigger === 'hover' && !disabled) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' && !disabled) {
      setIsOpen(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click' && !disabled) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const overlayRect = overlayRef.current?.getBoundingClientRect() || { width: 0, height: 0 };
      const spacing = 8; // Increased to 8px spacing

      let top = rect.bottom + window.scrollY + spacing;
      let left = rect.left + window.scrollX;

      switch (placement) {
        case 'top':
          top = rect.top + window.scrollY - overlayRect.height - spacing;
          break;
        case 'left':
          left = rect.left + window.scrollX - overlayRect.width - spacing;
          break;
        case 'right':
          left = rect.right + window.scrollX + spacing;
          break;
        default:
          break;
      }

      setPosition({ top, left });
    }
  }, [isOpen, placement]);

  const overlayContent = (
    <AnimatePresence>
      {isOpen && !disabled && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={twMerge(
            'fixed z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700',
            overlayClassName
          )}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          {overlay}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div
      ref={dropdownRef}
      className={twMerge('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {createPortal(overlayContent, document.body)}
    </div>
  );
}
