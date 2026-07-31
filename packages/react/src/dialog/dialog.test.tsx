import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { dismissableDepth, scrollLockDepth } from "@crosskit-ui/core";
import { Modal } from "./modal";
import { Drawer } from "./drawer";

const CONTENT = '[data-scope="dialog"][data-part="content"]';
const POSITIONER = '[data-scope="dialog"][data-part="positioner"]';
/**
 * Node's unhandled-rejection hook, typed locally.
 *
 * jsdom does not dispatch the DOM `unhandledrejection` event, so this is the
 * only place a rejection escaping a handler is observable — and `@types/node`
 * is not worth a dependency for one assertion.
 */
const nodeProcess = globalThis as unknown as {
  process: {
    on(event: "unhandledRejection", listener: () => void): void;
    off(event: "unhandledRejection", listener: () => void): void;
  };
};

const frame = () =>
  new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
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

    it("closes on a press on the mask, and reports it as a cancel", async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(
        <Modal defaultOpen title="T" onCancel={onCancel}>
          body
        </Modal>
      );
      await opened();
      // The POSITIONER, not the backdrop. Both are position:fixed inset:0 at the
      // same z-index and the positioner comes second in DOM order, so it is what
      // a real browser hands the press to. Pressing the backdrop exercises a path
      // no user can reach.
      await user.click(document.querySelector<HTMLElement>(POSITIONER)!);
      await closed();
      // Every route out reports the same way a consumer own Cancel button would.
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("reports Escape as a cancel too", async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(
        <Modal defaultOpen title="T" onCancel={onCancel}>
          body
        </Modal>
      );
      await opened();
      await user.keyboard("{Escape}");
      await closed();
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("does not close an alertdialog from outside, which must be answered", async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(
        <Modal defaultOpen role="alertdialog" title="Sure?" onCancel={onCancel}>
          body
        </Modal>
      );
      await opened();
      await user.click(document.querySelector<HTMLElement>(POSITIONER)!);
      // After a frame, not synchronously: the exit is deferred into a rAF, so an
      // immediate assertion passes even when the dialog *is* closing.
      await frame();
      expect(content()).not.toBeNull();
      expect(onCancel).not.toHaveBeenCalled();
      // Escape still works: it is a deliberate act, not a stray press.
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

    it("only the topmost layer answers Escape, with the inner one truly nested", async () => {
      const user = userEvent.setup();
      // Nested, not siblings: the inner trigger lives inside the outer dialog,
      // which is what makes the focus-restoration race real — closing the inner
      // returns focus to a node inside the outer at the exact moment the outer
      // becomes topmost. As siblings the trigger is body and the race never runs.
      function Harness() {
        const [inner, setInner] = useState(false);
        return (
          <Modal defaultOpen title="Outer" id="outer">
            <button onClick={() => setInner(true)}>open inner</button>
            <Modal open={inner} onOpenChange={d => setInner(d.open)} title="Inner" id="inner">
              inner
            </Modal>
          </Modal>
        );
      }
      render(<Harness />);
      await opened();
      await user.click(screen.getByText("open inner"));
      await waitFor(() => expect(document.querySelectorAll(CONTENT)).toHaveLength(2));

      await user.keyboard("{Escape}");
      await waitFor(() => expect(document.querySelectorAll(CONTENT)).toHaveLength(1));
      // Both closed before: the outer had its own document listener without the
      // shared stack, and the inner focus restoration dismissed it without the
      // `focus: false` opt-out.
      expect(document.querySelector(CONTENT)).toHaveTextContent("Outer");

      await user.keyboard("{Escape}");
      await closed();
    });

    it("keeps focus put across a re-render while open", async () => {
      const user = userEvent.setup();
      // An inline onOpenChange is a new identity every render. While the setup
      // effect depended on it, every render tore the trap down and rebuilt it —
      // and rebuilding moves focus to the first tabbable, so typing in the second
      // field of a dialog threw you back to the first.
      function Harness() {
        const [tick, setTick] = useState(0);
        return (
          <Modal defaultOpen onOpenChange={() => {}} title="T" footer={null}>
            <button>first</button>
            <button onClick={() => setTick(t => t + 1)}>second {tick}</button>
          </Modal>
        );
      }
      render(<Harness />);
      await opened();

      const second = screen.getByText(/^second/);
      await user.click(second);
      expect(document.activeElement).toBe(second);
      // And the layer was not re-pushed, which would put it above a dialog that
      // legitimately sits on top of it.
      expect(dismissableDepth()).toBe(1);
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

  it("writes width as a custom property the size rules read, not inline-size", async () => {
    // `size` always renders, so its `max-width` clamped an inline `inline-size`
    // and <Modal width={800}> came out at the md width. The size rules take
    // --ck-modal-width as their fallback value instead, so setting it wins.
    render(
      <Modal defaultOpen title="T" width={800}>
        body
      </Modal>
    );
    await opened();
    expect(content()!.style.getPropertyValue("--ck-modal-width")).toBe("800px");
    expect(content()!.style.inlineSize).toBe("");
  });

  it("passes a string width through untouched", async () => {
    render(
      <Modal defaultOpen title="T" width="60ch">
        body
      </Modal>
    );
    await opened();
    expect(content()!.style.getPropertyValue("--ck-modal-width")).toBe("60ch");
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

    it("holds the confirm button busy until an async onOk settles", async () => {
      const user = userEvent.setup();
      let release!: () => void;
      const onOk = vi.fn(() => new Promise<void>(resolve => (release = resolve)));
      render(
        <Modal defaultOpen title="T" onOk={onOk}>
          body
        </Modal>
      );
      await opened();
      const ok = screen.getByText("OK").closest("button")!;

      await user.click(ok);
      await waitFor(() => expect(ok).toBeDisabled());
      // A second press while it is in flight must not submit again.
      await user.click(ok);
      expect(onOk).toHaveBeenCalledTimes(1);

      release();
      await waitFor(() => expect(ok).toBeEnabled());
    });

    it("clears the busy state when onOk rejects, without an unhandled rejection", async () => {
      const user = userEvent.setup();
      const unhandled = vi.fn();
      nodeProcess.process.on("unhandledRejection", unhandled);
      // A failed submit is the ordinary case, and the consumer handles it inside
      // onOk. React discards what onClick returns, so without a catch here their
      // own already-handled rejection resurfaced as an unhandled one: a console
      // error, the dev overlay, and any global reporter, for a 422 they caught.
      const onOk = vi.fn(() => Promise.reject(new Error("422")));
      render(
        <Modal defaultOpen title="T" onOk={onOk}>
          body
        </Modal>
      );
      await opened();
      const ok = screen.getByText("OK").closest("button")!;

      await user.click(ok);
      await waitFor(() => expect(ok).toBeEnabled());
      // Still open, so the consumer can show the error next to the field.
      expect(content()).not.toBeNull();
      await frame();
      expect(unhandled).not.toHaveBeenCalled();
      nodeProcess.process.off("unhandledRejection", unhandled);
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
