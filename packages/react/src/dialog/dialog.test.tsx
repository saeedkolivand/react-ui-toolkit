import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Modal } from "./modal";
import { Drawer } from "./drawer";

const CONTENT = '[data-scope="dialog"][data-part="content"]';

describe("Modal", () => {
  it("renders nothing when closed", () => {
    render(<Modal title="Edit">body</Modal>);
    expect(document.querySelector(CONTENT)).toBeNull();
  });

  it("renders with the dialog scope and portals out of the React tree", async () => {
    const { container } = render(
      <Modal defaultOpen title="Edit profile">
        body
      </Modal>
    );
    await waitFor(() => expect(document.querySelector(CONTENT)).not.toBeNull());
    const content = document.querySelector(CONTENT)!;
    expect(content).toHaveAttribute("data-ck", "modal");
    expect(content).toHaveAttribute("role", "dialog");
    // portaled: not inside the component's own container
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
    await waitFor(() => expect(document.querySelector(CONTENT)).not.toBeNull());
    const id = document.querySelector(CONTENT)!.getAttribute("aria-labelledby")!;
    expect(id).toBeTruthy();
    expect(document.getElementById(id)).toHaveTextContent("Edit profile");
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
    await waitFor(() => expect(document.querySelector(CONTENT)).not.toBeNull());
    expect(screen.getByTestId("state")).toHaveTextContent("OPEN");

    await user.click(screen.getByLabelText("Close"));
    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("CLOSED"));
  });
});

describe("Drawer", () => {
  it("uses the same machine but its own data-ck and placement", async () => {
    render(
      <Drawer defaultOpen placement="left" title="Menu">
        body
      </Drawer>
    );
    await waitFor(() => expect(document.querySelector(CONTENT)).not.toBeNull());
    const content = document.querySelector(CONTENT)!;
    expect(content).toHaveAttribute("data-scope", "dialog");
    expect(content).toHaveAttribute("data-ck", "drawer");
    expect(content).toHaveAttribute("data-placement", "left");
  });
});
