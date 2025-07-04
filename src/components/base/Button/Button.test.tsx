import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button Component", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary-600");
    expect(button).toHaveClass("text-white");
  });

  it("renders with different variants", () => {
    const variants = [
      "primary",
      "secondary",
      "outline",
      "ghost",
      "success",
      "error",
      "warning",
      "info",
    ];

    variants.forEach(variant => {
      const { unmount } = render(<Button variant={variant as any}>Variant {variant}</Button>);
      const button = screen.getByText(`Variant ${variant}`);
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it("renders with different sizes", () => {
    const sizes = ["sm", "md", "lg"];

    sizes.forEach(size => {
      const { unmount } = render(<Button size={size as any}>Size {size}</Button>);
      const button = screen.getByText(`Size ${size}`);
      expect(button).toBeInTheDocument();
      unmount();
    });
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByText("Click me");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByText("Loading");
    expect(button).toBeDisabled();
    expect(button.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText("Disabled");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByText("Custom");
    expect(button).toHaveClass("custom-class");
  });

  it("forwards additional HTML attributes", () => {
    render(
      <Button type="submit" form="test-form" aria-label="Test button">
        Submit
      </Button>
    );

    const button = screen.getByText("Submit");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("form", "test-form");
    expect(button).toHaveAttribute("aria-label", "Test button");
  });

  it("renders with icon", () => {
    render(
      <Button icon="menu" iconPosition="left">
        Menu
      </Button>
    );

    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("mr-2");
  });

  it("renders with icon on right", () => {
    render(
      <Button icon="menu" iconPosition="right">
        Menu
      </Button>
    );

    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("ml-2");
  });

  it("renders with fullWidth prop", () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByText("Full Width");
    expect(button).toHaveClass("w-full");
  });

  describe("Icon functionality", () => {
    it("renders with icon on the left by default", () => {
      render(<Button icon="search">Search</Button>);
      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("mr-2");
    });

    it("renders with icon on the right when specified", () => {
      render(
        <Button icon="search" iconPosition="right">
          Search
        </Button>
      );
      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass("ml-2");
    });

    it("renders different icons correctly", () => {
      const icons = ["search", "plus", "trash", "edit", "close"];

      icons.forEach(iconName => {
        const { unmount } = render(<Button icon={iconName as any}>Button with {iconName}</Button>);
        const icon = screen.getByTestId("icon");
        expect(icon).toBeInTheDocument();
        unmount();
      });
    });

    it("adjusts icon size based on button size", () => {
      const { rerender } = render(
        <Button icon="search" size="sm">
          Small
        </Button>
      );
      let icon = screen.getByTestId("icon");
      expect(icon).toHaveClass("w-4 h-4");

      rerender(
        <Button icon="search" size="md">
          Medium
        </Button>
      );
      icon = screen.getByTestId("icon");
      expect(icon).toHaveClass("w-5 h-5");

      rerender(
        <Button icon="search" size="lg">
          Large
        </Button>
      );
      icon = screen.getByTestId("icon");
      expect(icon).toHaveClass("w-6 h-6");
    });

    it("maintains icon visibility in loading state", () => {
      render(
        <Button icon="search" loading>
          Loading
        </Button>
      );
      const button = screen.getByText("Loading");
      const loadingSpinner = button.querySelector(".animate-spin");
      const icon = screen.getByTestId("icon");

      expect(button).toBeDisabled();
      expect(loadingSpinner).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
    });

    it("maintains icon visibility in disabled state", () => {
      render(
        <Button icon="search" disabled>
          Disabled
        </Button>
      );
      const button = screen.getByText("Disabled");
      const icon = screen.getByTestId("icon");

      expect(button).toBeDisabled();
      expect(icon).toBeInTheDocument();
    });
  });
});
