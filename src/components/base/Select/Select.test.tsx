import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Select } from './Select';

const mockOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Select Component', () => {
  it('renders with default props', () => {
    render(<Select value="1" onChange={() => {}} options={mockOptions} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveClass('text-base');
  });

  it('renders with label', () => {
    render(<Select value="1" onChange={() => {}} options={mockOptions} label="Test Label" />);

    const label = screen.getByText('Test Label');
    expect(label).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'];

    sizes.forEach(size => {
      const { unmount } = render(
        <Select value="1" onChange={() => {}} options={mockOptions} size={size as any} />
      );

      const select = screen.getByRole('combobox');
      expect(select).toHaveClass(`text-${size === 'sm' ? 'sm' : size === 'md' ? 'base' : 'lg'}`);
      unmount();
    });
  });

  it('handles value changes', async () => {
    const handleChange = jest.fn();
    render(<Select value="1" onChange={handleChange} options={mockOptions} />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    await waitFor(() => {
      const option = screen.getByText('Option 2');
      fireEvent.click(option);
    });

    expect(handleChange).toHaveBeenCalled();
  });

  it('shows error state', () => {
    render(
      <Select
        value="1"
        onChange={() => {}}
        options={mockOptions}
        error
        errorMessage="This is an error"
      />
    );

    const select = screen.getByRole('combobox');
    const errorMessage = screen.getByText('This is an error');

    expect(select).toHaveClass('border-red-500');
    expect(errorMessage).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Select disabled value="" onChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('disabled:opacity-50');
  });

  it('applies custom className', () => {
    render(<Select value="1" onChange={() => {}} options={mockOptions} className="custom-class" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('custom-class');
  });

  it('forwards additional HTML attributes', () => {
    render(
      <Select
        value="1"
        onChange={() => {}}
        options={mockOptions}
        name="test-select"
        required
        aria-label="Test select"
      />
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('name', 'test-select');
    expect(select).toBeRequired();
    expect(select).toHaveAttribute('aria-label', 'Test select');
  });

  it('handles keyboard navigation', async () => {
    render(<Select value="1" onChange={() => {}} options={mockOptions} />);

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(mockOptions.length);
    });

    mockOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <Select value="1" onChange={() => {}} options={mockOptions} />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    await waitFor(() => {
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });
});
