import { describe, expect, it } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./popover";

const setup = (props: Partial<Parameters<typeof Popover>[0]> = {}) =>
  render(
    <Popover
      title="Settings"
      content={<button>Reset</button>}
      mouseEnterDelay={0}
      mouseLeaveDelay={0}
      {...props}
    >
      <button>Open</button>
    </Popover>
  );

/** Leave delay for the two tests that have to observe a timer rather than a click. */
const DELAY = 60;
/** Waits past that delay, so "still open" means cancelled rather than merely early. */
const settle = () =>
  act(async () => {
    await new Promise(resolve => setTimeout(resolve, DELAY * 3));
  });

const trigger = () => screen.getByRole("button", { name: "Open" });
const content = () => document.querySelector('[data-scope="popover"][data-part="content"]');
const title = () => document.querySelector('[data-scope="popover"][data-part="title"]');

describe("Popover", () => {
  it("renders nothing until opened", () => {
    setup();
    expect(content()).not.toBeInTheDocument();
  });

  it("opens on hover and shows both title and content", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    expect(title()).toHaveTextContent("Settings");
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
  });

  it("omits the title part entirely when there is no title", async () => {
    const user = userEvent.setup();
    setup({ title: undefined });
    await user.hover(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    // An empty heading box still takes its margin, which reads as a stray gap.
    expect(title()).not.toBeInTheDocument();
  });

  it("is a dialog rather than a tooltip", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    // The content holds real controls. `role="tooltip"` would tell a screen
    // reader this is a description of the trigger, and its contents then get
    // flattened into one announced string with the button inside unusable.
    expect(content()).toHaveAttribute("role", "dialog");
    expect(trigger()).toHaveAttribute("aria-haspopup", "dialog");
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("stays open while the pointer is over the popup itself", async () => {
    const user = userEvent.setup();
    // A real leave delay, unlike every other test here, because the delay IS
    // the mechanism under test: leaving the trigger schedules a close and
    // entering the popup cancels it. At `mouseLeaveDelay={0}` there is no
    // window to cancel within — the close is synchronous, correctly, since that
    // is what asking for no delay means — so this would be testing nothing.
    setup({ mouseLeaveDelay: DELAY / 1000 });
    await user.hover(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());

    // Without the cancel, every popover with a control in it vanishes on the
    // way to that control.
    await user.unhover(trigger());
    await user.hover(content()!);

    // Past the scheduled close, NOT merely after the hover. Asserting straight
    // after `hover` passes whether or not anything cancelled the timer, because
    // the timer had not fired yet either way — the first version of this test
    // did exactly that and survived deleting the cancel outright.
    //
    // On `data-state` rather than on presence: the node outlives `open` by
    // design, so "still in the document" would also hold for a popover that
    // closed and is merely animating out.
    await settle();
    expect(content()).toHaveAttribute("data-state", "open");

    await user.unhover(content()!);
    await waitFor(() => expect(content()).not.toBeInTheDocument());
  });

  it("closes on the same delay when the pointer goes nowhere near the popup", async () => {
    const user = userEvent.setup();
    setup({ mouseLeaveDelay: DELAY / 1000 });
    await user.hover(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    // The other half of the pair: the same wait with no hover onto the popup
    // must close it, or "stays open" above would hold for a popover that never
    // closes at all.
    await user.unhover(trigger());
    await settle();
    expect(content()).toHaveAttribute("data-state", "closed");
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    setup({ trigger: "click" });
    await user.click(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(content()).not.toBeInTheDocument());
  });

  it("toggles on click when that is the trigger", async () => {
    const user = userEvent.setup();
    setup({ trigger: "click" });
    await user.click(trigger());
    await waitFor(() => expect(content()).toBeInTheDocument());
    // The trigger is outside the content, so without `exclude` the dismissable
    // layer treats this press as an outside press: it closes, and the click
    // handler reopens it in the same tick.
    await user.click(trigger());
    await waitFor(() => expect(content()).not.toBeInTheDocument());
  });

  it('does not render a boolean data attribute as "false"', () => {
    setup({ open: true, onOpenChange: () => {} });
    expect(document.body.innerHTML).not.toMatch(/data-[\w-]+="false"/);
  });
});
