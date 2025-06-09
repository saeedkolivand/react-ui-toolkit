import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Tag, TagColor } from "./Tag";

describe("Tag Component", () => {
  it("renders with default props", () => {
    render(<Tag>Default Tag</Tag>);
    const tag = screen.getByText("Default Tag");
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveClass("bg-gray-100");
    expect(tag).toHaveClass("text-gray-700");
  });

  it("renders with different variants", () => {
    const variants = ["default", "outline", "solid"];

    variants.forEach(variant => {
      const { unmount } = render(<Tag variant={variant as any}>Variant {variant}</Tag>);
      const tag = screen.getByText(`Variant ${variant}`);
      expect(tag).toBeInTheDocument();
      if (variant === "outline") {
        expect(tag).toHaveClass("border");
      } else {
        expect(tag).toHaveClass("border-0");
      }
      unmount();
    });
  });

  it("renders with different colors", () => {
    const colorMap: Record<TagColor, string> = {
      default: "gray",
      primary: "primary",
      success: "green",
      warning: "yellow",
      error: "red",
      info: "cyan",
    };

    (["default", "primary", "success", "warning", "error", "info"] as TagColor[]).forEach(color => {
      const { unmount } = render(<Tag color={color}>Color {color}</Tag>);
      const tag = screen.getByText(`Color ${color}`);
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass(`bg-${colorMap[color]}-100`);
      unmount();
    });
  });

  it("renders with close button when closable", () => {
    render(<Tag closable>Closable Tag</Tag>);
    const closeButton = screen.getByRole("button");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass("h-4 w-4");
  });

  it("handles close button click", () => {
    const handleClose = jest.fn();
    render(
      <Tag closable onClose={handleClose}>
        Closable Tag
      </Tag>
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Tag className="custom-class">Custom Tag</Tag>);
    const tag = screen.getByText("Custom Tag");
    expect(tag).toHaveClass("custom-class");
  });

  it("renders with solid variant and different colors", () => {
    const colorMap: Record<TagColor, string> = {
      default: "gray",
      primary: "primary",
      success: "green",
      warning: "yellow",
      error: "red",
      info: "cyan",
    };

    (["default", "primary", "success", "warning", "error", "info"] as TagColor[]).forEach(color => {
      const { unmount } = render(
        <Tag color={color} variant="solid">
          Solid {color}
        </Tag>
      );
      const tag = screen.getByText(`Solid ${color}`);
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass(`bg-${colorMap[color]}-600`);
      expect(tag).toHaveClass("text-white");
      unmount();
    });
  });

  it("renders with outline variant and different colors", () => {
    const colorClasses = {
      default: {
        border: "border-gray-300",
        text: "text-gray-700",
      },
      primary: {
        border: "border-primary-500",
        text: "text-primary-600",
      },
      success: {
        border: "border-green-500",
        text: "text-green-600",
      },
      warning: {
        border: "border-yellow-500",
        text: "text-yellow-600",
      },
      error: {
        border: "border-red-500",
        text: "text-red-600",
      },
      info: {
        border: "border-cyan-500",
        text: "text-cyan-600",
      },
    };

    (["default", "primary", "success", "warning", "error", "info"] as TagColor[]).forEach(color => {
      const { unmount } = render(
        <Tag color={color} variant="outline">
          Outline {color}
        </Tag>
      );
      const tag = screen.getByText(`Outline ${color}`);
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass("border");
      expect(tag).toHaveClass(colorClasses[color].border);
      expect(tag).toHaveClass(colorClasses[color].text);
      unmount();
    });
  });

  it("has correct accessibility attributes", () => {
    render(<Tag closable>Accessible Tag</Tag>);
    const closeButton = screen.getByRole("button");
    expect(closeButton).toHaveAttribute("aria-label", "Remove tag");
  });
});
