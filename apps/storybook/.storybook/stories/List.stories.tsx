import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button, Card, List, Tag } from "@crosskit-ui/react";

const meta = {
  title: "Components/List",
  component: List,
  parameters: { layout: "padded" },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj;

const PEOPLE = Array.from({ length: 7 }, (_, index) => ({
  id: `p${index}`,
  name: `Person ${index + 1}`,
  role: index % 2 === 0 ? "Engineer" : "Designer",
}));

export const Basics: Story = {
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
