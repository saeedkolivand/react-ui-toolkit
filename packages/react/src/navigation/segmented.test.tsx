import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Segmented } from "./segmented";

const root = () =>
  document.querySelector<HTMLElement>('[data-scope="segmented"][data-part="root"]')!;
const items = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-scope="segmented"] [data-part="item"]'));
const tabbable = () => items().filter(item => item.tabIndex === 0);

const OPTIONS = ["Daily", "Weekly", "Monthly"];

describe("Segmented", () => {
  it("renders a radio group", () => {
    render(<Segmented options={OPTIONS} />);
    expect(screen.getByRole("radiogroup")).toBe(root());
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("takes a bare string as both label and value", async () => {
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} onChange={onChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Weekly" }));
    expect(onChange).toHaveBeenCalledWith("Weekly");
  });

  it("exposes unchecked as a state rather than omitting it", () => {
    render(<Segmented options={OPTIONS} />);
    // The one place a `"false"` string is correct: a radio with no
    // `aria-checked` reads as having no checked state at all, which is a
    // different thing from being unchecked.
    expect(items()[1]).toHaveAttribute("aria-checked", "false");
    expect(items()[0]).toHaveAttribute("aria-checked", "true");
  });

  it("selects the first option when nothing says otherwise", () => {
    render(<Segmented options={OPTIONS} />);
    expect(items()[0]!.getAttribute("data-selected")).toBe("");
  });

  it("honours defaultValue", () => {
    render(<Segmented options={OPTIONS} defaultValue="Monthly" />);
    expect(items()[2]!.getAttribute("data-selected")).toBe("");
  });

  it("stays where a controlled value puts it, whatever is clicked", async () => {
    const onChange = vi.fn();
    // `Monthly`, deliberately not `Daily`: the uncontrolled state would settle
    // on the first option, so a controlled value that agrees with it proves
    // nothing — the assertion would hold with the prop ignored entirely.
    render(<Segmented options={OPTIONS} value="Monthly" onChange={onChange} />);
    expect(items()[2]!.getAttribute("data-selected")).toBe("");

    await userEvent.click(screen.getByRole("radio", { name: "Daily" }));
    expect(onChange).toHaveBeenCalledWith("Daily");
    // Controlled means the parent decides. Moving anyway would make the control
    // disagree with the state that owns it for one render.
    expect(items()[2]!.getAttribute("data-selected")).toBe("");
    expect(items()[0]!.hasAttribute("data-selected")).toBe(false);
  });

  it("keeps exactly one option in the tab order", () => {
    render(<Segmented options={OPTIONS} />);
    // Roving. Two would make Tab walk the group; none would make it unreachable.
    expect(tabbable()).toHaveLength(1);
    expect(tabbable()[0]).toHaveAccessibleName("Daily");
  });

  it("moves the tab stop with the selection", async () => {
    render(<Segmented options={OPTIONS} />);
    await userEvent.click(screen.getByRole("radio", { name: "Weekly" }));
    expect(tabbable()).toHaveLength(1);
    expect(tabbable()[0]).toHaveAccessibleName("Weekly");
  });

  it("puts the tab stop on the first enabled option when the selected one is disabled", () => {
    render(
      <Segmented options={[{ label: "A", value: "a", disabled: true }, "B", "C"]} value="a" />
    );
    // A disabled button cannot take focus, so a group whose only tab stop is
    // disabled is a group no keyboard can enter at all.
    expect(tabbable()).toHaveLength(1);
    expect(tabbable()[0]).toHaveAccessibleName("B");
  });

  it("selects as it moves, because a radio group has no panel to defer for", async () => {
    const onChange = vi.fn();
    render(<Segmented options={OPTIONS} onChange={onChange} />);
    items()[0]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("Weekly");
    expect(items()[1]!.getAttribute("data-selected")).toBe("");
    expect(items()[1]).toHaveFocus();
  });

  it("moves on the block axis too, whatever the control looks like", async () => {
    render(<Segmented options={OPTIONS} />);
    items()[0]!.focus();
    // Horizontal on screen, and ArrowDown still works: a radio group answers
    // both axes, and a user who cannot see the orientation still gets there.
    await userEvent.keyboard("{ArrowDown}");
    expect(items()[1]).toHaveFocus();
  });

  it("wraps at the end rather than stopping", async () => {
    render(<Segmented options={OPTIONS} defaultValue="Monthly" />);
    items()[2]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(items()[0]).toHaveFocus();
    expect(items()[0]!.getAttribute("data-selected")).toBe("");
  });

  it("steps over a disabled option rather than landing on it", async () => {
    render(<Segmented options={["A", { label: "B", value: "b", disabled: true }, "C"]} />);
    items()[0]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(items()[2]).toHaveFocus();
  });

  it("jumps to the ends with Home and End", async () => {
    render(<Segmented options={OPTIONS} />);
    items()[0]!.focus();
    await userEvent.keyboard("{End}");
    expect(items()[2]).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(items()[0]).toHaveFocus();
  });

  it("disables every option when the group is disabled", () => {
    render(<Segmented options={OPTIONS} disabled />);
    expect(items().every(item => (item as HTMLButtonElement).disabled)).toBe(true);
    expect(root()).toHaveAttribute("aria-disabled", "true");
  });

  it("marks its layout flags as presence attributes", () => {
    render(<Segmented options={OPTIONS} block vertical />);
    expect(root().getAttribute("data-block")).toBe("");
    expect(root().getAttribute("data-vertical")).toBe("");
    expect(root()).toHaveAttribute("aria-orientation", "vertical");
  });

  it("omits those flags entirely when off", () => {
    // Not `="false"` — `[data-block]` matches that string, so every ordinary
    // Segmented would stretch.
    render(<Segmented options={OPTIONS} />);
    expect(root().hasAttribute("data-block")).toBe(false);
    expect(root().hasAttribute("data-vertical")).toBe(false);
    expect(root().hasAttribute("data-disabled")).toBe(false);
  });

  it("renders an icon beside the label when one is given", () => {
    render(
      <Segmented options={[{ label: "Grid", value: "grid", icon: <span data-testid="i" /> }]} />
    );
    expect(screen.getByTestId("i")).toBeInTheDocument();
  });

  it("has no icon box when no icon is given", () => {
    render(<Segmented options={OPTIONS} />);
    expect(document.querySelector('[data-scope="segmented"] [data-part="icon"]')).toBeNull();
  });

  it("spreads a consumer's attributes last", () => {
    render(<Segmented options={OPTIONS} data-size="mine" className="ck-custom" />);
    expect(root()).toHaveAttribute("data-size", "mine");
    expect(root()).toHaveClass("ck-custom");
  });

  it("survives a value containing a quote", async () => {
    // Focus used to be moved with a `[data-value="…"]` selector, which a quote
    // in a consumer's own value would break — silently, since the control still
    // selects and only focus is lost.
    const tricky = 'a"b';
    render(<Segmented options={["first", { label: "Second", value: tricky }]} />);
    items()[0]!.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(items()[1]).toHaveFocus();
  });
});
