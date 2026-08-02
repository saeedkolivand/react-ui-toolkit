import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "@crosskit-ui/react";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj;

export const Basics: Story = {
  render: function Render() {
    const [page, setPage] = useState(5);
    return (
      <div style={{ display: "grid", gap: 24, justifyItems: "start" }}>
        <Pagination total={200} pageSize={10} current={page} onChange={setPage} />
        <Pagination total={200} pageSize={10} size="small" />
        <Pagination total={30} pageSize={10} showTotal={(t, [a, b]) => `${a}–${b} of ${t}`} />
        <Pagination total={240} showSizeChanger showQuickJumper />
        <Pagination total={200} pageSize={10} disabled />
        {/* Everything on one page and told to disappear. */}
        <Pagination total={5} pageSize={10} hideOnSinglePage />
      </div>
    );
  },
};
