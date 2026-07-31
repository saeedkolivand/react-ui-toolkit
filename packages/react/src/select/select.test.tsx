import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, Option } from "./select";

const items = [
  { value: "ng", label: "Nigeria" },
  { value: "gh", label: "Ghana" },
  { value: "ke", label: "Kenya", disabled: true },
];

const trigger = () => screen.getByRole("combobox");
const valueText = () => document.querySelector('[data-part="value-text"]');
// The listbox is portaled to document.body, so it sits outside RTL's container.
const rows = () => document.querySelectorAll('[data-part="item"]');

describe("Select", () => {
  it("renders the root with scope and part", () => {
    const { container } = render(<Select items={items} />);
    expect(container.querySelector('[data-scope="select"][data-part="root"]')).toBeInTheDocument();
  });

  it("puts size and variant on the root as data attributes", () => {
    const { container } = render(<Select items={items} size="lg" variant="filled" />);
    const root = container.querySelector('[data-part="root"]');
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-variant", "filled");
  });

  it("omits boolean data attributes rather than writing false", () => {
    const { container } = render(<Select items={items} invalid={false} fullWidth={false} />);
    const root = container.querySelector('[data-part="root"]');
    expect(root).not.toHaveAttribute("data-invalid");
    expect(root).not.toHaveAttribute("data-full-width");
  });

  it("sets boolean data attributes when true", () => {
    const { container } = render(<Select items={items} invalid />);
    expect(container.querySelector('[data-part="root"]')).toHaveAttribute("data-invalid", "");
  });

  it("passes className through to the root", () => {
    const { container } = render(<Select items={items} className="mine" />);
    expect(container.querySelector('[data-part="root"]')).toHaveClass("mine");
  });

  it("renders a real button as the trigger, not a readonly input", () => {
    render(<Select items={items} />);
    expect(trigger().tagName).toBe("BUTTON");
  });

  it("shows the placeholder when nothing is selected", () => {
    render(<Select items={items} placeholder="Pick one" />);
    expect(valueText()).toHaveTextContent("Pick one");
  });

  it("marks the trigger as placeholder-shown when empty", () => {
    render(<Select items={items} />);
    expect(trigger()).toHaveAttribute("data-placeholder-shown");
  });

  it("drops the placeholder-shown flag once something is selected", () => {
    render(<Select items={items} defaultValue="gh" />);
    expect(trigger()).not.toHaveAttribute("data-placeholder-shown");
  });

  it("shows the selected label for defaultValue", () => {
    render(<Select items={items} defaultValue="gh" />);
    expect(valueText()).toHaveTextContent("Ghana");
  });

  it("renders a label and names the trigger with it", () => {
    render(<Select items={items} label="Country" />);
    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(trigger()).toHaveAccessibleName(/Country/);
  });

  it("leaves no dangling aria-labelledby when there is no label", () => {
    render(<Select items={items} />);
    expect(trigger()).not.toHaveAttribute("aria-labelledby");
  });

  it("renders helper text and links it via aria-describedby", () => {
    render(<Select items={items} id="s" helperText="Where you live" />);
    expect(trigger()).toHaveAttribute("aria-describedby", "s-helper");
    expect(screen.getByText("Where you live")).toBeInTheDocument();
  });

  it("prefers the error message over helper text", () => {
    render(<Select items={items} id="s" helperText="helper" errorMessage="Required" />);
    expect(trigger()).toHaveAttribute("aria-describedby", "s-error");
    expect(screen.queryByText("helper")).not.toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("marks the trigger invalid for assistive tech", () => {
    render(<Select items={items} invalid />);
    expect(trigger()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the trigger", () => {
    render(<Select items={items} disabled />);
    expect(trigger()).toBeDisabled();
  });

  it("renders a hidden native select carrying name and options", () => {
    const { container } = render(<Select items={items} name="country" />);
    const hidden = container.querySelector("select");
    expect(hidden).toHaveAttribute("name", "country");
    expect(hidden?.querySelectorAll("option")).toHaveLength(3);
  });

  it("carries the selected value on the hidden select so forms submit it", () => {
    const { container } = render(<Select items={items} name="country" defaultValue="ke" />);
    expect(container.querySelector("select")).toHaveValue("ke");
  });

  it("marks the hidden select required", () => {
    const { container } = render(<Select items={items} name="country" required />);
    expect(container.querySelector("select")).toBeRequired();
  });

  it("renders one item per entry with the item part", () => {
    render(<Select items={items} />);
    expect(rows()).toHaveLength(3);
  });

  it("marks a disabled item without disabling the others", () => {
    render(<Select items={items} />);
    expect(rows()[0]).not.toHaveAttribute("data-disabled");
    expect(rows()[2]).toHaveAttribute("data-disabled");
  });

  it("marks the selected item checked", () => {
    render(<Select items={items} defaultValue="gh" />);
    expect(rows()[1]).toHaveAttribute("data-state", "checked");
    expect(rows()[0]).toHaveAttribute("data-state", "unchecked");
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    render(<Select items={items} />);
    await user.click(trigger());
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("reports the open state on the indicator so CSS can rotate it", async () => {
    const user = userEvent.setup();
    const { container } = render(<Select items={items} />);
    await user.click(trigger());
    expect(container.querySelector('[data-part="indicator"]')).toHaveAttribute(
      "data-state",
      "open"
    );
  });

  it("selects an item on click and reports value plus item", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select items={items} onValueChange={onValueChange} />);
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: /Ghana/ }));
    expect(onValueChange).toHaveBeenCalledWith({
      value: "gh",
      item: expect.objectContaining({ value: "gh" }),
    });
  });

  it("closes after a selection", async () => {
    const user = userEvent.setup();
    render(<Select items={items} />);
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: /Nigeria/ }));
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("does not select a disabled item", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Select items={items} onValueChange={onValueChange} />);
    await user.click(trigger());
    await user.click(screen.getByRole("option", { name: /Kenya/ }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("honours a controlled value", () => {
    render(<Select items={items} value="ke" onValueChange={() => {}} />);
    expect(valueText()).toHaveTextContent("Kenya");
  });

  it("points the trigger at the listbox it controls", async () => {
    const user = userEvent.setup();
    render(<Select items={items} />);
    await user.click(trigger());
    expect(trigger()).toHaveAttribute("aria-controls", screen.getByRole("listbox").id);
  });

  it("builds the collection from <Option> children", () => {
    render(
      <Select>
        <Option value="a">Alpha</Option>
        <Option value="b">Beta</Option>
      </Select>
    );
    expect(rows()).toHaveLength(2);
    expect(rows()[0]).toHaveTextContent("Alpha");
  });

  it("falls back to the value when an Option has no text", () => {
    render(
      <Select>
        <Option value="a" />
      </Select>
    );
    expect(rows()[0]).toHaveTextContent("a");
  });

  it("carries disabled through from an Option child", () => {
    render(
      <Select>
        <Option value="a">Alpha</Option>
        <Option value="b" disabled>
          Beta
        </Option>
      </Select>
    );
    expect(rows()[1]).toHaveAttribute("data-disabled");
  });

  it("prefers items over children when both are given", () => {
    render(
      <Select items={items}>
        <Option value="x">X</Option>
      </Select>
    );
    expect(rows()).toHaveLength(3);
  });

  it("renders nothing for a bare Option", () => {
    const { container } = render(<Option value="a">Alpha</Option>);
    expect(container).toBeEmptyDOMElement();
  });
});
