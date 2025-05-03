import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders trigger element', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Trigger</button>
      </Tooltip>
    );
    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter after delay', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    expect(screen.queryByRole('tooltip')).not.toBeVisible();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByRole('tooltip')).toBeVisible();
    expect(screen.getByText('Tooltip content')).toBeInTheDocument();
  });

  it('hides tooltip on mouse leave after delay', () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.getByRole('tooltip')).toBeVisible();

    fireEvent.mouseLeave(screen.getByText('Trigger'));
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByRole('tooltip')).not.toBeVisible();
  });

  it('does not show tooltip when disabled', () => {
    render(
      <Tooltip content="Tooltip content" disabled>
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.queryByRole('tooltip')).not.toBeVisible();
  });

  it('respects custom show and hide delays', () => {
    render(
      <Tooltip content="Tooltip content" showDelay={500} hideDelay={300}>
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    act(() => {
      jest.advanceTimersByTime(400);
    });
    expect(screen.queryByRole('tooltip')).not.toBeVisible();

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByRole('tooltip')).toBeVisible();

    fireEvent.mouseLeave(screen.getByText('Trigger'));
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.getByRole('tooltip')).toBeVisible();

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByRole('tooltip')).not.toBeVisible();
  });

  it('renders rich content in tooltip', () => {
    const richContent = (
      <div>
        <h3>Title</h3>
        <p>Description</p>
      </div>
    );

    render(
      <Tooltip content={richContent}>
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('cleans up timeouts on unmount', () => {
    const { unmount } = render(
      <Tooltip content="Tooltip content">
        <button>Trigger</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Trigger'));
    unmount();

    // This should not throw any errors
    act(() => {
      jest.runAllTimers();
    });
  });
});
