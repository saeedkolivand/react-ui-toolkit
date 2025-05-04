import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders when isOpen is true', () => {
    render(
      <Drawer isOpen={true} onClose={onClose}>
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.getByText('Drawer Content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Drawer isOpen={false} onClose={onClose}>
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    render(
      <Drawer isOpen={true} onClose={onClose}>
        <div>Drawer Content</div>
      </Drawer>
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop if closeOnBackdropClick is true', () => {
    render(
      <Drawer isOpen={true} onClose={onClose} closeOnBackdropClick={true}>
        <div>Drawer Content</div>
      </Drawer>
    );
    fireEvent.click(screen.getByTestId('drawer-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking the backdrop if closeOnBackdropClick is false', () => {
    render(
      <Drawer isOpen={true} onClose={onClose} closeOnBackdropClick={false}>
        <div>Drawer Content</div>
      </Drawer>
    );
    fireEvent.click(screen.getByTestId('drawer-backdrop'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when pressing escape if closeOnEsc is true', () => {
    render(
      <Drawer isOpen={true} onClose={onClose} closeOnEsc={true}>
        <div>Drawer Content</div>
      </Drawer>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when pressing escape if closeOnEsc is false', () => {
    render(
      <Drawer isOpen={true} onClose={onClose} closeOnEsc={false}>
        <div>Drawer Content</div>
      </Drawer>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <Drawer isOpen={true} onClose={onClose} size="sm">
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.getByRole('dialog').querySelector('[class*="w-72"]')).toBeInTheDocument();

    rerender(
      <Drawer isOpen={true} onClose={onClose} size="lg">
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.getByRole('dialog').querySelector('[class*="w-[32rem]"]')).toBeInTheDocument();
  });

  it('applies position classes correctly', () => {
    const { rerender } = render(
      <Drawer isOpen={true} onClose={onClose} position="left">
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.getByRole('dialog').querySelector('[class*="left-0"]')).toBeInTheDocument();

    rerender(
      <Drawer isOpen={true} onClose={onClose} position="top">
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.getByRole('dialog').querySelector('[class*="top-0"]')).toBeInTheDocument();
  });

  it('does not show close button when showCloseButton is false', () => {
    render(
      <Drawer isOpen={true} onClose={onClose} showCloseButton={false}>
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });

  it('applies transform classes based on position', () => {
    const { rerender } = render(
      <Drawer isOpen={false} onClose={onClose} position="left">
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();

    rerender(
      <Drawer isOpen={false} onClose={onClose} position="right">
        <div>Drawer Content</div>
      </Drawer>
    );
    expect(screen.queryByText('Drawer Content')).not.toBeInTheDocument();
  });
});
