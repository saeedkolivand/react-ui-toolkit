import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('text-base');
  });

  it('renders with label', () => {
    render(<Input label="Test Label" />);
    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders with different variants', () => {
    const variants = ['default', 'filled', 'outline'];

    variants.forEach(variant => {
      const { unmount } = render(
        <Input variant={variant as any} placeholder={`Variant ${variant}`} />
      );
      const input = screen.getByPlaceholderText(`Variant ${variant}`);
      expect(input).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'];

    sizes.forEach(size => {
      const { unmount } = render(<Input size={size as any} placeholder={`Size ${size}`} />);
      const input = screen.getByPlaceholderText(`Size ${size}`);
      expect(input).toHaveClass(`text-${size === 'sm' ? 'sm' : size === 'md' ? 'base' : 'lg'}`);
      unmount();
    });
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('shows error state', () => {
    render(<Input error={true} errorMessage="This is an error" label="Error input" />);

    const input = screen.getByRole('textbox');
    const errorMessage = screen.getByText('This is an error');

    expect(input).toHaveClass('border-red-500');
    expect(errorMessage).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<Input helperText="This is helper text" label="Input with helper" />);

    const helperText = screen.getByText('This is helper text');
    expect(helperText).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled label="Disabled input" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards additional HTML attributes', () => {
    render(<Input name="test-input" required placeholder="Test input" type="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('name', 'test-input');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('placeholder', 'Test input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders with prefix and suffix', () => {
    render(<Input prefix="$" suffix="USD" />);

    const prefix = screen.getByText('$');
    const suffix = screen.getByText('USD');
    expect(prefix).toBeInTheDocument();
    expect(suffix).toBeInTheDocument();
  });

  it('renders with fullWidth prop', () => {
    render(<Input fullWidth={false} />);
    const container = screen.getByRole('textbox').parentElement?.parentElement;
    expect(container).not.toHaveClass('w-full');
  });
});
