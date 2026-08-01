import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Button, Notification, Popconfirm, Toaster } from "@crosskit-ui/react";
import { createToastQueue } from "@crosskit-ui/core";

/**
 * Two surfaces over two queues, which is the shape a real app has: transient
 * messages in one corner, notifications that stay until they are read in
 * another. It is also the shape the alt+T cycle exists for — with one surface on
 * the page there is nothing to cycle through.
 */
const messages = createToastQueue({ placement: "bottom-start" });
const notices = createToastQueue({ placement: "top-end" });

/**
 * Direction is set on `<html>` by the spec, not here.
 *
 * Every popup on this page is portalled to `document.body`, so a `dir` on the
 * element the trigger sits in never reaches the thing being measured. The
 * document is the only place it applies to both.
 */
function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 32, justifyItems: "start" }}>
      {/* The alignment claim, with the symbol present and absent. The question
          and its detail share a column beside the symbol, so their inline start
          edges are the same number — and that holds with no indent constant,
          which is the point of putting them in one column. */}
      {/* Opened by the spec rather than `defaultOpen`. A popup left open on load
          is a fixed layer over the page, and it intercepted the clicks the
          notification tests further down need to make. */}
      <Popconfirm id="with-icon" title="Delete this?" description="This cannot be undone.">
        <Button id="with-icon-trigger" danger>
          Delete
        </Button>
      </Popconfirm>
      <Popconfirm
        id="without-icon"
        title="Delete this?"
        description="This cannot be undone."
        icon={false}
      >
        <Button id="without-icon-trigger">Delete plain</Button>
      </Popconfirm>

      {/* A Popconfirm inside a transformed ancestor.

          `transform` on any ancestor makes that element the containing block for
          a `position: fixed` descendant, so a popup that is not portalled to
          `document.body` lands offset by however far the ancestor sits from the
          viewport origin. Popconfirm reaches the portal through Popover rather
          than owning one, so the guarantee has to be checked here too. */}
      <div id="transformed" style={{ transform: "translateX(0)", marginInlineStart: 80 }}>
        <Popconfirm id="anchored" title="Delete this?">
          <Button id="anchored-trigger">Delete anchored</Button>
        </Popconfirm>
      </div>

      <button
        id="notify"
        onClick={() =>
          notices.create({
            title: "Deployed",
            description: "Build 402 is live.",
            duration: Number.POSITIVE_INFINITY,
          })
        }
      >
        Notify
      </button>
      <button
        id="message"
        onClick={() => messages.create({ title: "Saved", duration: Number.POSITIVE_INFINITY })}
      >
        Message
      </button>
      {/* A notification whose description contains something calling itself an
          icon. The toast grid rule used to be `[data-scope="toast"]
          [data-part="icon"]` — ANY descendant — so this took a row in a grid it
          is not a child of. */}
      <button
        id="notify-nested"
        onClick={() =>
          notices.create({
            id: "nested",
            title: "Nested",
            description: (
              <span data-part="icon" id="stowaway">
                detail
              </span>
            ),
            duration: Number.POSITIVE_INFINITY,
          })
        }
      >
        Notify with a nested icon part
      </button>

      {/* Sits under the notification corner on purpose: a click landing here is
          the assertion that a fixed, full-width group is not eating the page. */}
      <button
        id="underneath"
        data-clicked="0"
        onClick={event => {
          const target = event.currentTarget;
          target.dataset.clicked = String(Number(target.dataset.clicked) + 1);
        }}
        style={{
          position: "fixed",
          insetBlockStart: 0,
          insetInlineEnd: 0,
          inlineSize: 200,
          blockSize: 48,
        }}
      >
        underneath
      </button>

      <Toaster toaster={messages} />
      <Notification toaster={notices} />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);
