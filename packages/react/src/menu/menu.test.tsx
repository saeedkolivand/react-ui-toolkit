import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu, type MenuEntry } from "./menu";

const items: MenuEntry[] = [
  { value: "edit", label: "Edit", icon: "edit" },
  { value: "copy", label: "Copy", disabled: true },
  { separator: true },
  { value: "delete", label: "Delete", danger: true },
];

const setup = (props: Partial<Parameters<typeof Menu>[0]> = {}) =>
  render(<Menu items={items} trigger="Actions" {...props} />);

const trigger = () => screen.getByRole("button", { name: "Actions" });
const rows = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-scope="menu"][data-part="item"]'));
// noUncheckedIndexedAccess is on; every row index here is asserted to exist first.
const row = (index: number) => rows()[index]!;
const content = () => document.querySelector('[data-scope="menu"][data-part="content"]');

describe("Menu", () => {
  it("renders the trigger as a Button, not a nested one", () => {
    setup();
    expect(trigger()).toHaveAttribute("data-scope", "button");
    expect(trigger()).toHaveAttribute("data-part", "root");
    expect(trigger().querySelector("button")).toBeNull();
  });

  it("puts the trigger variant and size on the trigger", () => {
    setup({ triggerVariant: "outline", triggerSize: "sm" });
    expect(trigger()).toHaveAttribute("data-variant", "outline");
    expect(trigger()).toHaveAttribute("data-size", "sm");
  });

  it("marks the trigger so menu CSS can find it", () => {
    setup();
    expect(trigger()).toHaveAttribute("data-menu-trigger", "");
  });

  it("keeps the machine's aria wiring on the trigger", () => {
    setup();
    expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("passes triggerClassName through", () => {
    setup({ triggerClassName: "mine" });
    expect(trigger()).toHaveClass("mine");
  });

  it("renders nothing until opened", () => {
    setup();
    expect(content()).not.toBeInTheDocument();
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(trigger());
    await waitFor(() => expect(trigger()).toHaveAttribute("aria-expanded", "true"));
    expect(content()).toBeInTheDocument();
  });

  it("renders one row per item, separators excluded", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(trigger());
    await waitFor(() => expect(rows()).toHaveLength(3));
  });

  it("renders the separator as an <hr>", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    expect(document.querySelector('[data-part="separator"]')?.tagName).toBe("HR");
  });

  it("omits data-danger rather than writing false", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(trigger());
    await waitFor(() => expect(rows()).toHaveLength(3));
    expect(rows()[0]).not.toHaveAttribute("data-danger");
    expect(rows()[2]).toHaveAttribute("data-danger", "");
  });

  it("marks a disabled item", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(trigger());
    await waitFor(() => expect(rows()).toHaveLength(3));
    expect(rows()[1]).toHaveAttribute("data-disabled");
  });

  it("renders an item icon when given", async () => {
    const user = userEvent.setup();
    setup();
    await user.click(trigger());
    await waitFor(() => expect(rows()).toHaveLength(3));
    expect(row(0).querySelector('[data-scope="icon"]')).toBeInTheDocument();
  });

  it("reports the selected value", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    setup({ onSelect });
    await user.click(trigger());
    await waitFor(() => expect(rows()).toHaveLength(3));
    await user.click(row(0));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: "edit" }));
  });

  it("does not select a disabled item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    setup({ onSelect });
    await user.click(trigger());
    await waitFor(() => expect(rows()).toHaveLength(3));
    await user.click(row(1));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("opens for a controlled open prop with no interaction", () => {
    setup({ open: true, onOpenChange: () => {} });
    expect(content()).toBeInTheDocument();
  });

  it("reports open changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    await user.click(trigger());
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: true }));
  });

  it("passes className to the content", () => {
    setup({ open: true, onOpenChange: () => {}, className: "overlay" });
    expect(content()).toHaveClass("overlay");
  });

  // The mapping itself is unit-tested in core; actual positioning is
  // Playwright's job, since jsdom reports every element as zero-sized and
  // Floating UI therefore never resolves a placement.
  it("accepts v0's Ant placement names", () => {
    setup({ open: true, onOpenChange: () => {}, placement: "topRight" });
    expect(document.querySelector('[data-part="positioner"]')).toBeInTheDocument();
    expect(content()).toBeInTheDocument();
  });
});
