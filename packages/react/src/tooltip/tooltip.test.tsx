import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./tooltip";

const setup = (props: Partial<Parameters<typeof Tooltip>[0]> = {}) =>
  render(
    <Tooltip content="Helpful" openDelay={0} closeDelay={0} {...props}>
      <button>Trigger</button>
    </Tooltip>
  );

const triggerWrapper = () => document.querySelector('[data-scope="tooltip"][data-part="trigger"]');
const content = () => document.querySelector('[data-scope="tooltip"][data-part="content"]');

describe("Tooltip", () => {
  it("wraps the trigger rather than replacing it", () => {
    setup();
    expect(triggerWrapper()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
  });

  it("leaves the consumer's element as the wrapper's only child", () => {
    setup();
    expect(triggerWrapper()?.children).toHaveLength(1);
    expect(triggerWrapper()?.firstElementChild?.tagName).toBe("BUTTON");
  });

  it("passes className to the trigger wrapper", () => {
    setup({ className: "mine" });
    expect(triggerWrapper()).toHaveClass("mine");
  });

  it("renders nothing until opened", () => {
    setup();
    expect(content()).not.toBeInTheDocument();
  });

  it("reports the closed state on the trigger", () => {
    setup();
    expect(triggerWrapper()).toHaveAttribute("data-state", "closed");
  });

  it("opens on pointer hover", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    await waitFor(() => expect(content()).toBeInTheDocument());
  });

  it("shows the content when open", async () => {
    const user = userEvent.setup();
    setup({ content: "Helpful hint" });
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    await waitFor(() => expect(content()).toHaveTextContent("Helpful hint"));
  });

  it("describes the trigger while open, for assistive tech", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    await waitFor(() => expect(triggerWrapper()).toHaveAttribute("aria-describedby"));
    expect(triggerWrapper()?.getAttribute("aria-describedby")).toBe(content()?.id);
  });

  it("closes when the pointer leaves", async () => {
    const user = userEvent.setup();
    setup();
    const btn = screen.getByRole("button", { name: "Trigger" });
    await user.hover(btn);
    await waitFor(() => expect(content()).toBeInTheDocument());
    await user.unhover(btn);
    await waitFor(() => expect(triggerWrapper()).toHaveAttribute("data-state", "closed"));
  });

  it("opens for a controlled open prop with no interaction at all", () => {
    setup({ open: true, onOpenChange: () => {} });
    expect(content()).toBeInTheDocument();
  });

  it("reports open changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: true }));
  });

  it("stays shut when disabled", async () => {
    const user = userEvent.setup();
    setup({ disabled: true });
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    expect(content()).not.toBeInTheDocument();
  });

  it("passes contentClassName to the content", () => {
    setup({ open: true, onOpenChange: () => {}, contentClassName: "overlay" });
    expect(content()).toHaveClass("overlay");
  });

  // Both naming schemes are accepted; the mapping itself is unit-tested in
  // core. Actual positioning is Playwright's job — jsdom reports every element
  // as zero-sized, so Floating UI never resolves a placement here.
  it("accepts v0's Ant placement names", () => {
    setup({ open: true, onOpenChange: () => {}, placement: "bottomRight" });
    expect(content()).toBeInTheDocument();
  });

  it("accepts Floating UI placement names", () => {
    setup({ open: true, onOpenChange: () => {}, placement: "left-start" });
    expect(content()).toBeInTheDocument();
  });
});
