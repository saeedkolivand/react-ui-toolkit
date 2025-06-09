import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Textarea } from "./Textarea";

describe("Textarea Component", () => {
  it("renders with default props", () => {
    render(<Textarea />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass("text-base");
    expect(textarea).toHaveClass("min-h-[100px]");
  });

  it("renders with label", () => {
    render(<Textarea label="Test Label" />);
    const label = screen.getByText("Test Label");
    expect(label).toBeInTheDocument();
  });

  it("renders with different variants", () => {
    const variants = ["default", "filled", "outlined"];

    variants.forEach(variant => {
      const { unmount } = render(
        <Textarea variant={variant as any} placeholder={`Variant ${variant}`} />
      );
      const textarea = screen.getByPlaceholderText(`Variant ${variant}`);
      expect(textarea).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with different sizes", () => {
    const sizes = ["sm", "md", "lg"];

    sizes.forEach(size => {
      const { unmount } = render(<Textarea size={size as any} placeholder={`Size ${size}`} />);
      const textarea = screen.getByPlaceholderText(`Size ${size}`);
      expect(textarea).toHaveClass(`text-${size === "sm" ? "sm" : size === "md" ? "base" : "lg"}`);
      expect(textarea).toHaveClass(
        `min-h-[${size === "sm" ? "80" : size === "md" ? "100" : "120"}px]`
      );
      unmount();
    });
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "test" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("shows error state", () => {
    render(<Textarea error="This is an error" label="Error textarea" />);

    const textarea = screen.getByRole("textbox");
    const errorMessage = screen.getByText("This is an error");

    expect(textarea).toHaveClass("border-red-500");
    expect(errorMessage).toBeInTheDocument();
  });

  it("shows helper text", () => {
    render(<Textarea helperText="This is helper text" label="Textarea with helper" />);

    const helperText = screen.getByText("This is helper text");
    expect(helperText).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Textarea disabled />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("disabled:cursor-not-allowed");
  });

  it("applies custom className", () => {
    render(<Textarea className="custom-class" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-class");
  });

  it("forwards additional HTML attributes", () => {
    render(<Textarea name="test-textarea" required placeholder="Test textarea" rows={5} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("name", "test-textarea");
    expect(textarea).toBeRequired();
    expect(textarea).toHaveAttribute("placeholder", "Test textarea");
    expect(textarea).toHaveAttribute("rows", "5");
  });

  it("handles auto-resize", () => {
    const handleChange = jest.fn();
    render(<Textarea autoResize onChange={handleChange} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "test\nline2\nline3" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders with fullWidth prop", () => {
    render(<Textarea fullWidth />);
    const container = screen.getByRole("textbox").parentElement;
    expect(container).toHaveClass("w-full");
  });
});
