import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  /**
   * The label of the tab
   */
  label: React.ReactNode;
  /**
   * The content of the tab panel
   */
  content: React.ReactNode;
  /**
   * Whether the tab is disabled
   */
  disabled?: boolean;
}

export interface TabsProps {
  /**
   * The tabs to display
   */
  tabs: TabItem[];
  /**
   * The index of the initially active tab
   */
  defaultActiveTab?: number;
  /**
   * The orientation of the tabs
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The variant of the tabs
   */
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
  /**
   * Whether to stretch the tabs to full width
   */
  isFitted?: boolean;
  /**
   * Additional classes to be applied to the tabs container
   */
  className?: string;
  /**
   * Callback when a tab is selected
   */
  onTabChange?: (index: number) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab = 0,
  orientation = 'horizontal',
  variant = 'line',
  isFitted = false,
  className,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  useEffect(() => {
    if (defaultActiveTab !== undefined && defaultActiveTab !== activeTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  const handleTabClick = (index: number) => {
    if (!tabs[index].disabled) {
      setActiveTab(index);
      onTabChange?.(index);
    }
  };

  const containerClasses = twMerge(
    'flex',
    orientation === 'vertical' ? 'flex-row' : 'flex-col',
    className
  );

  const tabListClasses = twMerge(
    'flex',
    orientation === 'vertical' ? 'flex-col' : 'flex-row',
    variant === 'enclosed' && 'border-b border-gray-200 dark:border-gray-700',
    variant === 'soft-rounded' && 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
    variant === 'solid-rounded' && 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'
  );

  const getTabClasses = (index: number) => {
    const isActive = index === activeTab;
    const isDisabled = tabs[index].disabled;

    return twMerge(
      'px-4 py-2 text-sm font-medium transition-colors duration-200',
      isFitted && 'flex-1 text-center',
      isDisabled && 'opacity-50 cursor-not-allowed',
      !isDisabled && 'cursor-pointer hover:text-primary-600 dark:hover:text-primary-400',
      variant === 'line' && [
        'border-b-2',
        isActive
          ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
          : 'border-transparent text-gray-500 dark:text-gray-400',
      ],
      variant === 'enclosed' && [
        'border-b-2 -mb-px',
        isActive
          ? 'border-primary-600 border-t border-l border-r rounded-t-lg bg-white text-primary-600 dark:bg-gray-800 dark:border-gray-700 dark:text-primary-400'
          : 'border-transparent text-gray-500 dark:text-gray-400',
      ],
      variant === 'soft-rounded' && [
        'rounded-md',
        isActive
          ? 'bg-white text-primary-600 shadow dark:bg-gray-700 dark:text-primary-400'
          : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700',
      ],
      variant === 'solid-rounded' && [
        'rounded-md',
        isActive
          ? 'bg-primary-600 text-white dark:bg-primary-500'
          : 'text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700',
      ]
    );
  };

  const panelClasses = twMerge(
    'mt-4 text-gray-900 dark:text-gray-100',
    orientation === 'vertical' && 'mt-0 ml-4'
  );

  return (
    <div className={containerClasses} role="tablist">
      <div className={tabListClasses}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={getTabClasses(index)}
            onClick={() => handleTabClick(index)}
            role="tab"
            aria-selected={index === activeTab}
            aria-controls={`panel-${index}`}
            disabled={tab.disabled}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={panelClasses}>
        {tabs.map((tab, index) => (
          <div
            key={index}
            id={`panel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            hidden={index !== activeTab}
          >
            {index === activeTab && tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}; 