import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeSelect } from "@crosskit-ui/react";
import type { TreeNode } from "@crosskit-ui/core";

const meta = {
  title: "Components/TreeSelect",
  component: TreeSelect,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TreeSelect>;
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

export const Basics: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, inlineSize: 320 }}>
      <TreeSelect treeData={TREE} treeDefaultExpandAll placeholder="Pick a file" />
      <TreeSelect
        treeData={TREE}
        treeDefaultExpandAll
        multiple
        defaultValue={["button", "input"]}
      />
      <TreeSelect
        treeData={TREE}
        treeDefaultExpandAll
        multiple
        maxTagCount={2}
        defaultValue={["button", "input", "index"]}
      />
      {/* Checkable is many-valued whatever `multiple` says, because a parent
          tick is a statement about several nodes. */}
      <TreeSelect treeData={TREE} treeDefaultExpandAll treeCheckable defaultValue={["button"]} />
      <TreeSelect treeData={TREE} status="error" placeholder="Required" />
      <TreeSelect treeData={TREE} disabled defaultValue="button" />
    </div>
  ),
};
