import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { dismissableDepth, scrollLockDepth } from "@crosskit-ui/core";
import { Modal } from "./modal";
import { Drawer } from "./drawer";

const CONTENT = '[data-scope="dialog"][data-part="content"]';
const BACKDROP = '[data-scope="dialog"][data-part="backdrop"]';
const content = () => document.querySelector<HTMLElement>(CONTENT);
const opened = () => waitFor(() => expect(content()).not.toBeNull());
const closed = () => waitFor(() => expect(content()).toBeNull());

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(<Modal title="Edit">body</Modal>);
    expect(content()).toBeNull();
  });

  it("renders with the dialog scope and portals out of the React tree", async () => {
    const { container } = render(
      <Modal defaultOpen title="Edit profile">
        body
      </Modal>
    );
    await opened();
    expect(content()).toHaveAttribute("data-ck", "modal");
    expect(content()).toHaveAttribute("role", "dialog");
    // Portalled: not inside the component's own container. Rule 6 — an ancestor
    // with a transform would otherwise become the containing block.
    expect(container.querySelector(CONTENT)).toBeNull();
  });

  // v0 set aria-labelledby="modal-title" with no such id anywhere in the tree,
  // so the accessible name never resolved.
  it("resolves aria-labelledby to the rendered title", async () => {
    render(
      <Modal defaultOpen title="Edit profile">
        body
      </Modal>
    );
    await opened();
    const id = content()!.getAttribute("aria-labelledby")!;
    expect(id).toBeTruthy();
    expect(document.getElementById(id)).toHaveTextContent("Edit profile");
  });

  it("claims no labelledby when there is no title to point at", async () => {
    // A dangling aria-labelledby is worse than none: the name resolves to
    // nothing and the dialog is announced unnamed either way, but the attribute
    // suppresses any fallback.
    render(<Modal defaultOpen>body</Modal>);
    await opened();
    expect(content()).not.toHaveAttribute("aria-labelledby");
    expect(content()).not.toHaveAttribute("aria-describedby");
  });

  it("round-trips a controlled open prop in both directions", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>open</button>
          <span data-testid="state">{open ? "OPEN" : "CLOSED"}</span>
          <Modal open={open} onOpenChange={d => setOpen(d.open)} title="T">
            body
          </Modal>
        </>
      );
    }
    render(<Harness />);

    await user.click(screen.getByText("open"));
    await opened();
    expect(screen.getByTestId("state")).toHaveTextContent("OPEN");

    await user.click(screen.getByLabelText("Close"));
    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("CLOSED"));
  });

  describe("the behaviour that used to come from a state machine", () => {
    it("moves focus into the dialog and back to the trigger on close", async () => {
      const user = userEvent.setup();
      function Harness() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <button onClick={() => setOpen(true)}>open</button>
            <Modal open={open} onOpenChange={d => setOpen(d.open)} title="T" footer={null}>
              <button>inside</button>
            </Modal>
          </>
        );
      }
      render(<Harness />);
      const trigger = screen.getByText("open");

      await user.click(trigger);
      await opened();
      await waitFor(() => expect(content()!.contains(document.activeElement)).toBe(true));

      await user.keyboard("{Escape}");
      await closed();
      // Captured at activate(), not at construction — building the trap at mount
      // would have recorded <body> and sent focus there instead.
      expect(document.activeElement).toBe(trigger);
    });

    it("wraps Tab rather than letting it leave", async () => {
      const user = userEvent.setup();
      render(
        <Modal defaultOpen title="T" showCloseButton={false} footer={null}>
          <button>first</button>
          <button>last</button>
        </Modal>
      );
      await opened();

      screen.getByText("last").focus();
      await user.tab();
      expect(document.activeElement).toBe(screen.getByText("first"));

      await user.tab({ shift: true });
      expect(document.activeElement).toBe(screen.getByText("last"));
    });

    it("closes on a click on the mask", async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(
        <Modal defaultOpen title="T" onCancel={onCancel}>
          body
        </Modal>
      );
      await opened();
      await user.click(document.querySelector<HTMLElement>(BACKDROP)!);
      await closed();
      // Every route out reports the same way a consumer's own Cancel would.
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("does not close an alertdialog from outside, which must be answered", async () => {
      const user = userEvent.setup();
      render(
        <Modal defaultOpen role="alertdialog" title="Sure?">
          body
        </Modal>
      );
      await opened();
      await user.click(document.querySelector<HTMLElement>(BACKDROP)!);
      expect(content()).not.toBeNull();
      // Escape still works: it is a deliberate act, not a stray click.
      await user.keyboard("{Escape}");
      await closed();
    });

    it("honours closeOnEscape={false}", async () => {
      const user = userEvent.setup();
      render(
        <Modal defaultOpen closeOnEscape={false} title="T">
          body
        </Modal>
      );
      await opened();
      await user.keyboard("{Escape}");
      expect(content()).not.toBeNull();
    });

    it("only the topmost layer answers Escape", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Modal defaultOpen title="Outer" id="outer">
            outer
          </Modal>
          <Modal defaultOpen title="Inner" id="inner">
            inner
          </Modal>
        </>
      );
      await waitFor(() => expect(document.querySelectorAll(CONTENT)).toHaveLength(2));
      await user.keyboard("{Escape}");
      // Without a shared stack both have a document listener and both close.
      await waitFor(() => expect(document.querySelectorAll(CONTENT)).toHaveLength(1));
      expect(document.querySelector(CONTENT)).toHaveTextContent("Outer");
    });

    it("releases the layer, the scroll lock and the background on close", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Modal defaultOpen title="T">
          body
        </Modal>
      );
      await opened();
      expect(dismissableDepth()).toBe(1);
      expect(scrollLockDepth()).toBe(1);
      // Portalled, so the app root is a sibling of the overlay and has to be
      // inerted directly rather than by wrapping.
      expect(container.inert).toBe(true);

      await user.keyboard("{Escape}");
      await closed();
      expect(dismissableDepth()).toBe(0);
      expect(scrollLockDepth()).toBe(0);
      expect(container.inert).toBe(false);
    });

    it("releases everything when unmounted while still open", async () => {
      const { unmount } = render(
        <Modal defaultOpen title="T">
          body
        </Modal>
      );
      await opened();
      unmount();
      // A dialog torn down by a route change must not leave the page locked.
      expect(dismissableDepth()).toBe(0);
      expect(scrollLockDepth()).toBe(0);
    });

    it("does none of it when modal={false}", async () => {
      render(
        <Modal defaultOpen modal={false} title="T">
          body
        </Modal>
      );
      await opened();
      expect(scrollLockDepth()).toBe(0);
      expect(content()).not.toHaveAttribute("aria-modal");
      // Still dismissable: non-modal does not mean non-closable.
      expect(dismissableDepth()).toBe(1);
    });
  });

  describe("footer", () => {
    it("renders the locale's confirm and cancel by default", async () => {
      render(
        <Modal defaultOpen title="T">
          body
        </Modal>
      );
      await opened();
      expect(screen.getByText("OK")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("calls onOk without closing, so a failed submit can keep the dialog up", async () => {
      const user = userEvent.setup();
      const onOk = vi.fn();
      render(
        <Modal defaultOpen title="T" onOk={onOk}>
          body
        </Modal>
      );
      await opened();
      await user.click(screen.getByText("OK"));
      expect(onOk).toHaveBeenCalledTimes(1);
      expect(content()).not.toBeNull();
    });

    it("removes the footer for null, and replaces it for anything else", async () => {
      const { rerender } = render(
        <Modal defaultOpen title="T" footer={null}>
          body
        </Modal>
      );
      await opened();
      expect(document.querySelector('[data-part="footer"]')).toBeNull();

      rerender(
        <Modal defaultOpen title="T" footer={<button>Only this</button>}>
          body
        </Modal>
      );
      expect(screen.getByText("Only this")).toBeInTheDocument();
      expect(screen.queryByText("OK")).toBeNull();
    });
  });
});

describe("Drawer", () => {
  it("uses the same hook but its own data-ck and placement", async () => {
    render(
      <Drawer defaultOpen placement="left" title="Menu">
        body
      </Drawer>
    );
    await opened();
    expect(content()).toHaveAttribute("data-scope", "dialog");
    expect(content()).toHaveAttribute("data-ck", "drawer");
    expect(content()).toHaveAttribute("data-placement", "left");
  });

  it("shares the layer stack with Modal, rather than keeping its own", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Modal defaultOpen title="Behind">
          behind
        </Modal>
        <Drawer defaultOpen title="In front">
          front
        </Drawer>
      </>
    );
    await waitFor(() => expect(document.querySelectorAll(CONTENT)).toHaveLength(2));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(document.querySelectorAll(CONTENT)).toHaveLength(1));
    expect(document.querySelector(CONTENT)).toHaveAttribute("data-ck", "modal");
  });
});
