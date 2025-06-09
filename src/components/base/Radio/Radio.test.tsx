import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Radio } from "./Radio";

describe("Radio Component", () => {
  it("renders with default props", () => {
    render(<Radio />);
    const radio = screen.getByRole("radio");
    expect(radio).toBeInTheDocument();
    expect(radio).toHaveClass("h-4 w-4");
  });

  it("renders with label", () => {
    render(<Radio label="Test Label" />);
    const radio = screen.getByRole("radio");
    const label = screen.getByText("Test Label");
    expect(radio).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const sizes = ["sm", "md", "lg"];

    sizes.forEach(size => {
      const { unmount } = render(<Radio size={size as any} label={`Size ${size}`} />);
      const radio = screen.getByRole("radio");
      expect(radio).toHaveClass(
        `h-${size === "sm" ? "3" : size === "md" ? "4" : "5"} w-${
          size === "sm" ? "3" : size === "md" ? "4" : "5"
        }`
      );
      unmount();
    });
  });

  it("handles checked state changes", () => {
    const handleChange = jest.fn();
    render(<Radio onChange={handleChange} />);

    const radio = screen.getByRole("radio");
    fireEvent.click(radio);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(radio).toBeChecked();
  });

  it("shows error state", () => {
    render(<Radio error="This is an error" label="Error radio" />);

    const radio = screen.getByRole("radio");
    const errorMessage = screen.getByText("This is an error");

    expect(radio).toHaveClass("border-red-500");
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows helper text", () => {
    render(<Radio helperText="This is helper text" label="Radio with helper" />);

    const helperText = screen.getByText("This is helper text");
    expect(helperText).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Radio disabled />);
    const radio = screen.getByRole("radio");
    expect(radio).toBeDisabled();
    expect(radio).toHaveClass("disabled:opacity-50");
  });

  it("applies custom className", () => {
    render(<Radio className="custom-class" />);
    const radio = screen.getByRole("radio");
    expect(radio).toHaveClass("custom-class");
  });

  it("forwards additional HTML attributes", () => {
    render(<Radio name="test-radio" required aria-label="Test radio" />);

    const radio = screen.getByRole("radio");
    expect(radio).toHaveAttribute("name", "test-radio");
    expect(radio).toBeRequired();
    expect(radio).toHaveAttribute("aria-label", "Test radio");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Radio ref={ref} />);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current?.type).toBe("radio");
  });

  it("handles aria attributes correctly", () => {
    render(<Radio id="test-radio" error="Error message" helperText="Helper text" />);

    const radio = screen.getByRole("radio");
    expect(radio).toHaveAttribute("aria-invalid", "true");
    expect(radio).toHaveAttribute("aria-describedby", "test-radio-description");
  });
});
