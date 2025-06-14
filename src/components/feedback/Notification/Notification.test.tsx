import React from "react";
import { render, screen } from "@testing-library/react";
import Notification from "./Notification";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, "data-testid": testId, ...props }: any) => (
      <div className={className} data-testid={testId || "motion-div"} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock the useTheme hook
jest.mock("@/context", () => ({
  useTheme: () => ({
    theme: "light",
  }),
}));

describe("Notification Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders with default props", () => {
    render(<Notification message="Test notification" />);

    expect(screen.getByText("Test notification")).toBeInTheDocument();
    expect(screen.getByText("ℹ")).toBeInTheDocument(); // Default info icon
  });

  it("renders with different notification types", () => {
    const { rerender } = render(<Notification message="Success message" type="success" />);
    expect(screen.getByText("✓")).toBeInTheDocument();

    rerender(<Notification message="Error message" type="error" />);
    expect(screen.getByText("✕")).toBeInTheDocument();

    rerender(<Notification message="Warning message" type="warning" />);
    expect(screen.getByText("⚠")).toBeInTheDocument();

    rerender(<Notification message="Info message" type="info" />);
    expect(screen.getByText("ℹ")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(<Notification message="Test notification" description="This is a description" />);

    expect(screen.getByText("Test notification")).toBeInTheDocument();
    expect(screen.getByText("This is a description")).toBeInTheDocument();
  });
});
