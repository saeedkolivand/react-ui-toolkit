import React from 'react';
import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon Component', () => {
  it('renders with default props', () => {
    render(<Icon name="menu" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('h-5 w-5');
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'];

    sizes.forEach(size => {
      const { unmount } = render(<Icon name="menu" size={size as any} />);
      const icon = screen.getByTestId('icon');
      expect(icon).toHaveClass(
        `h-${size === 'sm' ? '4' : size === 'md' ? '5' : size === 'lg' ? '6' : '8'} w-${
          size === 'sm' ? '4' : size === 'md' ? '5' : size === 'lg' ? '6' : '8'
        }`
      );
      unmount();
    });
  });

  it('renders with custom color', () => {
    render(<Icon name="menu" color="red" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('stroke', 'red');
  });

  it('renders with custom className', () => {
    render(<Icon name="menu" className="custom-class" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveClass('custom-class');
  });

  it('renders different built-in icons', () => {
    const icons = ['menu', 'close', 'search', 'check', 'error', 'warning', 'info'];

    icons.forEach(iconName => {
      const { unmount } = render(<Icon name={iconName as any} />);
      const icon = screen.getByTestId('icon');
      expect(icon).toBeInTheDocument();
      unmount();
    });
  });

  it('renders with custom icon', () => {
    const CustomIcon = () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );

    render(<Icon customIcon={<CustomIcon />} />);
    const icon = screen.getByTestId('icon');
    expect(icon).toBeInTheDocument();
  });

  it('forwards additional SVG attributes', () => {
    render(<Icon name="menu" viewBox="0 0 24 24" fill="none" strokeWidth={2} />);

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(icon).toHaveAttribute('fill', 'none');
    expect(icon).toHaveAttribute('stroke-width', '2');
  });

  it('renders with accessibility attributes', () => {
    render(<Icon name="menu" role="img" aria-label="Menu icon" />);

    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('role', 'img');
    expect(icon).toHaveAttribute('aria-label', 'Menu icon');
  });
});
