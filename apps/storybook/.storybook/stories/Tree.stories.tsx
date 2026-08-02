import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tree } from "@crosskit-ui/react";
import type { TreeNode } from "@crosskit-ui/core";

const meta = { title: "Components/Tree", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj;

const TREE: TreeNode[] = [
  {
    key: "src",
    title: "src",
    children: [
      {
        key: "components",
        title: "components",
        children: [
          { key: "button", title: "Button.tsx" },
          { key: "input", title: "Input.tsx" },
        ],
      },
      { key: "index", title: "index.ts" },
    ],
  },
  {
    key: "docs",
    title: "docs",
    children: [
      { key: "readme", title: "README.md" },
      { key: "licence", title: "LICENCE", disabled: true },
    ],
  },
  { key: "package", title: "package.json" },
];

const row = { display: "flex", gap: 48, flexWrap: "wrap" } as const;

export const Basics: Story = {
  render: () => (
    <div style={row}>
      <div style={{ inlineSize: 240 }}>
        <Tree treeData={TREE} defaultExpandAll defaultSelectedKeys={["button"]} />
      </div>
      <div style={{ inlineSize: 240 }}>
        <Tree treeData={TREE} defaultExpandedKeys={["src"]} showLine />
      </div>
      <div style={{ inlineSize: 240 }}>
        <Tree treeData={TREE} defaultExpandAll multiple />
      </div>
    </div>
  ),
};

/**
 * A parent is derived from its children, never stored — so LICENCE being
 * disabled holds `docs` at indeterminate however many times you tick it.
 */
export const Checkable: Story = {
  render: () => (
    <div style={{ inlineSize: 260 }}>
      <Tree treeData={TREE} defaultExpandAll checkable defaultCheckedKeys={["button"]} />
    </div>
  ),
};

export const CustomTitles: Story = {
  render: () => (
    <div style={{ inlineSize: 300 }}>
      <Tree
        treeData={TREE}
        defaultExpandAll
        titleRender={(node, flat) => (
          <span>
            {node.title as string}
            <code style={{ marginInlineStart: 8, fontSize: 11, opacity: 0.5 }}>
              L{flat.depth + 1}
            </code>
          </span>
        )}
      />
    </div>
  ),
};
