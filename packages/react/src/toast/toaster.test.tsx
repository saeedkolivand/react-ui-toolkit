import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createToastQueue } from "@crosskit-ui/core";
import { Toaster } from "./toaster";

const group = () => document.querySelector('[data-scope="toast"][data-part="group"]')!;
const roots = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-scope="toast"][data-part="root"]'));
const root = (index = 0) => roots()[index]!;

describe("Toaster", () => {
  it("renders the group with scope and part", () => {
    render(<Toaster toaster={createToastQueue()} />);
    expect(group()).toBeInTheDocument();
  });

  it("renders nothing while the queue is empty", () => {
    render(<Toaster toaster={createToastQueue()} />);
    expect(roots()).toHaveLength(0);
  });

  it("is a live region that exists before anything lands in it", () => {
    render(<Toaster toaster={createToastQueue()} />);
    // Announcement depends on the region pre-existing its content, so these
    // belong on the empty group rather than on a toast.
    expect(group()).toHaveAttribute("role", "region");
    expect(group()).toHaveAttribute("aria-live", "polite");
    expect(group()).toHaveAttribute("aria-relevant", "additions text");
    expect(group()).toHaveAttribute("aria-atomic", "false");
  });

  it("splits the placement onto the group for CSS to position it", () => {
    render(<Toaster toaster={createToastQueue({ placement: "top-start" })} />);
    expect(group()).toHaveAttribute("data-placement", "top-start");
    expect(group()).toHaveAttribute("data-side", "top");
    expect(group()).toHaveAttribute("data-align", "start");
  });

  it("renders a toast created through the queue, with no hook or provider", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("renders the description", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved", description: "Your changes are live" });
    await waitFor(() => expect(screen.getByText("Your changes are live")).toBeInTheDocument());
  });

  it("names and describes the toast from its own title and description", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved", description: "Your changes are live" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    expect(root()).toHaveAccessibleName("Saved");
    expect(root()).toHaveAccessibleDescription("Your changes are live");
  });

  it("puts the type on the root so CSS can colour it", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.success({ title: "Saved" });
    await waitFor(() => expect(root()).toHaveAttribute("data-type", "success"));
  });

  it("renders an icon matched to the type", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.error({ title: "Failed" });
    await waitFor(() => expect(root().querySelector('[data-part="icon"]')).toBeInTheDocument());
  });

  it("suppresses the icon when asked", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} hideIcon />);
    toaster.error({ title: "Failed" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    expect(root().querySelector('[data-part="icon"]')).toBeNull();
  });

  it("exposes each convenience type", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.success({ title: "s" });
    toaster.error({ title: "e" });
    toaster.loading({ title: "l" });
    await waitFor(() => expect(roots()).toHaveLength(3));
    const types = roots().map(el => el.getAttribute("data-type"));
    expect(types).toEqual(expect.arrayContaining(["success", "error", "loading"]));
  });

  it("stacks several toasts", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "one" });
    toaster.create({ title: "two" });
    await waitFor(() => expect(roots()).toHaveLength(2));
  });

  it("renders a close button only when the toast is closable", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("renders a close button that dismisses", async () => {
    const user = userEvent.setup();
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved", closable: true });
    await waitFor(() => expect(roots()).toHaveLength(1));
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(root()).toHaveAttribute("data-state", "closed"));
  });

  it("renders an action trigger when one is given", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Deleted", action: { label: "Undo", onClick: () => {} } });
    await waitFor(() => expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument());
  });

  it("runs the action handler on click and dismisses", async () => {
    const user = userEvent.setup();
    const toaster = createToastQueue();
    const onClick = vi.fn();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Deleted", action: { label: "Undo", onClick } });
    await waitFor(() => expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalledOnce();
    await waitFor(() => expect(root()).toHaveAttribute("data-state", "closed"));
  });

  it("dismisses programmatically by id", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    const id = toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    toaster.dismiss(id);
    await waitFor(() => expect(root()).toHaveAttribute("data-state", "closed"));
  });

  it("updates an existing toast in place rather than adding one", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    const id = toaster.create({ title: "Uploading" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    toaster.update(id, { title: "Uploaded" });
    await waitFor(() => expect(screen.getByText("Uploaded")).toBeInTheDocument());
    expect(roots()).toHaveLength(1);
  });

  it("holds the countdown while the pointer is over the group", async () => {
    const user = userEvent.setup();
    const toaster = createToastQueue();
    const pause = vi.spyOn(toaster, "pause");
    const resume = vi.spyOn(toaster, "resume");
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    await user.hover(root());
    expect(pause).toHaveBeenCalled();
    await user.unhover(root());
    expect(resume).toHaveBeenCalled();
  });

  it("matches the hotkey on the physical key, not the composed character", async () => {
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    // What macOS actually delivers for option+T: the physical key is `KeyT`
    // and the character it composes to is a dagger. Matching on the character
    // meant the label advertised a shortcut that did nothing on that layout.
    fireEvent.keyDown(document, { code: "KeyT", key: "†", altKey: true });
    expect(group()).toHaveFocus();
  });

  it("keeps holding while one of the two signals is still raised", async () => {
    const user = userEvent.setup();
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));

    const resume = vi.spyOn(toaster, "resume");
    root().focus();
    await user.hover(root());
    await user.unhover(root());
    // Pointer and focus are independent holds. Driving both through one
    // pause/resume pair meant whichever ended first released the other's — so
    // brushing the pointer over a group that already had focus restarted the
    // countdown with focus still in it.
    expect(resume).not.toHaveBeenCalled();
    await user.tab();
    expect(resume).toHaveBeenCalled();
  });

  it("focuses the group on alt+T once there is something to read", async () => {
    const user = userEvent.setup();
    const toaster = createToastQueue();
    render(<Toaster toaster={toaster} />);
    // The label advertises the shortcut, so it has to work — and it must do
    // nothing while the region is empty rather than focus an empty box.
    await user.keyboard("{Alt>}t{/Alt}");
    expect(group()).not.toHaveFocus();
    toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    await user.keyboard("{Alt>}t{/Alt}");
    expect(group()).toHaveFocus();
  });
});
