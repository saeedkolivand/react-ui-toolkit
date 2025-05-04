import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from './Switch';

describe('Switch Component', () => {
  it('renders with default props', () => {
    render(<Switch />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveClass('w-11 h-6');
  });

  it('renders with label', () => {
    render(<Switch label="Test Label" />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'];

    sizes.forEach(size => {
      const { unmount } = render(<Switch size={size as any} label={`Size ${size}`} />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass(
        `w-${size === 'sm' ? '8' : size === 'md' ? '11' : '14'} h-${
          size === 'sm' ? '4' : size === 'md' ? '6' : '7'
        }`
      );
      unmount();
    });
  });

  it('handles checked state changes', () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows error state', () => {
    render(<Switch error="This is an error" label="Error switch" />);

    const label = screen.getByText('Error switch');
    expect(label).toHaveClass('text-red-500');
  });

  it('shows helper text', () => {
    render(<Switch helperText="This is helper text" label="Switch with helper" />);

    const helperText = screen.getByText('This is helper text');
    expect(helperText).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Switch disabled label="Disabled switch" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('opacity-50');
    expect(switchElement).toHaveClass('cursor-not-allowed');
  });

  it('shows loading state', () => {
    render(<Switch loading label="Loading switch" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('cursor-wait');
    expect(switchElement.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Switch className="custom-class" />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('custom-class');
  });

  it('forwards additional HTML attributes', () => {
    render(<Switch name="test-switch" required aria-label="Test switch" />);

    const input = screen.getByRole('checkbox');
    expect(input).toHaveAttribute('name', 'test-switch');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-label', 'Test switch');
  });

  it('does not trigger onChange when disabled', () => {
    const handleChange = jest.fn();
    render(<Switch disabled onChange={handleChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not trigger onChange when loading', () => {
    const handleChange = jest.fn();
    render(<Switch loading onChange={handleChange} />);

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(handleChange).not.toHaveBeenCalled();
  });
});
