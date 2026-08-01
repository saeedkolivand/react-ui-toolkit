import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, Descriptions, List, Pagination, Statistic, Tag } from "@crosskit-ui/react";

const meta = {
  title: "Components/Data",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Statistics: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
      <Statistic title="Revenue" value={1234567.5} precision={2} prefix="$" />
      <Statistic title="Active users" value={98211} />
      <Statistic title="Conversion" value={12.3456} precision={1} suffix="%" />
      <Statistic title="Uptime" value="99.99%" />
      <Statistic title="Loading" value={0} loading />
    </div>
  ),
};

export const DescriptionLists: Story = {
  render: () => {
    const items = [
      { label: "Name", children: "Ada Lovelace" },
      { label: "Role", children: "Engineer" },
      { label: "Team", children: "Core" },
      { label: "Bio", children: "Spans the whole row.", span: 3 },
    ];
    return (
      <div style={{ display: "grid", gap: 32 }}>
        <Descriptions title="Profile" items={items} />
        {/* Vertical stacks each value under its own label — the pair wrapper is
            a real box here and `display: contents` in the layout above. */}
        <Descriptions title="Vertical" layout="vertical" items={items} />
        <Descriptions title="Bordered" bordered items={items} />
        <Descriptions title="Two columns" column={2} size="small" items={items} />
      </div>
    );
  },
};

export const Paginations: Story = {
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

const PEOPLE = Array.from({ length: 7 }, (_, index) => ({
  id: `p${index}`,
  name: `Person ${index + 1}`,
  role: index % 2 === 0 ? "Engineer" : "Designer",
}));

export const Lists: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 32, maxInlineSize: 560 }}>
      <Card variant="default">
        <List
          header="Team"
          footer={`${PEOPLE.length} people`}
          dataSource={PEOPLE}
          rowKey={person => person.id}
          renderItem={person => (
            <List.Item
              actions={[
                <Button key="e" type="text" size="small">
                  Edit
                </Button>,
              ]}
            >
              <List.Item.Meta title={person.name} description={person.role} />
            </List.Item>
          )}
        />
      </Card>

      {/* A List renders a Pagination inside itself, and both have `item` and
          `list` parts — the case that made the row rules reach the page
          buttons until the selectors became child combinators. */}
      <List
        bordered
        dataSource={PEOPLE}
        rowKey={person => person.id}
        pagination={{ pageSize: 3 }}
        renderItem={person => <List.Item extra={<Tag>{person.role}</Tag>}>{person.name}</List.Item>}
      />

      <List dataSource={[]} renderItem={() => null} />
      <List dataSource={[]} renderItem={() => null} emptyText="Nothing here yet" />
      <List dataSource={PEOPLE.slice(0, 2)} renderItem={p => p.name} loading />
    </div>
  ),
};
