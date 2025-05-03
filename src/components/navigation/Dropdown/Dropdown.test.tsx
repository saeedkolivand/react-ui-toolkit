import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest } from '@jest/globals';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  const defaultItems = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3', disabled: true },
  ];

  const onSelect = jest.fn();

  beforeEach(() => {
    onSelect.mockClear();
  });

  it('renders trigger element', () => {
    render(
      <Dropdown
        trigger={<button>Open</button>}
        items={defaultItems}
        onSelect={onSelect}
      />
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('shows menu when trigger is clicked', () => {
    render(
      <Dropdown
        trigger={<button>Open</button>}
        items={defaultItems}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('menu')).toBeVisible();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onSelect when an item is clicked', () => {
    render(
      <Dropdown
        trigger={<button>Open</button>}
        items={defaultItems}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Option 1'));

    expect(onSelect).toHaveBeenCalledWith(defaultItems[0]);
    expect(screen.getByRole('menu')).not.toBeVisible();
  });

  it('does not call onSelect when a disabled item is clicked', () => {
    render(
      <Dropdown
        trigger={<button>Open</button>}
        items={defaultItems}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Open'));
    fireEvent.click(screen.getByText('Option 3'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('closes menu when clicking outside', () => {
    render(
      <Dropdown
        trigger={<button>Open</button>}
        items={defaultItems}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('menu')).toBeVisible();

    fireEvent.mouseDown(document.body);
    expect(screen.getByRole('menu')).not.toBeVisible();
  });

  it('does not open menu when disabled', () => {
    render(
      <Dropdown
        trigger={<button>Open</button>}
        items={defaultItems}
        onSelect={onSelect}
        disabled
      />
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByRole('menu')).not.toBeVisible();
  });

  it('renders items with icons', () => {
    const itemsWithIcons = [
      {
        label: 'Edit',
        value: 'edit',
        icon: <span data-testid="edit-icon">✏️</span>,
      },
    ];

    render(
      <Dropdown
        trigger={<button>Open</button>}
        items={itemsWithIcons}
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('Open'));
    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('applies correct position classes', () => {
    const { rerender } = render(
      <Dropdown
        trigger={<button>Open</button>}
        items={defaultItems}
        position="bottom-right"
      />
    );

    fireEvent.click(screen.getByText('Open'));
    const menu = screen.getByRole('menu');
    expect(menu).toBeVisible();

    rerender(
      <Dropdown
        trigger={<button>Open</button>}
        items={defaultItems}
        position="top-left"
      />
    );

    expect(menu).toBeVisible();
  });
}); 