import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface AccordionItem {
  /**
   * The title of the accordion item
   */
  title: React.ReactNode;
  /**
   * The content of the accordion item
   */
  content: React.ReactNode;
  /**
   * Whether the accordion item is disabled
   */
  disabled?: boolean;
}

export interface AccordionProps {
  /**
   * The items to display in the accordion
   */
  items: AccordionItem[];
  /**
   * Whether multiple panels can be expanded at once
   */
  allowMultiple?: boolean;
  /**
   * The index of the initially expanded panel(s)
   */
  defaultExpanded?: number | number[];
  /**
   * Additional classes to be applied to the accordion
   */
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultExpanded,
  className,
}) => {
  const [expandedPanels, setExpandedPanels] = useState<number[]>(() => {
    if (defaultExpanded === undefined) return [];
    return Array.isArray(defaultExpanded) ? defaultExpanded : [defaultExpanded];
  });

  const togglePanel = (index: number) => {
    if (items[index].disabled) return;

    setExpandedPanels(prev => {
      if (allowMultiple) {
        return prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index];
      }
      return prev.includes(index) ? [] : [index];
    });
  };

  const accordionClasses = twMerge(
    'divide-y divide-gray-200 border-t border-b border-gray-200',
    className
  );

  return (
    <div className={accordionClasses} role="tablist">
      {items.map((item, index) => {
        const isExpanded = expandedPanels.includes(index);

        return (
          <div key={index} className="py-2">
            <button
              className={twMerge(
                'w-full flex justify-between items-center py-2 px-4 text-left',
                'focus:outline-none',
                item.disabled && 'opacity-50 cursor-not-allowed',
                !item.disabled && 'hover:bg-gray-50'
              )}
              onClick={() => togglePanel(index)}
              disabled={item.disabled}
              aria-expanded={isExpanded}
              aria-controls={`panel-${index}`}
              role="tab"
            >
              <span className="font-medium">{item.title}</span>
              <svg
                className={twMerge(
                  'w-5 h-5 transform transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              id={`panel-${index}`}
              role="tabpanel"
              aria-hidden={!isExpanded}
              className={twMerge(
                'transition-all duration-200 overflow-hidden',
                isExpanded ? 'max-h-96' : 'max-h-0'
              )}
            >
              <div className="px-4 py-2">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
