import { render, screen } from "@testing-library/react";
import { Textarea } from "./textarea";
import { Input } from "../input/input";

describe("Textarea", () => {
  it("renders with data-scope and data-part", () => {
    render(<Textarea label="Bio" />);
    const el = screen.getByLabelText("Bio");
    expect(el).toHaveAttribute("data-scope", "textarea");
    expect(el).toHaveAttribute("data-part", "input");
  });

  it("renders booleans as present-or-absent attributes", () => {
    const { container, rerender } = render(<Textarea />);
    expect(container.querySelector('[data-part="field"]')).not.toHaveAttribute("data-invalid");
    rerender(<Textarea invalid />);
    expect(container.querySelector('[data-part="field"]')).toHaveAttribute("data-invalid", "");
  });

  // v0 grew the textarea by writing style.height inside its change handler, so
  // it only ever resized on user typing. An initial multi-line value was always
  // rendered at the wrong height. The replica is seeded from the value instead.
  it("seeds the auto-resize replica from the initial value", () => {
    const { container } = render(<Textarea autoResize defaultValue={"one\ntwo\nthree"} />);
    const control = container.querySelector('[data-part="control"]')!;
    expect(control).toHaveAttribute("data-auto-resize", "");
    expect(control).toHaveAttribute("data-value", "one\ntwo\nthree");
  });

  it("does not mark the control auto-resizing when the prop is off", () => {
    const { container } = render(<Textarea defaultValue="hello" />);
    const control = container.querySelector('[data-part="control"]')!;
    expect(control).not.toHaveAttribute("data-auto-resize");
    expect(control).not.toHaveAttribute("data-value");
  });
});

describe("Input", () => {
  it("associates the label with the control", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("data-part", "input");
  });

  it("wires aria-describedby to the error message and marks it invalid", () => {
    render(<Input label="Email" invalid errorMessage="Required" />);
    const el = screen.getByLabelText("Email");
    expect(el).toHaveAttribute("aria-invalid", "true");
    const describedBy = el.getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)).toHaveTextContent("Required");
  });

  it("prefers the error message over helper text", () => {
    render(<Input label="Email" helperText="We never share it" errorMessage="Required" />);
    expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("flags prefix and suffix so the CSS can reserve padding", () => {
    const { container } = render(<Input prefix="$" suffix=".00" />);
    const field = container.querySelector('[data-part="field"]')!;
    expect(field).toHaveAttribute("data-has-prefix", "");
    expect(field).toHaveAttribute("data-has-suffix", "");
  });
});
