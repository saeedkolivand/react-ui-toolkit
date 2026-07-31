import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createToaster } from "@crosskit-ui/core";
import { Toaster } from "./toaster";

const group = () => document.querySelector('[data-scope="toast"][data-part="group"]');
const roots = () =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-scope="toast"][data-part="root"]'));
const root = (index = 0) => roots()[index]!;

describe("Toaster", () => {
  it("renders the group with scope and part", () => {
    render(<Toaster toaster={createToaster()} />);
    expect(group()).toBeInTheDocument();
  });

  it("renders nothing while the queue is empty", () => {
    render(<Toaster toaster={createToaster()} />);
    expect(roots()).toHaveLength(0);
  });

  it("renders a toast created through the store, with no hook or provider", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    expect(screen.getByText("Saved")).toBeInTheDocument();
  });

  it("renders the description", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved", description: "Your changes are live" });
    await waitFor(() => expect(screen.getByText("Your changes are live")).toBeInTheDocument());
  });

  it("puts the type on the root so CSS can colour it", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    toaster.success({ title: "Saved" });
    await waitFor(() => expect(root()).toHaveAttribute("data-type", "success"));
  });

  it("renders an icon matched to the type", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    toaster.error({ title: "Failed" });
    await waitFor(() => expect(root().querySelector('[data-part="icon"]')).toBeInTheDocument());
  });

  it("suppresses the icon when asked", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} hideIcon />);
    toaster.error({ title: "Failed" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    expect(root().querySelector('[data-part="icon"]')).toBeNull();
  });

  it("exposes each convenience type", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    toaster.success({ title: "s" });
    toaster.error({ title: "e" });
    toaster.loading({ title: "l" });
    await waitFor(() => expect(roots()).toHaveLength(3));
    const types = roots().map(el => el.getAttribute("data-type"));
    expect(types).toEqual(expect.arrayContaining(["success", "error", "loading"]));
  });

  it("stacks several toasts", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "one" });
    toaster.create({ title: "two" });
    await waitFor(() => expect(roots()).toHaveLength(2));
  });

  it("renders a close button that dismisses", async () => {
    const user = userEvent.setup();
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Saved", closable: true });
    await waitFor(() => expect(roots()).toHaveLength(1));
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    await waitFor(() => expect(root()).toHaveAttribute("data-state", "closed"));
  });

  it("renders an action trigger when one is given", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    toaster.create({ title: "Deleted", action: { label: "Undo", onClick: () => {} } });
    await waitFor(() => expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument());
  });

  it("runs the action handler on click", async () => {
    const user = userEvent.setup();
    const toaster = createToaster();
    let ran = false;
    render(<Toaster toaster={toaster} />);
    toaster.create({
      title: "Deleted",
      action: {
        label: "Undo",
        onClick: () => {
          ran = true;
        },
      },
    });
    await waitFor(() => expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(ran).toBe(true);
  });

  it("dismisses programmatically by id", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    const id = toaster.create({ title: "Saved" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    toaster.dismiss(id);
    await waitFor(() => expect(root()).toHaveAttribute("data-state", "closed"));
  });

  it("updates an existing toast in place rather than adding one", async () => {
    const toaster = createToaster();
    render(<Toaster toaster={toaster} />);
    const id = toaster.create({ title: "Uploading" });
    await waitFor(() => expect(roots()).toHaveLength(1));
    toaster.update(id, { title: "Uploaded" });
    await waitFor(() => expect(screen.getByText("Uploaded")).toBeInTheDocument());
    expect(roots()).toHaveLength(1);
  });
});
