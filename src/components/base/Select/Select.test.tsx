import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3', disabled: true },
];

describe('Select', () => {
  it('renders correctly with options', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('renders label when provided', () => {
    render(<Select options={options} label="Select an option" />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Select options={options} helperText="Please select an option" />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Select options={options} error="Selection is required" />);
    expect(screen.getByText('Selection is required')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Select options={options} variant="default" />);
    expect(screen.getByRole('combobox')).toHaveClass('bg-white');

    rerender(<Select options={options} variant="filled" />);
    expect(screen.getByRole('combobox')).toHaveClass('bg-gray-100');

    rerender(<Select options={options} variant="outlined" />);
    expect(screen.getByRole('combobox')).toHaveClass('bg-transparent');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Select options={options} size="sm" />);
    expect(screen.getByRole('combobox')).toHaveClass('text-sm');

    rerender(<Select options={options} size="md" />);
    expect(screen.getByRole('combobox')).toHaveClass('text-base');

    rerender(<Select options={options} size="lg" />);
    expect(screen.getByRole('combobox')).toHaveClass('text-lg');
  });

  it('handles change events', () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disables select when disabled prop is true', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveClass('disabled:bg-gray-100');
  });

  it('renders placeholder when provided', () => {
    render(<Select options={options} placeholder="Choose an option" />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('disables specific options when specified', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeDisabled();
  });
});
