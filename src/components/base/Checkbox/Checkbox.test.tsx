import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox Component', () => {
  it('renders with default props', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass('h-5 w-5');
  });

  it('renders with label', () => {
    render(<Checkbox label="Test Label" />);
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Test Label');
    expect(checkbox).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'];

    sizes.forEach(size => {
      const { unmount } = render(<Checkbox size={size as any} label={`Size ${size}`} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass(
        `h-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'} w-${
          size === 'sm' ? '4' : size === 'md' ? '5' : '6'
        }`
      );
      unmount();
    });
  });

  it('handles checked state changes', () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(checkbox).toBeChecked();
  });

  it('shows error state', () => {
    render(<Checkbox error errorMessage="This is an error" label="Error checkbox" />);

    const checkbox = screen.getByRole('checkbox');
    const errorMessage = screen.getByText('This is an error');

    expect(checkbox).toHaveClass('border-red-500');
    expect(errorMessage).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox disabled label="Disabled checkbox" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('opacity-50');
  });

  it('applies custom className', () => {
    render(<Checkbox className="custom-class" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('forwards additional HTML attributes', () => {
    render(<Checkbox name="test-checkbox" required aria-label="Test checkbox" />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('name', 'test-checkbox');
    expect(checkbox).toBeRequired();
    expect(checkbox).toHaveAttribute('aria-label', 'Test checkbox');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.type).toBe('checkbox');
  });
});
