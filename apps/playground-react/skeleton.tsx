import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Flex, Skeleton, Space } from "@crosskit-ui/react";

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

      {/* One per keyword, so "does `size` do anything" is measurable. A rule
          that restates the base values makes a keyword a silent no-op. */}
      <div id="avatar-sizes">
        <Skeleton.Avatar size="small" />
        <Skeleton.Avatar size="default" />
        <Skeleton.Avatar size="large" />
      </div>

      {/* A fixed-width parent, so "is the child centred" is a question with an
          answer. A Node is the one block that centres what you put in it, and
          `block` must not cost it that. */}
      <div style={{ inlineSize: 600 }}>
        <Skeleton.Node id="block-node" block>
          <span id="block-node-child">chart</span>
        </Skeleton.Node>
      </div>

      {/* Circles at every size. Their width comes from `aspect-ratio` rather
          than from a width rule per size, so "is it still square" is a
          question the refactor has to keep answering. */}
      <div id="circle-buttons">
        <Skeleton.Button shape="circle" size="small" />
        <Skeleton.Button shape="circle" />
        <Skeleton.Button shape="circle" size="large" />
      </div>

      {/* The same circle in each of the containers a consumer will actually put
          it in. A cross-axis `auto` is what a flex column stretches, and an
          aspect ratio does not stop it — so a circle in a `<Flex vertical>`,
          which this library ships and which defaults to `align-items: stretch`,
          is the one that can come out flat. */}
      <div id="circle-contexts" style={{ inlineSize: 600 }}>
        <Flex vertical>
          <Skeleton.Button id="circle-flex-column" shape="circle" />
        </Flex>
        <Flex>
          <Skeleton.Button id="circle-flex-row" shape="circle" />
        </Flex>
        <div style={{ display: "grid" }}>
          <Skeleton.Button id="circle-grid" shape="circle" />
        </div>
        <div>
          <Skeleton.Button id="circle-block" shape="circle" />
        </div>
        <Space direction="vertical">
          <Skeleton.Button id="circle-space" shape="circle" />
        </Space>
        <Flex vertical>
          <Skeleton.Button id="circle-numeric" shape="circle" size={48} />
        </Flex>
      </div>

      {/* Every keyword combination that sets its own width, all told to fill.
          Button is the only part where `block` and a keyword both want the
          inline axis, so it is the only one that can lose the argument. */}
      <div id="block-buttons" style={{ inlineSize: 600 }}>
        <Skeleton.Button block />
        <Skeleton.Button block size="large" />
        <Skeleton.Button block size="small" />
        <Skeleton.Button block shape="circle" />
        <Skeleton.Button block shape="circle" size="small" />
        <Skeleton.Button block shape="round" size="large" />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);
