import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Collapse } from "./collapse";

const ITEMS = [
  { key: "a", label: "Section A", children: "Body A" },
  { key: "b", label: "Section B", children: "Body B" },
  { key: "c", label: "Section C", children: "Body C", disabled: true },
  { key: "d", label: "Section D", children: "Body D" },
];

const header = (name: string) => screen.getByRole("button", { name: new RegExp(name) });
const expanded = (name: string) => header(name).getAttribute("aria-expanded");

describe("Collapse", () => {
  it("starts with everything closed and toggles a panel", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    expect(expanded("Section A")).toBe("false");
    await user.click(header("Section A"));
    expect(expanded("Section A")).toBe("true");
    await user.click(header("Section A"));
    expect(expanded("Section A")).toBe("false");
  });

  it("allows several open at once by default", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    await user.click(header("Section A"));
    await user.click(header("Section B"));
    // Ant's default, and the opposite of v1's: `accordion` is what opts into
    // one-at-a-time, rather than `allowMultiple` opting out of it.
    expect(expanded("Section A")).toBe("true");
    expect(expanded("Section B")).toBe("true");
  });

  it("keeps one open at a time in accordion mode", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} accordion />);
    await user.click(header("Section A"));
    await user.click(header("Section B"));
    expect(expanded("Section A")).toBe("false");
    expect(expanded("Section B")).toBe("true");
  });

  it("still lets the open panel close in accordion mode", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} accordion />);
    await user.click(header("Section A"));
    await user.click(header("Section A"));
    // Nothing open is a legitimate state, not something to be prevented.
    expect(expanded("Section A")).toBe("false");
  });

  it("reports the whole open set, even in accordion mode", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Collapse items={ITEMS} onChange={onChange} />);
    await user.click(header("Section A"));
    expect(onChange).toHaveBeenLastCalledWith(["a"]);
    await user.click(header("Section B"));
    expect(onChange).toHaveBeenLastCalledWith(["a", "b"]);
  });

  it("accepts a bare string for the single-panel case", () => {
    render(<Collapse items={ITEMS} defaultActiveKey="b" />);
    expect(expanded("Section B")).toBe("true");
    expect(expanded("Section A")).toBe("false");
  });

  it("hides the closed panels", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    expect(screen.queryByText("Body A")).not.toBeVisible();
    await user.click(header("Section A"));
    expect(screen.getByText("Body A")).toBeVisible();
  });

  it("points each panel at the header that names it", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    await user.click(header("Section A"));
    const panel = screen.getByRole("region", { name: /Section A/ });
    expect(panel).toHaveAttribute("aria-labelledby", header("Section A").id);
    expect(header("Section A")).toHaveAttribute("aria-controls", panel.id);
  });

  it("leaves the chevron its own icon scope", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    const chevron = header("Section A").querySelector("svg")!;

    // `Icon` spreads its rest props LAST, so passing `data-scope` here replaces
    // the svg's own `data-scope="icon"` — and `icon.css` keys every bit of icon
    // presentation off that alone. The chevron rendered as an 866px black
    // block. The stylesheet never needed it: the accordion rule is a descendant
    // selector already satisfied by the root.
    expect(chevron).toHaveAttribute("data-scope", "icon");
    expect(chevron).toHaveAttribute("data-part", "item-indicator");

    // And it still carries the state the rotation keys off.
    expect(chevron).toHaveAttribute("data-state", "closed");
    await user.click(header("Section A"));
    expect(header("Section A").querySelector("svg")).toHaveAttribute("data-state", "open");
  });

  // ---------------------------------------------------------------- keyboard

  it("moves between headers with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    await user.tab();
    expect(header("Section A")).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(header("Section B")).toHaveFocus();
    // Moving focus does not open anything — a header is a button, not a tab.
    expect(expanded("Section B")).toBe("false");
  });

  it("steps over a disabled header", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    await user.tab();
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(header("Section D")).toHaveFocus();
  });

  it("jumps to first and last with Home and End", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    await user.tab();
    await user.keyboard("{End}");
    expect(header("Section D")).toHaveFocus();
    await user.keyboard("{Home}");
    expect(header("Section A")).toHaveFocus();
  });

  it("leaves left and right to the text inside the header", async () => {
    const user = userEvent.setup();
    render(<Collapse items={ITEMS} />);
    await user.tab();
    // The headers are stacked, so the inline axis is not the widget's.
    await user.keyboard("{ArrowRight}");
    expect(header("Section A")).toHaveFocus();
  });

  // -------------------------------------------------------------- controlled

  it("obeys a controlled activeKey and does not move on its own", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Collapse items={ITEMS} activeKey={["b"]} onChange={onChange} />);
    expect(expanded("Section B")).toBe("true");
    await user.click(header("Section A"));
    expect(onChange).toHaveBeenCalledWith(["b", "a"]);
    expect(expanded("Section A")).toBe("false");
  });

  it('does not render a boolean data attribute as "false"', () => {
    render(<Collapse items={ITEMS} />);
    expect(document.body.innerHTML).not.toMatch(/data-[\w-]+="false"/);
  });
});
