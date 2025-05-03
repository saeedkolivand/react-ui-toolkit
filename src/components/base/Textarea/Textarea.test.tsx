import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Textarea helperText="Maximum 500 characters" />);
    expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Textarea variant="default" />);
    expect(screen.getByRole('textbox')).toHaveClass('bg-white');

    rerender(<Textarea variant="filled" />);
    expect(screen.getByRole('textbox')).toHaveClass('bg-gray-100');

    rerender(<Textarea variant="outlined" />);
    expect(screen.getByRole('textbox')).toHaveClass('bg-transparent');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Textarea size="sm" />);
    expect(screen.getByRole('textbox')).toHaveClass('text-sm');

    rerender(<Textarea size="md" />);
    expect(screen.getByRole('textbox')).toHaveClass('text-base');

    rerender(<Textarea size="lg" />);
    expect(screen.getByRole('textbox')).toHaveClass('text-lg');
  });

  it('handles change events', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);
    
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disables textarea when disabled prop is true', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('textbox')).toHaveClass('disabled:bg-gray-100');
  });

  it('auto-resizes when autoResize prop is true', () => {
    render(<Textarea autoResize />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('autoResize');

    // Mock scrollHeight
    Object.defineProperty(textarea, 'scrollHeight', { value: 100 });
    fireEvent.change(textarea, { target: { value: 'test\ntest\ntest' } });
    expect(textarea.style.height).toBe('100px');
  });
}); 