import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders correctly', () => {
    render(<Switch />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Switch label="Toggle feature" />);
    expect(screen.getByText('Toggle feature')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Switch helperText="Enable this feature" />);
    expect(screen.getByText('Enable this feature')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Switch error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Switch size="sm" />);
    expect(screen.getByRole('checkbox').nextSibling).toHaveClass('w-8', 'h-4');

    rerender(<Switch size="md" />);
    expect(screen.getByRole('checkbox').nextSibling).toHaveClass('w-11', 'h-6');

    rerender(<Switch size="lg" />);
    expect(screen.getByRole('checkbox').nextSibling).toHaveClass('w-14', 'h-7');
  });

  it('handles change events', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} />);

    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disables switch when disabled prop is true', () => {
    render(<Switch disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByRole('checkbox').nextSibling).toHaveClass('opacity-50');
  });

  it('can be checked', () => {
    render(<Switch checked />);
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('checkbox').nextSibling).toHaveClass('bg-primary-600');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Switch ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('toggles between checked and unchecked states', () => {
    render(<Switch />);
    const checkbox = screen.getByRole('checkbox');
    const switchElement = checkbox.nextSibling;

    expect(checkbox).not.toBeChecked();
    expect(switchElement).toHaveClass('bg-gray-200');

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(switchElement).toHaveClass('bg-primary-600');

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(switchElement).toHaveClass('bg-gray-200');
  });
});
