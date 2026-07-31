import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  beforeEach(() => {
    // Mock getBoundingClientRect for positioning calculations
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  it("renders children correctly", () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows tooltip on hover by default", async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });
  });

  it("hides tooltip when mouse leaves", async () => {
    render(
      <Tooltip content="Tooltip content">
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");

    // Show tooltip
    fireEvent.mouseEnter(trigger);
    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });

    // Hide tooltip
    fireEvent.mouseLeave(trigger);
    await waitFor(() => {
      expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
    });
  });

  it("shows tooltip on click when trigger is set to click", async () => {
    render(
      <Tooltip content="Tooltip content" trigger="click">
        <button>Click me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Click me");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });
  });

  it("applies custom className to tooltip", async () => {
    const customClass = "custom-tooltip";
    render(
      <Tooltip content="Tooltip content" overlayClassName={customClass}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText("Tooltip content").parentElement;
      expect(tooltip).toHaveClass(customClass);
    });
  });

  it("calls onVisibleChange when visibility changes", async () => {
    const onVisibleChange = jest.fn();
    render(
      <Tooltip content="Tooltip content" onVisibleChange={onVisibleChange}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");

    // Show tooltip
    fireEvent.mouseEnter(trigger);
    await waitFor(() => {
      expect(onVisibleChange).toHaveBeenCalledWith(true);
    });

    // Hide tooltip
    fireEvent.mouseLeave(trigger);
    await waitFor(() => {
      expect(onVisibleChange).toHaveBeenCalledWith(false);
    });
  });

  it("does not render arrow when arrow prop is false", async () => {
    render(
      <Tooltip content="Tooltip content" arrow={false}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText("Hover me");
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByText("Tooltip content").parentElement;
      expect(tooltip?.querySelector(".tooltip-arrow")).not.toBeInTheDocument();
    });
  });
});
