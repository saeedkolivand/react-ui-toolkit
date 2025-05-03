import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Radio } from './Radio';

describe('Radio', () => {
  it('renders correctly', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Radio label="Select option" />);
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<Radio helperText="Choose an option" />);
    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Radio error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('radio')).toHaveAttribute('aria-invalid', 'true');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Radio size="sm" />);
    expect(screen.getByRole('radio')).toHaveClass('h-3', 'w-3');

    rerender(<Radio size="md" />);
    expect(screen.getByRole('radio')).toHaveClass('h-4', 'w-4');

    rerender(<Radio size="lg" />);
    expect(screen.getByRole('radio')).toHaveClass('h-5', 'w-5');
  });

  it('handles change events', () => {
    const handleChange = jest.fn();
    render(<Radio onChange={handleChange} />);

    fireEvent.click(screen.getByRole('radio'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('disables radio when disabled prop is true', () => {
    render(<Radio disabled />);
    expect(screen.getByRole('radio')).toBeDisabled();
    expect(screen.getByRole('radio')).toHaveClass('disabled:opacity-50');
  });

  it('can be checked', () => {
    render(<Radio checked />);
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('works in a radio group', () => {
    render(
      <div>
        <Radio name="group" value="1" label="Option 1" />
        <Radio name="group" value="2" label="Option 2" />
        <Radio name="group" value="3" label="Option 3" />
      </div>
    );

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);

    fireEvent.click(radios[1]);
    expect(radios[1]).toBeChecked();
    expect(radios[0]).not.toBeChecked();
    expect(radios[2]).not.toBeChecked();
  });
});
