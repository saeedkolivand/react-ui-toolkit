import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Button, Toaster } from "@crosskit-ui/react";
import { createToastQueue } from "@crosskit-ui/core";

/**
 * The toast harness.
 *
 * Four independent queues, one per placement, because where the group lands is
 * the thing that cannot be asserted anywhere else — jsdom reports every rect as
 * 0×0 at the origin, so a group pinned to the wrong corner is indistinguishable
 * there from one pinned correctly.
 *
 * The full-page button underneath them is the other reason this page exists.
 * The group spans the whole inline axis so a `center` placement has something
 * to centre in, which means it lies across the page; if it did not pass pointer
 * events through, it would swallow every click in the band it covers. jsdom
 * does not implement `pointer-events` at all, so nothing else can catch that.
 */
const queues = {
  "bottom-end": createToastQueue({ placement: "bottom-end" }),
  "top-start": createToastQueue({ placement: "top-start" }),
  "top-end": createToastQueue({ placement: "top-end" }),
  "bottom-start": createToastQueue({ placement: "bottom-start", max: 2 }),
} as const;

/**
 * A `resume()` counter on the bottom-end queue.
 *
 * The hold bugs on this component are all about a hold being *released* when
 * nothing released it, and the downstream symptom — a toast expiring — can be
 * repaired by a later pointer event before it shows up. Counting the releases
 * measures the thing itself.
 */
let resumes = 0;
const counted = queues["bottom-end"].resume.bind(queues["bottom-end"]);
queues["bottom-end"].resume = () => {
  resumes += 1;
  document.getElementById("resumes")?.setAttribute("data-count", String(resumes));
  counted();
};

function Harness() {
  return (
    <main style={{ padding: 0, minBlockSize: "100vh" }}>
      {/* Sits under the bottom groups on purpose: a click landing here is the
          assertion that the fixed group is not eating the page. */}
      <button
        id="underneath"
        data-clicked="0"
        onClick={event => {
          const target = event.currentTarget;
          target.dataset.clicked = String(Number(target.dataset.clicked) + 1);
        }}
        style={{
          position: "absolute",
          insetBlockEnd: 0,
          insetInlineStart: 0,
          inlineSize: "100%",
          blockSize: 160,
        }}
      >
        underneath
      </button>

      <div style={{ position: "absolute", insetBlockStart: 20, insetInlineStart: 20 }}>
        <Button
          id="add-bottom-end"
          onClick={() => queues["bottom-end"].success({ title: "Saved" })}
        >
          add-bottom-end
        </Button>{" "}
        <Button
          id="add-closable"
          onClick={() =>
            queues["bottom-end"].create({
              title: "Deleted",
              description: "The file is gone",
              closable: true,
            })
          }
        >
          add-closable
        </Button>{" "}
        <Button
          id="add-sticky"
          onClick={() => queues["bottom-end"].loading({ title: "Uploading", id: "sticky" })}
        >
          add-sticky
        </Button>{" "}
        <Button id="dismiss-sticky" onClick={() => queues["bottom-end"].dismiss("sticky")}>
          dismiss-sticky
        </Button>{" "}
        <Button id="add-top-start" onClick={() => queues["top-start"].info({ title: "Top start" })}>
          add-top-start
        </Button>{" "}
        <Button
          id="add-top-start-2"
          onClick={() => queues["top-start"].info({ title: "Top start two" })}
        >
          add-top-start-2
        </Button>{" "}
        <Button id="add-top-end" onClick={() => queues["top-end"].info({ title: "Top end" })}>
          add-top-end
        </Button>{" "}
        <Button
          id="add-overflow"
          onClick={() => {
            queues["bottom-start"].create({ id: "one", title: "one" });
            queues["bottom-start"].create({ id: "two", title: "two" });
            queues["bottom-start"].create({ id: "three", title: "three" });
          }}
        >
          add-overflow
        </Button>
      </div>

      <span id="resumes" data-count="0" hidden />

      <div data-fixture="bottom-end">
        <Toaster toaster={queues["bottom-end"]} />
      </div>
      <div data-fixture="top-start">
        <Toaster toaster={queues["top-start"]} />
      </div>
      <div data-fixture="top-end">
        <Toaster toaster={queues["top-end"]} />
      </div>
      <div data-fixture="bottom-start">
        <Toaster toaster={queues["bottom-start"]} />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);
