import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Skeleton } from "@crosskit-ui/react";

/**
 * The skeleton harness.
 *
 * Both an active and a still block, because the reduced-motion assertion is only
 * worth anything next to a control: a shimmer that never started reads exactly
 * like a shimmer correctly silenced, and the still block is what tells the two
 * apart.
 */
function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 24 }}>
      <div id="active">
        <Skeleton active avatar />
      </div>
      <div id="still">
        <Skeleton avatar />
      </div>
      <Skeleton.Button id="active-button" active />

      {/* A fixed-width parent, so "is the child centred" is a question with an
          answer. A Node is the one block that centres what you put in it, and
          `block` must not cost it that. */}
      {/* One per keyword, so "does `size` do anything" is measurable. A rule
          that restates the base values makes a keyword a silent no-op. */}
      <div id="avatar-sizes">
        <Skeleton.Avatar size="small" />
        <Skeleton.Avatar size="default" />
        <Skeleton.Avatar size="large" />
      </div>

      <div style={{ inlineSize: 600 }}>
        <Skeleton.Node id="block-node" block>
          <span id="block-node-child">chart</span>
        </Skeleton.Node>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);
