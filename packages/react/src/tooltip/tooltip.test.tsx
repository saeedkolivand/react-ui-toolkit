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

  it("puts color where both the box and its arrow can see it", () => {
    setup({ open: true, onOpenChange: () => {}, color: "rgb(1, 2, 3)" });
    const positioner = document.querySelector<HTMLElement>(
      '[data-scope="tooltip"][data-part="positioner"]'
    )!;
    const arrow = document.querySelector<HTMLElement>('[data-scope="tooltip"][data-part="arrow"]')!;

    // The arrow is a SIBLING of the content — it has to be, or a scrolling menu
    // would clip it — so a custom property set on the content inherits to
    // nothing that matters, and the arrow keeps the stylesheet default while
    // the box turns. The positioner is the only ancestor of both.
    expect(arrow.parentElement).toBe(positioner);
    expect(positioner.style.getPropertyValue("--ck-tooltip-bg")).toBe("rgb(1, 2, 3)");
    expect(arrow.closest("[style*='--ck-tooltip-bg']")).toBe(positioner);
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

  it("stays shut when a title comes back after being disabled mid-hover", async () => {
    const user = userEvent.setup();
    // The default enter delay, deliberately: the bug lives inside it.
    const { rerender } = render(
      <Tooltip title="Note">
        <button>Trigger</button>
      </Tooltip>
    );
    await user.hover(button());
    // Emptied while the open timer is still armed. `open` is derived, so
    // nothing shows — but the timer still fires and writes the state
    // underneath, invisibly.
    rerender(
      <Tooltip title="">
        <button>Trigger</button>
      </Tooltip>
    );
    await user.unhover(button());
    await new Promise(resolve => setTimeout(resolve, 200));

    // The pointer is nowhere near it by now, and this is the shape the docs
    // recommend: `title={row.note}`, where the note arrives later.
    rerender(
      <Tooltip title="Note back">
        <button>Trigger</button>
      </Tooltip>
    );
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(content()).not.toBeInTheDocument();
  });

  it("reports one close per Escape, not two", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    await user.tab();
    await waitFor(() => expect(content()).toBeInTheDocument());
    onOpenChange.mockClear();

    // `pushDismissable` answers Escape from a document-level CAPTURE listener,
    // so it has already closed this before anything on the trigger could —
    // wherever focus is. A second close here made one press report twice.
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).not.toBeInTheDocument());
    expect(onOpenChange.mock.calls).toEqual([[{ open: false }]]);
  });

  it('does not render a boolean data attribute as "false"', () => {
    setup({ open: true, onOpenChange: () => {} });
    // "false" MATCHES [data-x] in CSS, so a rendered ="false" silently applies
    // the wrong styles.
    expect(document.body.innerHTML).not.toMatch(/data-[\w-]+="false"/);
  });
});
