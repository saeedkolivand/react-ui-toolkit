import React, { useState, useRef, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';

export interface DropdownItem {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface DropdownProps {
  /**
   * The trigger element that opens the dropdown
   */
  trigger: React.ReactElement;
  /**
   * The items to display in the dropdown menu
   */
  items: DropdownItem[];
  /**
   * Callback when an item is selected
   */
  onSelect?: (item: DropdownItem) => void;
  /**
   * The position of the dropdown menu relative to the trigger
   */
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /**
   * Whether the dropdown is disabled
   */
  disabled?: boolean;
  /**
   * Additional classes to be applied to the dropdown menu
   */
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  position = 'bottom-left',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current || !menuRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    const spacing = 4;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'bottom-left':
        top = triggerRect.bottom + spacing;
        left = triggerRect.left;
        break;
      case 'bottom-right':
        top = triggerRect.bottom + spacing;
        left = triggerRect.right - menuRect.width;
        break;
      case 'top-left':
        top = triggerRect.top - menuRect.height - spacing;
        left = triggerRect.left;
        break;
      case 'top-right':
        top = triggerRect.top - menuRect.height - spacing;
        left = triggerRect.right - menuRect.width;
        break;
    }

    setMenuPosition({ top, left });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      requestAnimationFrame(updatePosition);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      onSelect?.(item);
      setIsOpen(false);
    }
  };

  const menuClasses = twMerge(
    'absolute bg-white rounded-md shadow-lg py-1 z-50',
    'border border-gray-200',
    'min-w-[200px] max-h-[300px] overflow-y-auto',
    !isOpen && 'hidden',
    className
  );

  const clonedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: handleTriggerClick,
    'aria-expanded': isOpen,
    'aria-haspopup': true,
  });

  return (
    <>
      {clonedTrigger}
      {createPortal(
        <div
          ref={menuRef}
          className={menuClasses}
          style={{
            top: menuPosition.top,
            left: menuPosition.left,
          }}
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={item.value}
              className={twMerge(
                'w-full px-4 py-2 text-left text-sm',
                'flex items-center gap-2',
                !item.disabled && 'hover:bg-gray-100',
                item.disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              role="menuitem"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}; 