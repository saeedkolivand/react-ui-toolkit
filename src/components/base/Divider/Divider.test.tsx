import React from 'react';
import { render, screen } from '@testing-library/react';
import { Divider } from './Divider';

describe('Divider Component', () => {
  it('renders with default props', () => {
    render(<Divider />);
    const divider = screen.getByTestId('divider');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('w-full');
    expect(divider).toHaveClass('h-px');
  });

  it('renders with different types', () => {
    const types = ['horizontal', 'vertical'];

    types.forEach(type => {
      const { unmount } = render(<Divider type={type as any} />);
      const divider = screen.getByTestId('divider');
      expect(divider).toHaveClass(type === 'horizontal' ? 'w-full h-px' : 'h-full w-px');
      unmount();
    });
  });

  it('renders with dashed style', () => {
    render(<Divider dashed />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveClass('border-dashed');
  });

  it('renders with text and different orientations', () => {
    const orientations = ['left', 'center', 'right'];

    orientations.forEach(orientation => {
      const { unmount } = render(<Divider orientation={orientation as any}>Divider Text</Divider>);
      const text = screen.getByText('Divider Text');
      expect(text).toBeInTheDocument();

      const lines = screen.getAllByTestId('divider-line');
      expect(lines).toHaveLength(2);

      if (orientation === 'left') {
        expect(lines[0]).toHaveClass('w-1/4');
        expect(lines[1]).toHaveClass('w-3/4');
      } else if (orientation === 'right') {
        expect(lines[0]).toHaveClass('w-3/4');
        expect(lines[1]).toHaveClass('w-1/4');
      } else {
        expect(lines[0]).toHaveClass('w-full');
        expect(lines[1]).toHaveClass('w-full');
      }

      unmount();
    });
  });

  it('applies custom className', () => {
    render(<Divider className="custom-class" />);
    const divider = screen.getByTestId('divider');
    expect(divider).toHaveClass('custom-class');
  });

  it('forwards additional HTML attributes', () => {
    render(<Divider data-testid="custom-divider" aria-label="Test divider" />);

    const divider = screen.getByTestId('custom-divider');
    expect(divider).toHaveAttribute('aria-label', 'Test divider');
  });

  it('renders with dashed style and text', () => {
    render(<Divider dashed>Dashed Divider</Divider>);
    const lines = screen.getAllByTestId('divider-line');
    lines.forEach(line => {
      expect(line).toHaveClass('border-dashed');
    });
  });

  it('renders with custom text styling', () => {
    render(
      <Divider>
        <span className="text-red-500">Custom Text</span>
      </Divider>
    );

    const text = screen.getByText('Custom Text');
    expect(text).toHaveClass('text-red-500');
  });
});
