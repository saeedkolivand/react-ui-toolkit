import React from "react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Option as OptionComponent } from "./Option";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  size?: "sm" | "md" | "lg";
  error?: boolean;
  errorMessage?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
  name?: string;
  required?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  size = "md",
  error = false,
  errorMessage,
  label,
  disabled = false,
  className,
  children,
  placeholder = "Select an option",
  name,
  required,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  const baseClasses =
    "block w-full rounded-md border transition-all duration-200 ease-in-out appearance-none outline-none bg-white dark:bg-gray-800 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700";

  const sizeClasses = {
    sm: "text-sm px-2 py-1.5",
    md: "text-base px-3 py-2",
    lg: "text-lg px-4 py-3",
  };

  const stateClasses = {
    default:
      "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-0 dark:border-gray-600 dark:hover:border-gray-500",
    error:
      "border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-0 dark:border-red-400 dark:hover:border-red-300",
  };

  const selectClasses = twMerge(
    baseClasses,
    sizeClasses[size],
    error ? stateClasses.error : stateClasses.default,
    "pr-10", // Space for the custom dropdown indicator
    className
  );

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const selectedOption = options?.find(opt => opt.value === value);

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            maxHeight: "200px",
            overflowY: "auto",
          }}
          role="listbox"
          aria-label="Select options"
        >
          {options?.map((option, index) => (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                option.value === value ? "bg-gray-100 dark:bg-gray-700" : ""
              } ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => {
                if (!option.disabled) {
                  onChange({
                    target: { value: option.value },
                  } as React.ChangeEvent<HTMLSelectElement>);
                  setIsOpen(false);
                }
              }}
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled}
            >
              {option.label}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    },
    [disabled, isOpen]
  );

  const handleFocus = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(true);
  }, []);

  const handleBlur = React.useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(false);
  }, []);

  // Filter out select-specific props that shouldn't be passed to the div
  const { onClick, onFocus, onBlur, ...divProps } = props as any;

  const buttonClasses = twMerge(
    "block w-full rounded-md border transition-all duration-200 ease-in-out appearance-none outline-none",
    "bg-white dark:bg-gray-800",
    "cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700",
    "text-base px-3 py-2",
    "border-gray-300 hover:border-gray-400 focus:border-primary-500 focus:ring-0",
    "dark:border-gray-600 dark:hover:border-gray-500",
    "pr-10",
    className
  );

  const ariaLabel = label || "Select an option";

  return (
    <div className="relative" ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <motion.div whileFocus={{ scale: 1.01 }} className="relative">
          <input
            type="text"
            readOnly
            className={selectClasses}
            onClick={handleClick}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={0}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls="select-options"
            aria-label={ariaLabel}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error && errorMessage ? `${props.id}-error` : undefined}
            value={selectedOption?.label || placeholder}
            name={name}
            required={required}
            {...divProps}
          />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </div>

      {createPortal(dropdownContent, document.body)}

      <AnimatePresence>
        {error && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
            id={`${props.id}-error`}
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export const Option = OptionComponent;
