import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Button, Dropdown, Popover, Select, Tabs, Tooltip } from "@crosskit-ui/react";

/**
 * The anchored overlay harness.
 *
 * Everything here needs real layout, which is the whole reason it is not a unit
 * test: jsdom gives every element a 0×0 rect at the origin, so a popup that
 * anchored to the wrong node, flipped to the wrong side, or landed on top of
 * its own trigger reads there exactly like one that is placed perfectly.
 *
 * The triggers are deliberately at the four edges. A tooltip asked for `top` at
 * the top of the viewport has nowhere to go and must flip — which is the only
 * way to tell a positioner that flips from one that silently clamps.
 */
function Harness() {
  return (
    <main style={{ padding: 0, minBlockSize: "100vh" }}>
      {/* Pinned to the very top, so `placement="top"` cannot fit. */}
      <div style={{ position: "absolute", insetBlockStart: 2, insetInlineStart: 400 }}>
        <Tooltip title="Flipped downward" placement="top" mouseEnterDelay={0}>
          <Button id="flip-top">flip-top</Button>
        </Tooltip>
      </div>

      {/* Middle of the page, where the requested side fits and must be used. */}
      <div style={{ position: "absolute", insetBlockStart: 380, insetInlineStart: 400 }}>
        <Tooltip title="Stays above" placement="top" mouseEnterDelay={0}>
          <Button id="fits">fits</Button>
        </Tooltip>
      </div>

      <div style={{ position: "absolute", insetBlockStart: 380, insetInlineStart: 40 }}>
        <Popover
          title="Popover"
          content={<Button id="popover-button">inner</Button>}
          placement="right"
          trigger="click"
        >
          <Button id="popover-trigger">popover</Button>
        </Popover>
      </div>

      <div style={{ position: "absolute", insetBlockStart: 380, insetInlineStart: 700 }}>
        <Dropdown
          menu={{
            items: [
              { key: "edit", label: "Edit" },
              { key: "duplicate", label: "Duplicate" },
              { type: "divider" },
              { key: "delete", label: "Delete", danger: true },
            ],
          }}
          placement="bottomLeft"
          trigger="click"
        >
          <Button id="menu-trigger">menu</Button>
        </Dropdown>
      </div>

      {/* Default triggers, untouched, for the keyboard paths. The instances above
          set `trigger="click"` so a Playwright press is deterministic, which
          also means they never exercise what a consumer gets by default —
          Dropdown's is hover, and Popover's is hover plus click. These are
          driven by focus and keys only, so no pointer timing is involved. */}
      <div style={{ position: "absolute", insetBlockStart: 680, insetInlineStart: 400 }}>
        <Dropdown
          menu={{
            items: [
              { key: "one", label: "One" },
              { key: "two", label: "Two" },
            ],
          }}
        >
          <button id="default-menu">default menu</button>
        </Dropdown>
      </div>

      <div style={{ position: "absolute", insetBlockStart: 680, insetInlineStart: 620 }}>
        <Popover title="Defaults" content={<button id="default-popover-button">inner</button>}>
          <button id="default-popover">default popover</button>
        </Popover>
      </div>

      {/* `trigger="focus"`, which nothing else on this page uses. The close hands
          focus back to the trigger, and for this mode that focus is itself the
          gesture that opens it — so the two mechanisms fought and the overlay
          could not be dismissed at all. Needs a real browser: whether a focus
          counts as keyboard-visible is `:focus-visible`, which jsdom answers
          differently and inconsistently. */}
      <div style={{ position: "absolute", insetBlockStart: 760, insetInlineStart: 400 }}>
        <Dropdown
          menu={{
            items: [
              { key: "alpha", label: "Alpha" },
              { key: "beta", label: "Beta" },
            ],
          }}
          trigger="focus"
        >
          <button id="focus-menu">focus menu</button>
        </Dropdown>
      </div>

      {/* Long enough to exceed any viewport this suite runs in. A menu that does
          not cap itself against the room actually available runs off the bottom
          with its last items unreachable — and flip and shift cannot rescue it,
          because content taller than both sides fits on neither. */}
      <div style={{ position: "absolute", insetBlockStart: 300, insetInlineStart: 850 }}>
        <Dropdown
          menu={{
            items: Array.from({ length: 30 }, (_, i) => ({
              key: `row-${i}`,
              label: `Row ${i}`,
            })),
          }}
          trigger="click"
        >
          <button id="long-menu">long menu</button>
        </Dropdown>
      </div>

      {/* A Popover trigger INSIDE a tab panel. The tab rules are descendant
          selectors, so an unscoped `[data-type="line"] [data-part="trigger"]`
          reached this one and gave a popover trigger a tab's bottom border —
          Tooltip, Popover, Menu and Select all render a `trigger` part. */}
      <div
        style={{ position: "absolute", insetBlockStart: 840, insetInlineStart: 400, width: 320 }}
      >
        <Tabs
          items={[
            {
              key: "nested",
              label: "Nested",
              children: (
                <Popover title="Inner" content="body">
                  <button id="tab-nested-trigger">nested trigger</button>
                </Popover>
              ),
            },
          ]}
        />
      </div>

      {/* A `line` Tabs inside a `card` Tabs. The type rules are scoped to
          `[data-scope="tabs"]` at both ends, which keeps them off a Popover or
          Select trigger — but an inner Tabs' triggers carry that scope by
          construction, and both blocks are the same specificity, so source
          order decided and `card` won. */}
      <div
        style={{ position: "absolute", insetBlockStart: 1040, insetInlineStart: 400, width: 360 }}
      >
        <Tabs
          type="card"
          items={[
            {
              key: "outer",
              label: "Outer card",
              children: (
                <Tabs
                  type="line"
                  items={[{ key: "inner", label: "Inner line", children: "panel" }]}
                />
              ),
            },
          ]}
        />
      </div>

      <div
        style={{ position: "absolute", insetBlockStart: 1180, insetInlineStart: 400, width: 360 }}
      >
        <Tabs type="line" items={[{ key: "alone", label: "Alone", children: "panel" }]} />
      </div>

      {/* The same card at the default position, to mirror the bottom one
          against. */}
      <div
        style={{ position: "absolute", insetBlockStart: 1260, insetInlineStart: 400, width: 360 }}
      >
        <Tabs type="card" items={[{ key: "t1", label: "Top card", children: "panel" }]} />
      </div>

      {/* `tabPosition="bottom"`, so the panel's gap can be measured on the side
          the list is actually on. */}
      <div
        style={{ position: "absolute", insetBlockStart: 940, insetInlineStart: 400, width: 320 }}
      >
        <Tabs
          tabPosition="bottom"
          type="card"
          items={[{ key: "b1", label: "Bottom", children: "panel" }]}
        />
      </div>

      {/* Near the TOP, with a tall page below it — which is what exposes the
          jump. Placed at the bottom instead, the buggy scroll had nowhere left
          to go and the test passed with the fix reverted.

          The jump itself:
          the highlight-into-view effect ran before `attachPosition` had made
          the popup `fixed`, so the option was still in normal flow at the end of
          `<body>` and `scrollIntoView` walked the whole document to it. */}
      <div
        style={{ position: "absolute", insetBlockStart: 200, insetInlineStart: 480, width: 442 }}
      >
        <Select
          label="Country"
          defaultValue="za"
          options={[
            { value: "ng", label: "Nigeria" },
            { value: "gh", label: "Ghana" },
            { value: "ke", label: "Kenya" },
            { value: "za", label: "South Africa" },
          ]}
        />
      </div>

      {/* An ancestor with a transform. `position: fixed` inside one resolves
          against THAT element rather than the viewport, so a popup rendered in
          place here would land somewhere else entirely — the portal is what
          makes this case identical to the others. */}
      <div
        style={{
          position: "absolute",
          insetBlockStart: 560,
          insetInlineStart: 400,
          transform: "translateX(0px)",
        }}
      >
        <Tooltip title="Portalled out" placement="top" mouseEnterDelay={0}>
          <Button id="transformed">transformed</Button>
        </Tooltip>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);
