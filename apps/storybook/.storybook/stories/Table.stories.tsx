import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TableColumn } from "@crosskit-ui/core";
import { Table } from "@crosskit-ui/react";

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: { layout: "padded" },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj;

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

export const Basics: Story = {
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
