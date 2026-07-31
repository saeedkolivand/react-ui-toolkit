import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Button, Modal } from "@crosskit-ui/react";

/**
 * The overlay behaviour harness.
 *
 * Deliberately not part of the parity fixture: overlays portal and only exist
 * once opened, so they cannot be captured by a static grid comparison. What this
 * page is for is the browser-only half of the contract — focus restoration
 * across `inert`, and which element a press on the mask actually reaches.
 */
function Harness() {
  const [open, setOpen] = useState(false);
  const [nested, setNested] = useState(false);
  const [cancels, setCancels] = useState(0);

  return (
    <main style={{ padding: 24 }}>
      <h1>Overlay behaviour</h1>
      <p>
        Cancels: <output id="cancels">{cancels}</output>
      </p>
      <Button id="before" onClick={() => setOpen(true)}>
        open modal
      </Button>
      <Button id="after">after</Button>

      <Modal
        open={open}
        onOpenChange={details => setOpen(details.open)}
        onCancel={() => setCancels(count => count + 1)}
        title="Outer"
        footer={null}
      >
        <Button id="inner-first" onClick={() => setNested(true)}>
          open nested
        </Button>
        <Button id="inner-second">second</Button>

        <Modal
          open={nested}
          onOpenChange={details => setNested(details.open)}
          title="Nested"
          footer={null}
          showCloseButton={false}
        >
          <Button id="nested-first">nested first</Button>
          <Button id="nested-second">nested second</Button>
        </Modal>
      </Modal>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);
