import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  const defaultTabs = [
    {
      label: 'Tab 1',
      content: 'Content 1',
    },
    {
      label: 'Tab 2',
      content: 'Content 2',
    },
    {
      label: 'Tab 3',
      content: 'Content 3',
    },
  ];

  const onTabChange = jest.fn();

  beforeEach(() => {
    onTabChange.mockClear();
  });

  it('renders all tab labels', () => {
    render(<Tabs tabs={defaultTabs} />);

    defaultTabs.forEach(tab => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it('shows first tab content by default', () => {
    render(<Tabs tabs={defaultTabs} />);

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('switches content when clicking tabs', () => {
    render(<Tabs tabs={defaultTabs} />);

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('calls onTabChange when switching tabs', () => {
    render(<Tabs tabs={defaultTabs} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByText('Tab 2'));
    expect(onTabChange).toHaveBeenCalledWith(1);
  });

  it('respects defaultActiveTab prop', () => {
    render(<Tabs tabs={defaultTabs} defaultActiveTab={1} />);

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
  });

  it('does not switch to disabled tabs', () => {
    const tabsWithDisabled = [
      ...defaultTabs.slice(0, 1),
      {
        label: 'Disabled Tab',
        content: 'Disabled Content',
        disabled: true,
      },
      ...defaultTabs.slice(2),
    ];

    render(<Tabs tabs={tabsWithDisabled} onTabChange={onTabChange} />);

    fireEvent.click(screen.getByText('Disabled Tab'));
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Disabled Content')).not.toBeInTheDocument();
    expect(onTabChange).not.toHaveBeenCalled();
  });

  it('applies correct orientation classes', () => {
    const { container, rerender } = render(<Tabs tabs={defaultTabs} orientation="vertical" />);

    expect(container.firstChild).toHaveClass('flex-row');

    rerender(<Tabs tabs={defaultTabs} orientation="horizontal" />);
    expect(container.firstChild).toHaveClass('flex-col');
  });

  it('applies variant styles correctly', () => {
    const { container, rerender } = render(<Tabs tabs={defaultTabs} variant="enclosed" />);

    expect(screen.getByRole('tablist').firstChild).toHaveClass('border-b');
  });

  it('stretches tabs when isFitted is true', () => {
    render(<Tabs tabs={defaultTabs} isFitted />);

    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab).toHaveClass('flex-1');
    });
  });

  it('renders rich content in tabs', () => {
    const richTabs = [
      {
        label: <div data-testid="rich-label">Rich Label</div>,
        content: <div data-testid="rich-content">Rich Content</div>,
      },
    ];

    render(<Tabs tabs={richTabs} />);

    expect(screen.getByTestId('rich-label')).toBeInTheDocument();
    expect(screen.getByTestId('rich-content')).toBeVisible();
  });
});
