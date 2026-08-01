import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createToastQueue } from "@crosskit-ui/core";
import { Notification, Toaster } from "./toaster";

const group = (scope: string) =>
  document.querySelector<HTMLElement>(`[data-scope="${scope}"][data-part="group"]`)!;
const roots = (scope: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(`[data-scope="${scope}"][data-part="root"]`));

describe("Notification", () => {
  it("renders under its own scope, so a consumer can style the two surfaces apart", async () => {
    const queue = createToastQueue();
    render(<Notification toaster={queue} />);
    queue.create({ title: "Deployed", description: "Build 402 is live." });
    await waitFor(() => expect(roots("notification")).toHaveLength(1));
    // Same queue, same markup, same ARIA — the scope is the whole difference,
    // and it is the difference that lets one page hold both.
    expect(roots("toast")).toHaveLength(0);
    expect(screen.getByText("Deployed")).toBeInTheDocument();
    expect(screen.getByText("Build 402 is live.")).toBeInTheDocument();
  });

  it("puts the scope on every part, not only the root", async () => {
    const queue = createToastQueue();
    render(<Notification toaster={queue} />);
    queue.create({
      title: "Deployed",
      description: "Build 402 is live.",
      action: { label: "View", onClick: () => {} },
    });
    await waitFor(() => expect(roots("notification")).toHaveLength(1));
    // A part left on `data-scope="toast"` would take the shared rules anyway and
    // look right, so nothing visual could catch it — but it would also answer a
    // consumer's `[data-scope="toast"]` override, which is the thing the second
    // scope exists to keep separate.
    for (const part of ["title", "description", "action-trigger", "close-trigger"]) {
      expect(
        document.querySelector(`[data-scope="notification"][data-part="${part}"]`)
      ).toBeInTheDocument();
    }
  });

  it("is closable by default, unlike a message", async () => {
    const user = userEvent.setup();
    const queue = createToastQueue();
    render(<Notification toaster={queue} />);
    queue.create({ title: "Deployed" });
    await waitFor(() => expect(roots("notification")).toHaveLength(1));
    // A notification stays until it is read; a message speaks and goes.
    const close = screen.getByRole("button", { name: "Dismiss" });
    await user.click(close);
    await waitFor(() => expect(roots("notification")[0]).toHaveAttribute("data-state", "closed"));
  });

  it("loses the close button when told `closable: false`", async () => {
    const queue = createToastQueue();
    render(<Notification toaster={queue} />);
    queue.create({ title: "Deployed", closable: false });
    await waitFor(() => expect(roots("notification")).toHaveLength(1));
    // `||` against the surface default would read an explicit `false` as unset
    // and put the button back — the one value the option exists to express.
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("cycles alt+T through both surfaces instead of one of them winning", async () => {
    const user = userEvent.setup();
    const messages = createToastQueue({ placement: "bottom-end" });
    const notices = createToastQueue({ placement: "top-end" });
    render(
      <>
        <Toaster toaster={messages} />
        <Notification toaster={notices} />
      </>
    );
    messages.create({ title: "Saved" });
    notices.create({ title: "Deployed" });
    await waitFor(() => expect(roots("toast")).toHaveLength(1));
    await waitFor(() => expect(roots("notification")).toHaveLength(1));

    // Every surface listens on the document, so each grabbing focus for itself
    // left whichever mounted last holding it and the other unreachable — with
    // the label on both still advertising the shortcut.
    await user.keyboard("{Alt>}t{/Alt}");
    expect(group("toast")).toHaveFocus();
    await user.keyboard("{Alt>}t{/Alt}");
    expect(group("notification")).toHaveFocus();
    // And back, rather than stopping at the end of the list.
    await user.keyboard("{Alt>}t{/Alt}");
    expect(group("toast")).toHaveFocus();
  });

  it("skips an empty surface when cycling", async () => {
    const user = userEvent.setup();
    const messages = createToastQueue();
    const notices = createToastQueue({ placement: "top-end" });
    render(
      <>
        <Toaster toaster={messages} />
        <Notification toaster={notices} />
      </>
    );
    notices.create({ title: "Deployed" });
    await waitFor(() => expect(roots("notification")).toHaveLength(1));
    // Two presses, both landing on the only group with anything in it — an empty
    // region is a focus stop that reads as nothing at all.
    await user.keyboard("{Alt>}t{/Alt}");
    expect(group("notification")).toHaveFocus();
    await user.keyboard("{Alt>}t{/Alt}");
    expect(group("notification")).toHaveFocus();
  });
});
