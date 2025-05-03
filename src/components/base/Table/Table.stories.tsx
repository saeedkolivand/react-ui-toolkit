import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Table, ColumnType, SortOrder } from './Table';
import { Tag } from '../Tag/Tag';

interface User {
  id: number;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnType<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: (a, b) => a.age - b.age,
    defaultSortOrder: 'descend' as SortOrder,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    sorter: (a, b) => a.address.localeCompare(b.address),
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: string[]) => (
      <span className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <Tag key={tag} color="primary" variant="outline">
            {tag}
          </Tag>
        ))}
      </span>
    ),
  },
];

const data: User[] = [
  {
    id: 1,
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    id: 2,
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    id: 3,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
  {
    id: 4,
    name: 'Alice White',
    age: 28,
    address: 'Paris No. 1 Lake Park',
    tags: ['nice', 'designer'],
  },
  {
    id: 5,
    name: 'Bob Red',
    age: 35,
    address: 'Tokyo No. 1 Lake Park',
    tags: ['cool', 'developer'],
  },
  {
    id: 6,
    name: 'Charlie Blue',
    age: 29,
    address: 'Berlin No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    id: 7,
    name: 'David Yellow',
    age: 31,
    address: 'Rome No. 1 Lake Park',
    tags: ['cool', 'designer'],
  },
  {
    id: 8,
    name: 'Eve Purple',
    age: 27,
    address: 'Madrid No. 1 Lake Park',
    tags: ['nice', 'teacher'],
  },
];

const meta: Meta<typeof Table> = {
  title: 'Base/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: 'The size of the table',
    },
    bordered: {
      control: 'boolean',
      description: 'Whether to show all table borders',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state of table',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    dataSource: data,
    columns,
    rowKey: 'id',
  },
};

export const Bordered: Story = {
  args: {
    dataSource: data,
    columns,
    rowKey: 'id',
    bordered: true,
  },
};

export const Small: Story = {
  args: {
    dataSource: data,
    columns,
    rowKey: 'id',
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    dataSource: data,
    columns,
    rowKey: 'id',
    size: 'large',
  },
};

export const Loading: Story = {
  args: {
    dataSource: data,
    columns,
    rowKey: 'id',
    loading: true,
  },
};

export const WithPagination: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(3);

    return (
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{
          current,
          pageSize,
          total: data.length,
          onChange: (page) => setCurrent(page),
          showSizeChanger: true,
          pageSizeOptions: [3, 5, 10],
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrent(1);
          },
        }}
      />
    );
  },
};

export const WithSortingAndPagination: Story = {
  render: () => {
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(3);

    return (
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        pagination={{
          current,
          pageSize,
          total: data.length,
          onChange: (page) => setCurrent(page),
          showSizeChanger: true,
          pageSizeOptions: [3, 5, 10],
          onPageSizeChange: (size) => {
            setPageSize(size);
            setCurrent(1);
          },
        }}
        onChange={(params) => {
          console.log('Sort changed:', params.sorter);
          console.log('Pagination changed:', params.pagination);
        }}
      />
    );
  },
};

export const Scrollable: Story = {
  args: {
    dataSource: data,
    columns,
    rowKey: 'id',
    scroll: { x: 800 },
  },
}; 