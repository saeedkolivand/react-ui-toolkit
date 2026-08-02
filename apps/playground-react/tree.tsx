import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@crosskit-ui/styles";
import { Tree } from "@crosskit-ui/react";
import type { TreeNode } from "@crosskit-ui/core";

const TREE: TreeNode[] = [
  {
    key: "docs",
    title: "Docs",
    children: [
      {
        key: "guide",
        title: "Guide",
        children: [
          { key: "intro", title: "Intro" },
          { key: "setup", title: "Setup" },
        ],
      },
      { key: "api", title: "API" },
    ],
  },
  { key: "changelog", title: "Changelog" },
];

function Harness() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 32, justifyItems: "start" }}>
      <div id="plain" style={{ inlineSize: 280 }}>
        <Tree treeData={TREE} defaultExpandAll defaultSelectedKeys={["setup"]} />
      </div>

      {/* One branch open and one closed, so both chevron states are measurable
          in the same render. */}
      <div id="mixed" style={{ inlineSize: 280 }}>
        <Tree treeData={TREE} defaultExpandedKeys={["docs"]} />
      </div>

      <div id="lines" style={{ inlineSize: 280 }}>
        <Tree treeData={TREE} defaultExpandAll showLine checkable />
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Harness />
  </StrictMode>
);
