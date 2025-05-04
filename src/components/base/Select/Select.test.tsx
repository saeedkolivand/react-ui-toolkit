import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3', disabled: true },
];

describe('Select', () => {
  it('renders correctly with options', () => {
    const [value, setValue] = useState('1');
    render(<Select options={options} value={value} onChange={e => setValue(e.target.value)} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('renders label when provided', () => {
    const [value, setValue] = useState('1');
    render(
      <Select
        options={options}
        value={value}
        onChange={e => setValue(e.target.value)}
        label="Select an option"
      />
    );
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    const [value, setValue] = useState('1');
    render(
      <Select
        options={options}
        value={value}
        onChange={e => setValue(e.target.value)}
        error={true}
        errorMessage="Selection is required"
      />
    );
    expect(screen.getByText('Selection is required')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies size classes correctly', () => {
    const [value, setValue] = useState('1');
    const { rerender } = render(
      <Select options={options} value={value} onChange={e => setValue(e.target.value)} size="sm" />
    );
    expect(screen.getByRole('combobox')).toHaveClass('text-sm');

    rerender(
      <Select options={options} value={value} onChange={e => setValue(e.target.value)} size="md" />
    );
    expect(screen.getByRole('combobox')).toHaveClass('text-base');

    rerender(
      <Select options={options} value={value} onChange={e => setValue(e.target.value)} size="lg" />
    );
    expect(screen.getByRole('combobox')).toHaveClass('text-lg');
  });

  it('handles change events', () => {
    const [value, setValue] = useState('1');
    const handleChange = jest.fn(e => setValue(e.target.value));
    render(<Select options={options} value={value} onChange={handleChange} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: '2' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disables select when disabled prop is true', () => {
    const [value, setValue] = useState('1');
    render(
      <Select options={options} value={value} onChange={e => setValue(e.target.value)} disabled />
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.getByRole('combobox')).toHaveClass('disabled:bg-gray-100');
  });

  it('disables specific options when specified', () => {
    const [value, setValue] = useState('1');
    render(<Select options={options} value={value} onChange={e => setValue(e.target.value)} />);
    expect(screen.getByRole('option', { name: 'Option 3' })).toBeDisabled();
  });
});
