import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popconfirm } from "./popconfirm";

const setup = (props: Partial<Parameters<typeof Popconfirm>[0]> = {}) =>
  render(
    <Popconfirm title="Delete this?" {...props}>
      <button>Delete</button>
    </Popconfirm>
  );

const trigger = () => screen.getByRole("button", { name: "Delete" });
const dialog = () => screen.queryByRole("dialog");
/**
 * The popup's own element, for reading `data-state`.
 *
 * "Is it in the document" is the wrong question while a popup is closing:
 * presence deliberately keeps a dismissed node mounted through its exit
 * animation, so a closed popover is still findable for a beat and an assertion
 * that only looks for it passes whether or not it closed.
 */
const content = () => document.querySelector('[data-scope="popover"][data-part="content"]');
const ok = (name = "Yes") => screen.getByRole("button", { name });
const part = (name: string) =>
  document.querySelector(`[data-scope="popconfirm"][data-part="${name}"]`);

const open = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(trigger());
  await waitFor(() => expect(dialog()).toBeInTheDocument());
};

describe("Popconfirm", () => {
  it("renders nothing until the trigger is clicked", () => {
    setup();
    expect(dialog()).not.toBeInTheDocument();
  });

  it("does not open on hover", async () => {
    const user = userEvent.setup();
    setup();
    await user.hover(trigger());
    // The default trigger is `click` alone, unlike Popover's. A confirm asks
    // about something destructive, and crossing it with a pointer is not asking.
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(dialog()).not.toBeInTheDocument();
  });

  it("names the dialog with the question", async () => {
    const user = userEvent.setup();
    setup();
    await open(user);
    // A dialog with no accessible name is announced as just "dialog", which
    // tells a screen-reader user nothing about what they are being asked.
    expect(dialog()).toHaveAccessibleName(/Delete this\?/);
  });

  it("confirms and closes", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    setup({ onConfirm });
    await open(user);
    await user.click(screen.getByRole("button", { name: "Yes" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
  });

  it("cancels and closes", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    setup({ onCancel, onConfirm });
    await open(user);
    await user.click(screen.getByRole("button", { name: "No" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
  });

  it("does not report a cancel when Escape closes it", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    setup({ onCancel });
    await open(user);
    await user.keyboard("{Escape}");
    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
    // Escape is "go away", not "no". Reporting it as a cancel would run an
    // `onCancel` that reverts something for a user who only looked away.
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("holds OK busy while an async confirm settles, and closes after", async () => {
    const user = userEvent.setup();
    let settle: (() => void) | undefined;
    const onConfirm = vi.fn(() => new Promise<void>(resolve => (settle = resolve)));
    setup({ onConfirm });
    await open(user);
    await user.click(ok());

    // Still up, and busy: closing on click would tell the user it worked before
    // it has.
    await waitFor(() => expect(ok()).toHaveAttribute("data-loading", ""));
    expect(content()).toHaveAttribute("data-state", "open");

    settle?.();
    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
  });

  it("stays open when the confirm rejects", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn(() => Promise.reject(new Error("409")));
    setup({ onConfirm });
    await open(user);
    await user.click(ok());
    // The busy state clearing is what proves the catch ran, so this is the
    // signal to wait on — and it is read off the button rather than off "is
    // there a loading button anywhere", which a popup that closed would also
    // satisfy.
    await waitFor(() => expect(ok()).not.toHaveAttribute("data-loading"));
    // The action failed. Dismissing the question anyway says it succeeded — and
    // the rejection is swallowed rather than rethrown, because React discards
    // what onClick returns and it would surface as an unhandled rejection.
    expect(content()).toHaveAttribute("data-state", "open");
  });

  it("takes okText, cancelText and a danger OK", async () => {
    const user = userEvent.setup();
    setup({ okText: "Destroy", cancelText: "Keep", okDanger: true });
    await open(user);
    const ok = screen.getByRole("button", { name: "Destroy" });
    expect(screen.getByRole("button", { name: "Keep" })).toBeInTheDocument();
    expect(ok).toHaveAttribute("data-danger", "");
  });

  it("drops the cancel button when asked", async () => {
    const user = userEvent.setup();
    setup({ showCancel: false });
    await open(user);
    expect(screen.queryByRole("button", { name: "No" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Yes" })).toBeInTheDocument();
  });

  it("omits the symbol on `icon={false}`", async () => {
    const user = userEvent.setup();
    setup({ icon: false });
    await open(user);
    expect(part("icon")).not.toBeInTheDocument();
  });

  it("emits no description box for a description that renders to nothing", async () => {
    const user = userEvent.setup();
    // `false`, not `undefined`, because that is what `{detail && detail.text}`
    // evaluates to — and a `!= null` check lets it straight past and emits an
    // empty box that still takes its indent. An `undefined` here would pass
    // either way, so it would assert nothing about the check being made.
    setup({ description: false });
    await open(user);
    expect(part("description")).not.toBeInTheDocument();
  });

  it("renders a description when given one", async () => {
    const user = userEvent.setup();
    setup({ description: "This cannot be undone." });
    await open(user);
    expect(part("description")).toHaveTextContent("This cannot be undone.");
  });

  it("reports open changes and follows a controlled `open`", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popconfirm title="Delete this?" open={false} onOpenChange={onOpenChange}>
        <button>Delete</button>
      </Popconfirm>
    );
    await user.click(trigger());
    // Controlled: the click reports, and nothing opens until the consumer says so.
    expect(onOpenChange).toHaveBeenCalledWith({ open: true });
    expect(dialog()).not.toBeInTheDocument();

    rerender(
      <Popconfirm title="Delete this?" open onOpenChange={onOpenChange}>
        <button>Delete</button>
      </Popconfirm>
    );
    await waitFor(() => expect(dialog()).toBeInTheDocument());

    onOpenChange.mockClear();
    await user.click(screen.getByRole("button", { name: "No" }));
    expect(onOpenChange).toHaveBeenCalledWith({ open: false });
    // Still open, because the consumer holds the state and has not answered.
    expect(dialog()).toBeInTheDocument();
  });

  it("keeps its parts under its own scope", async () => {
    const user = userEvent.setup();
    setup({ description: "Gone for good." });
    await open(user);
    // Every rule in `overlay.css` is compound — `[data-scope][data-part]` on one
    // element — so a part that carries both scopes is the only way a popover
    // rule could reach a popconfirm part or the reverse. `title` is the one both
    // components own a part called, and it is the one that would collide.
    for (const name of ["header", "icon", "message", "title", "description", "actions"]) {
      expect(part(name)).toBeInTheDocument();
      expect(part(name)).not.toHaveAttribute("data-scope", "popover");
    }
    // The popover's own title is the box AROUND the header, not the header.
    const popoverTitle = document.querySelector('[data-scope="popover"][data-part="title"]');
    expect(popoverTitle).not.toBe(part("header"));
    expect(popoverTitle).toContainElement(part("header") as HTMLElement);
  });
});
