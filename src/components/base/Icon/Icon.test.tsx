import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders a built-in icon', () => {
    render(<Icon name="menu" />);
    const svg = screen.getByTestId('icon');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders a custom icon', () => {
    const CustomIcon = () => <span>Custom Icon</span>;
    render(<Icon customIcon={<CustomIcon />} />);
    expect(screen.getByText('Custom Icon')).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(<Icon name="menu" size="sm" />);
    expect(screen.getByTestId('icon')).toHaveClass('w-4 h-4');

    rerender(<Icon name="menu" size="md" />);
    expect(screen.getByTestId('icon')).toHaveClass('w-5 h-5');

    rerender(<Icon name="menu" size="lg" />);
    expect(screen.getByTestId('icon')).toHaveClass('w-6 h-6');

    rerender(<Icon name="menu" size="xl" />);
    expect(screen.getByTestId('icon')).toHaveClass('w-8 h-8');
  });

  it('applies custom color', () => {
    render(<Icon name="menu" color="red" />);
    expect(screen.getByTestId('icon')).toHaveAttribute('stroke', 'red');
  });

  it('applies custom className', () => {
    render(<Icon name="menu" className="custom-class" />);
    expect(screen.getByTestId('icon')).toHaveClass('custom-class');
  });

  it('returns null when no name or customIcon is provided', () => {
    const { container } = render(<Icon />);
    expect(container.firstChild).toBeNull();
  });
});
