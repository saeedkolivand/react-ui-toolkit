import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders correctly', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Checkbox helperText="Please check this box" />);
    expect(screen.getByText('Please check this box')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Checkbox error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Checkbox size="sm" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-3', 'w-3');

    rerender(<Checkbox size="md" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-4', 'w-4');

    rerender(<Checkbox size="lg" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-5', 'w-5');
  });

  it('handles change events', () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disables checkbox when disabled prop is true', () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByRole('checkbox')).toHaveClass('disabled:opacity-50');
  });

  it('sets indeterminate state correctly', () => {
    render(<Checkbox indeterminate />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('updates indeterminate state when prop changes', () => {
    const { rerender } = render(<Checkbox indeterminate={false} />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(false);

    rerender(<Checkbox indeterminate={true} />);
    expect(checkbox.indeterminate).toBe(true);
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
}); 