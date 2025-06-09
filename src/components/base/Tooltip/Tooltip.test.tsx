import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

// Mock timers for controlled testing of delays
jest.useFakeTimers();

// Mock createPortal to make it work in tests
jest.mock("react-dom", () => {
  const original = jest.requireActual("react-dom");
  return {
    ...original,
    createPortal: (node: React.ReactNode) => node,
  };
});

// Mock getBoundingClientRect to return predictable values
Element.prototype.getBoundingClientRect = jest.fn(() => {
  return {
    width: 100,
    height: 50,
    top: 100,
    left: 100,
    bottom: 150,
    right: 200,
    x: 100,
    y: 100,
    toJSON: () => {},
  };
});

// Mock ResizeObserver which isn't available in the test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("Tooltip", () => {
  beforeEach(() => {
    // Reset timers before each test
    jest.clearAllTimers();
  });

  it("renders children correctly", () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows tooltip on hover", async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    // Tooltip should not be visible initially
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();

    // Trigger hover
    fireEvent.mouseEnter(screen.getByText("Hover me"));

    // Fast-forward timer
    act(() => {
      jest.advanceTimersByTime(200); // Default show delay
    });

    // Tooltip should be visible now
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("hides tooltip on mouse leave", async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    // Show the tooltip
    fireEvent.mouseEnter(screen.getByText("Hover me"));
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Tooltip should be visible
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    // Hide the tooltip
    fireEvent.mouseLeave(screen.getByText("Hover me"));
    act(() => {
      jest.advanceTimersByTime(200); // Default hide delay
    });

    // Tooltip should not be visible
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("shows tooltip on click when trigger is click", async () => {
    render(
      <Tooltip content="Tooltip content" trigger="click">
        <button>Click me</button>
      </Tooltip>
    );

    // Tooltip should not be visible initially
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();

    // Trigger click
    fireEvent.click(screen.getByText("Click me"));

    // Fast-forward timer
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Tooltip should be visible
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    // Click again to hide
    fireEvent.click(screen.getByText("Click me"));
    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Tooltip should not be visible
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("supports custom delay times", async () => {
    const customShowDelay = 500;
    const customHideDelay = 300;

    render(
      <Tooltip content="Tooltip content" showDelay={customShowDelay} hideDelay={customHideDelay}>
        <button>Hover me</button>
      </Tooltip>
    );

    // Trigger hover
    fireEvent.mouseEnter(screen.getByText("Hover me"));

    // Advance timer partially - tooltip shouldn't be visible yet
    act(() => {
      jest.advanceTimersByTime(customShowDelay - 100);
    });
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();

    // Advance to full show delay - tooltip should be visible
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    // Trigger mouse leave
    fireEvent.mouseLeave(screen.getByText("Hover me"));

    // Advance timer partially - tooltip should still be visible
    act(() => {
      jest.advanceTimersByTime(customHideDelay - 100);
    });
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();

    // Advance to full hide delay - tooltip should be hidden
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });
});
