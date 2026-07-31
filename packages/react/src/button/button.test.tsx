import { render, screen } from "@testing-library/react";
import { Button } from "./button";

// The SAME six assertions run for every component in every framework, so a
// divergence between adapters is immediately visible. Behaviour itself is
// Zag's job and is tested upstream — these verify wiring only.
describe("Button", () => {
  it("renders with data-scope and data-part", () => {
    render(<Button>Click</Button>);
    const el = screen.getByRole("button");
    expect(el).toHaveAttribute("data-scope", "button");
    expect(el).toHaveAttribute("data-part", "root");
  });

  it("maps variant and size onto data attributes", () => {
    render(
      <Button variant="outline" size="lg">
        Click
      </Button>
    );
    const el = screen.getByRole("button");
    expect(el).toHaveAttribute("data-variant", "outline");
    expect(el).toHaveAttribute("data-size", "lg");
  });

  // The single highest-value assertion in the suite: a raw boolean would render
  // data-loading="false", which still MATCHES [data-loading] in CSS and silently
  // applies the wrong styles. This is the #1 cross-framework divergence.
  it('renders booleans as present-or-absent attributes, never ="false"', () => {
    const { rerender } = render(<Button>Click</Button>);
    expect(screen.getByRole("button")).not.toHaveAttribute("data-loading");

    rerender(<Button loading>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-loading", "");
  });

  it("passes the consumer's className through to the root", () => {
    render(<Button className="my-button">Click</Button>);
    expect(screen.getByRole("button")).toHaveClass("my-button");
  });

  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("defaults type to button so it does not submit an enclosing form", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("is disabled while loading", () => {
    render(<Button loading>Click</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  // Regression: Button used to stamp data-part="icon" onto the composed Icon,
  // which REPLACED the Icon's own data-part="root". Every sizing rule keyed on
  // [data-scope="icon"][data-part="root"] then stopped matching and icons
  // rendered at the SVG default size. Composed children must keep their own
  // scope/part; the parent targets them by scope.
  it("does not overwrite a composed child's own data-part", () => {
    const { container } = render(<Button icon="check">Save</Button>);
    const icon = container.querySelector('[data-scope="icon"]')!;
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("data-part", "root");
    expect(icon).toHaveAttribute("data-size", "md");
  });

  it("renders a spinner while loading", () => {
    const { container } = render(<Button loading>Save</Button>);
    expect(container.querySelector('[data-scope="spinner"]')).toBeInTheDocument();
  });
});
