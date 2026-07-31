import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./tooltip";

const setup = (props: Partial<Parameters<typeof Tooltip>[0]> = {}) =>
  render(
    <Tooltip title="Helpful" mouseEnterDelay={0} mouseLeaveDelay={0} {...props}>
      <button>Trigger</button>
    </Tooltip>
  );

const trigger = () => document.querySelector('[data-scope="tooltip"][data-part="trigger"]');
const content = () => document.querySelector('[data-scope="tooltip"][data-part="content"]');
const button = () => screen.getByRole("button", { name: "Trigger" });

describe("Tooltip", () => {
  it("wraps the trigger rather than replacing it", () => {
    setup();
    expect(trigger()).toBeInTheDocument();
    expect(button()).toBeInTheDocument();
  });

  it("leaves the consumer's element as the wrapper's only child", () => {
    setup();
    expect(trigger()?.children).toHaveLength(1);
    expect(trigger()?.firstElementChild?.tagName).toBe("BUTTON");
  });

  it("renders nothing until opened", () => {
    setup();
    expect(content()).not.toBeInTheDocument();
  });

  it("reports the closed state on the trigger", () => {
    setup();
    expect(trigger()).toHaveAttribute("data-state", "closed");
  });

  it("opens on pointer hover", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(button());
    await waitFor(() => expect(content()).toBeInTheDocument());
  });

  it("shows the title when open", async () => {
    const user = userEvent.setup();
    setup({ title: "Helpful hint" });
    await user.hover(button());
    await waitFor(() => expect(content()).toHaveTextContent("Helpful hint"));
  });

  it("closes when the pointer leaves", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(button());
    await waitFor(() => expect(content()).toBeInTheDocument());
    await user.unhover(button());
    await waitFor(() => expect(trigger()).toHaveAttribute("data-state", "closed"));
  });

  it("opens for a controlled open prop with no interaction at all", () => {
    setup({ open: true, onOpenChange: () => {} });
    expect(content()).toBeInTheDocument();
  });

  it("reports open changes", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    await user.hover(button());
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith({ open: true }));
  });

  it("passes overlayClassName to the popup, not to the trigger", () => {
    setup({ open: true, onOpenChange: () => {}, overlayClassName: "overlay" });
    expect(content()).toHaveClass("overlay");
    expect(trigger()).not.toHaveClass("overlay");
  });

  it("puts the consumer's className on the trigger wrapper, which is the root", () => {
    setup({ className: "mine" });
    // Rule 2: a consumer's class lands on the root untouched. The root a
    // Tooltip renders in place is the wrapper — the popup is portalled and is
    // nobody's idea of a root, and has `overlayClassName` of its own.
    expect(trigger()).toHaveClass("mine");
  });

  it("stays shut when disabled, even with a title", async () => {
    const user = userEvent.setup();
    setup({ disabled: true });
    await user.hover(button());
    expect(content()).not.toBeInTheDocument();
  });

  it("accepts the camelCase placement names", () => {
    setup({ open: true, onOpenChange: () => {}, placement: "bottomRight" });
    expect(content()).toBeInTheDocument();
  });

  it("accepts the canonical placement names", () => {
    setup({ open: true, onOpenChange: () => {}, placement: "left-start" });
    expect(content()).toBeInTheDocument();
  });

  // ------------------------------------------------------------------- ARIA

  it("describes the trigger's own child, not the wrapper", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(button());
    await waitFor(() => expect(content()).toBeInTheDocument());

    // The whole reason the ARIA is cloned onto the child rather than left on
    // our span. A screen reader announces the description of the element the
    // user FOCUSES — the button — so `aria-describedby` on a wrapper around it
    // is announced by nobody, and the tooltip is silent exactly where it is the
    // only thing conveying the information.
    expect(button()).toHaveAttribute("aria-describedby", content()!.id);
    expect(trigger()).not.toHaveAttribute("aria-describedby");
  });

  it("stops describing the trigger once closed", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(button());
    await waitFor(() => expect(button()).toHaveAttribute("aria-describedby"));
    await user.unhover(button());
    // A dangling aria-describedby pointing at a removed node makes some screen
    // readers announce nothing at all for the button.
    await waitFor(() => expect(button()).not.toHaveAttribute("aria-describedby"));
  });

  it("carries role=tooltip on the content", () => {
    setup({ open: true, onOpenChange: () => {} });
    expect(content()).toHaveAttribute("role", "tooltip");
  });

  it("does not claim the trigger opens a popup", () => {
    setup({ open: true, onOpenChange: () => {} });
    // aria-haspopup/aria-expanded belong to a menu or a dialog. A tooltip is a
    // description of the trigger, and announcing it as expandable invites the
    // user to interact with something they cannot reach.
    expect(button()).not.toHaveAttribute("aria-haspopup");
    expect(button()).not.toHaveAttribute("aria-expanded");
  });

  // ------------------------------------------------------------- empty title

  it("never opens without a title", async () => {
    const user = userEvent.setup();
    setup({ title: undefined });
    await user.hover(button());
    expect(content()).not.toBeInTheDocument();
  });

  it("treats an empty string as nothing to say", async () => {
    const user = userEvent.setup();
    setup({ title: "" });
    await user.hover(button());
    expect(content()).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------- keyboard

  it("opens on keyboard focus", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    expect(button()).toHaveFocus();
    await waitFor(() => expect(content()).toBeInTheDocument());
  });

  it("closes on Escape while focus is still on the trigger", async () => {
    const user = userEvent.setup();
    setup();
    await user.tab();
    await waitFor(() => expect(content()).toBeInTheDocument());
    // The dismissable layer only sees keys once focus is inside the content,
    // which for a tooltip it never is — so without the trigger's own handler
    // Escape does nothing and the tooltip is stuck until focus moves.
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).not.toBeInTheDocument());
  });

  it('does not render a boolean data attribute as "false"', () => {
    setup({ open: true, onOpenChange: () => {} });
    // "false" MATCHES [data-x] in CSS, so a rendered ="false" silently applies
    // the wrong styles.
    expect(document.body.innerHTML).not.toMatch(/data-[\w-]+="false"/);
  });
});
