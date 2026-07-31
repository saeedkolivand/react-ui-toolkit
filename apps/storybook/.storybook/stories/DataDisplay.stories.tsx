import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TableColumn } from "@crosskit-ui/core";
import { Avatar, Progress, Table } from "@crosskit-ui/react";

const meta = {
  title: "Components/Data display",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const row = { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" } as const;

export const Avatars: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={row}>
        {(["sm", "md", "lg", "xl"] as const).map(size => (
          <Avatar key={size} alt="Ada Lovelace" size={size} />
        ))}
      </div>
      <div style={row}>
        {(["online", "offline", "busy", "away"] as const).map(status => (
          <Avatar key={status} alt="Grace Hopper" status={status} />
        ))}
      </div>
      <div style={row}>
        <Avatar alt="Alan Turing" squared />
        <Avatar alt="Alan Turing" bordered />
        <Avatar initials="CK" />
      </div>
    </div>
  ),
};

export const Progresses: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 20, maxWidth: 420 }}>
      <Progress value={62} label="Uploading" showValue />
      {/* Indeterminate is value={null}, which is what ARIA actually models. */}
      <Progress value={null} label="Working" />
      {(["success", "error", "warning", "info"] as const).map(variant => (
        <Progress key={variant} value={45} variant={variant} />
      ))}
      <Progress value={70} striped animated />
    </div>
  ),
};

interface Person {
  name: string;
  role: string;
  location: string;
}

const PEOPLE: Person[] = [
  { name: "Ada Lovelace", role: "Analyst", location: "London" },
  { name: "Grace Hopper", role: "Rear Admiral", location: "New York" },
  { name: "Alan Turing", role: "Cryptanalyst", location: "Bletchley" },
  { name: "Edsger Dijkstra", role: "Professor", location: "Austin" },
  { name: "Barbara Liskov", role: "Professor", location: "Cambridge" },
  { name: "Katherine Johnson", role: "Mathematician", location: "Hampton" },
];

const COLUMNS: TableColumn<Person>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  { id: "location", header: "Location", accessor: "location", align: "end" },
];

export const Tables: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 40 }}>
      {/* The header is a real button, so sorting works from the keyboard. */}
      <Table data={PEOPLE} columns={COLUMNS} pageSize={4} showSizeChanger />
      <Table data={PEOPLE} columns={COLUMNS} density="small" bordered striped pagination={false} />
      <Table data={[]} columns={COLUMNS} emptyMessage="Nobody here yet" />
      <Table data={PEOPLE} columns={COLUMNS} loading pagination={false} />
    </div>
  ),
};

export const CustomCells: Story = {
  render: () => (
    <Table
      data={PEOPLE}
      columns={COLUMNS}
      pagination={false}
      // Columns stay serialisable — only this map is framework-specific.
      renderCell={{ name: person => <strong>{person.name}</strong> }}
    />
  ),
};
