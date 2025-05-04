import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('calls onClose when clicking the close button', () => {
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the backdrop if closeOnBackdropClick is true', () => {
    render(
      <Modal isOpen={true} onClose={onClose} closeOnBackdropClick={true}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking the backdrop if closeOnBackdropClick is false', () => {
    render(
      <Modal isOpen={true} onClose={onClose} closeOnBackdropClick={false}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when pressing escape if closeOnEsc is true', () => {
    render(
      <Modal isOpen={true} onClose={onClose} closeOnEsc={true}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when pressing escape if closeOnEsc is false', () => {
    render(
      <Modal isOpen={true} onClose={onClose} closeOnEsc={false}>
        <div>Modal Content</div>
      </Modal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={onClose} size="sm">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByRole('dialog').querySelector('[class*="sm:max-w-sm"]')).toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={onClose} size="lg">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByRole('dialog').querySelector('[class*="sm:max-w-lg"]')).toBeInTheDocument();
  });

  it('applies scrollable class when scrollable prop is true', () => {
    render(
      <Modal isOpen={true} onClose={onClose} scrollable={true}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(
      screen.getByRole('dialog').querySelector('[class*="overflow-y-auto"]')
    ).toBeInTheDocument();
  });

  it('does not show close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={onClose} showCloseButton={false}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
  });

  it('centers content vertically when centered prop is true', () => {
    render(
      <Modal isOpen={true} onClose={onClose} centered={true}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByRole('dialog').querySelector('[class*="items-center"]')).toBeInTheDocument();
  });

  it('aligns content to top when centered prop is false', () => {
    render(
      <Modal isOpen={true} onClose={onClose} centered={false}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByRole('dialog').querySelector('[class*="items-start"]')).toBeInTheDocument();
  });
});
