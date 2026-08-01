import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./tabs";

const ITEMS = [
  { key: "one", label: "One", children: "First panel" },
  { key: "two", label: "Two", children: "Second panel" },
  { key: "three", label: "Three", children: "Third panel", disabled: true },
  { key: "four", label: "Four", children: "Fourth panel" },
];

const tab = (name: string) => screen.getByRole("tab", { name });
const selected = () => screen.getByRole("tab", { selected: true });

describe("Tabs", () => {
  it("renders a tablist with the first tab selected", () => {
    render(<Tabs items={ITEMS} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(selected()).toHaveTextContent("One");
  });

  it("resolves each panel's aria-labelledby to its own trigger", () => {
    render(<Tabs items={ITEMS} />);
    // v0 pointed this at `tab-${index}` while the triggers carried no id at
    // all, so the association resolved to nothing.
    const panel = screen.getByRole("tabpanel");
    const labelledBy = panel.getAttribute("aria-labelledby")!;
    expect(document.getElementById(labelledBy)).toHaveTextContent("One");
    expect(panel.id).toBe(tab("One").getAttribute("aria-controls"));
  });

  it("keys tabs by their own key, not by index", () => {
    render(<Tabs items={ITEMS} defaultActiveKey="four" />);
    expect(selected()).toHaveTextContent("Four");
  });

  it("selects on click and reports the key", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} onChange={onChange} />);
    await user.click(tab("Two"));
    expect(selected()).toHaveTextContent("Two");
    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("shows only the selected panel", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} />);
    expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
    await user.click(tab("Two"));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
  });

  // ---------------------------------------------------------------- keyboard

  it("moves selection with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} />);
    // The v1 suite could not assert this at all: its machine filtered focus
    // candidates by visibility and jsdom reports every element as zero-sized,
    // so focus never moved and the assertion would have failed against working
    // code. `navigate` is pure rect-free logic, so it is testable here.
    await user.tab();
    expect(tab("One")).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(tab("Two")).toHaveFocus();
    expect(selected()).toHaveTextContent("Two");
  });

  it("steps over a disabled tab rather than landing on it", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} />);
    await user.tab();
    await user.keyboard("{ArrowRight}{ArrowRight}");
    // "Three" is disabled and skipped in one press, not selected and rejected.
    expect(tab("Four")).toHaveFocus();
  });

  it("wraps at the end", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} />);
    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(tab("Four")).toHaveFocus();
  });

  it("jumps to first and last with Home and End", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} />);
    await user.tab();
    await user.keyboard("{End}");
    expect(tab("Four")).toHaveFocus();
    await user.keyboard("{Home}");
    expect(tab("One")).toHaveFocus();
  });

  it("uses up and down when the tabs are on a side", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} tabPosition="left" />);
    await user.tab();
    // Orientation follows tabPosition, and the arrows follow orientation —
    // Left and Right belong to the label text when the list is a column.
    await user.keyboard("{ArrowDown}");
    expect(tab("Two")).toHaveFocus();
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("focuses without selecting when activation is manual", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} activationMode="manual" onChange={onChange} />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    // The distinction the mode exists for: a panel that loads something should
    // not fetch every panel the user arrows past.
    expect(tab("Two")).toHaveFocus();
    expect(selected()).toHaveTextContent("One");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps exactly one tab in the tab order", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} />);
    expect(tab("One")).toHaveAttribute("tabindex", "0");
    expect(tab("Two")).toHaveAttribute("tabindex", "-1");
    // Roving, so Tab leaves the list rather than walking it.
    await user.tab();
    await user.tab();
    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  // ---------------------------------------------------------------- controlled

  it("obeys a controlled activeKey and does not move on its own", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={ITEMS} activeKey="two" onChange={onChange} />);
    expect(selected()).toHaveTextContent("Two");
    await user.click(tab("One"));
    expect(onChange).toHaveBeenCalledWith("one");
    expect(selected()).toHaveTextContent("Two");
  });

  it('does not render a boolean data attribute as "false"', () => {
    render(<Tabs items={ITEMS} />);
    // "false" MATCHES [data-x] in CSS, so a rendered ="false" silently applies
    // the wrong styles.
    expect(document.body.innerHTML).not.toMatch(/data-[\w-]+="false"/);
  });
});
