import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./checkbox";
import { Radio, RadioGroup } from "./radio";
import { Switch } from "./switch";

describe("Checkbox", () => {
  it("renders with data-scope and data-part", () => {
    const { container } = render(<Checkbox label="Accept" />);
    expect(container.querySelector('[data-scope="checkbox"]')).toHaveAttribute("data-part", "root");
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-part", "control");
  });

  it("associates the label so clicking it toggles", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept terms" />);
    const box = screen.getByRole("checkbox");
    expect(box).not.toBeChecked();
    await user.click(screen.getByText("Accept terms"));
    expect(box).toBeChecked();
  });

  // `indeterminate` has no HTML attribute — it is a DOM property only, which is
  // the one thing a purely declarative implementation cannot express.
  it("sets the indeterminate DOM property", () => {
    render(<Checkbox label="Some" indeterminate />);
    expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
  });

  it("renders booleans as present-or-absent attributes", () => {
    const { container, rerender } = render(<Checkbox />);
    expect(container.querySelector('[data-part="root"]')).not.toHaveAttribute("data-disabled");
    rerender(<Checkbox disabled />);
    expect(container.querySelector('[data-part="root"]')).toHaveAttribute("data-disabled", "");
  });
});

describe("Switch", () => {
  it("exposes the switch role", () => {
    render(<Switch label="Wi-Fi" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  // The v0 regression: an onClick on the wrapper plus an onChange on the input
  // meant a single interaction could fire twice, with different payload shapes.
  it("fires exactly one change event per interaction", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Switch label="Wi-Fi" onChange={onChange} />);

    await user.click(screen.getByText("Wi-Fi"));
    expect(onChange).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("gives the handler a real event, not a synthesised object", async () => {
    const user = userEvent.setup();
    let checked: unknown;
    render(<Switch label="Wi-Fi" onChange={e => (checked = e.target.checked)} />);
    await user.click(screen.getByRole("switch"));
    expect(checked).toBe(true);
  });
});

describe("RadioGroup", () => {
  it("groups radios and keeps them mutually exclusive by name", async () => {
    const user = userEvent.setup();
    render(
      <RadioGroup label="Size" name="size">
        <Radio name="size" value="sm" label="Small" />
        <Radio name="size" value="md" label="Medium" />
      </RadioGroup>
    );
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();

    await user.click(screen.getByText("Small"));
    expect(screen.getByLabelText("Small")).toBeChecked();

    await user.click(screen.getByText("Medium"));
    expect(screen.getByLabelText("Medium")).toBeChecked();
    expect(screen.getByLabelText("Small")).not.toBeChecked();
  });
});

describe("invalid state placement", () => {
  // aria-invalid is not a supported attribute on role="radio" — it belongs on
  // the radiogroup. Only svelte-check flagged it, so the wrong placement shipped
  // in all four adapters with no test covering it. These are that test.
  it("keeps aria-invalid off an individual radio", () => {
    render(<Radio label="One" value="1" invalid />);
    expect(screen.getByLabelText("One")).not.toHaveAttribute("aria-invalid");
  });

  it("still marks an invalid radio for styling", () => {
    const { container } = render(<Radio label="One" value="1" invalid />);
    expect(container.querySelector('[data-scope="radio"][data-part="root"]')).toHaveAttribute(
      "data-invalid",
      ""
    );
  });

  it("puts aria-invalid on the radiogroup, where ARIA allows it", () => {
    render(
      <RadioGroup name="n" label="Pick" invalid>
        <Radio label="One" value="1" />
      </RadioGroup>
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true");
  });

  it("omits it on a valid group rather than writing false", () => {
    render(
      <RadioGroup name="n" label="Pick">
        <Radio label="One" value="1" />
      </RadioGroup>
    );
    const group = screen.getByRole("radiogroup");
    expect(group).not.toHaveAttribute("aria-invalid");
    expect(group).not.toHaveAttribute("data-invalid");
  });

  // role="checkbox" DOES support aria-invalid, so the checkbox keeps its own.
  // (Switch has no `invalid` prop at all — role="switch" would support it, so
  // that is an API gap rather than a correctness bug. Noted, not fixed here.)
  it("keeps aria-invalid on an invalid checkbox", () => {
    render(<Checkbox label="Accept" invalid />);
    expect(screen.getByLabelText("Accept")).toHaveAttribute("aria-invalid", "true");
  });
});
