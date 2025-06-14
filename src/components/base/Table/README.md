# Table Component

A flexible and powerful data table component with support for sorting, pagination, and customizable columns.

## Features

- Column-based data display with customizable rendering
- Sortable columns with visual indicators
- Built-in pagination with customizable page sizes
- Support for different table sizes and styles
- Loading state support
- Responsive design with horizontal scrolling
- Row hover effects

## Basic Usage

```jsx
import { Table } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  // Define your columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  // Your data
  const dataSource = [
    { id: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
    { id: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
    { id: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  ];

  return (
    <Table 
      dataSource={dataSource} 
      columns={columns} 
      rowKey="id" 
    />
  );
}
```

## API Reference

### Table Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| dataSource | `T[]` | - | Data record array to be displayed (required) |
| columns | `ColumnType<T>[]` | - | Columns of the table (required) |
| rowKey | `keyof T` | - | Row key, must be unique for each record (required) |
| size | `'small' \| 'middle' \| 'large'` | `'middle'` | Size of the table |
| bordered | `boolean` | `false` | Whether to show all table borders |
| loading | `boolean` | `false` | Loading state of the table |
| pagination | `TablePagination \| false` | - | Config of pagination or `false` to disable |
| scroll | `{ x?: number \| string, y?: number \| string }` | - | Config of table's scrollable area |
| onChange | `(params: { sorter?, pagination? }) => void` | - | Callback when pagination or sorting changed |

### ColumnType

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | `React.ReactNode` | - | Title of the column |
| dataIndex | `keyof T` | - | Display field of the data record |
| key | `string` | - | Unique key of the column |
| render | `(text: any, record: T) => React.ReactNode` | - | Renderer of the table cell |
| sorter | `(a: T, b: T) => number` | - | Sort function for the column data |
| width | `number \| string` | - | Width of the column |
| defaultSortOrder | `'ascend' \| 'descend' \| null` | - | Default sort order |

### TablePagination

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| current | `number` | - | Current page number |
| pageSize | `number` | - | Number of items per page |
| total | `number` | - | Total number of items |
| onChange | `(page: number) => void` | - | Callback when page changes |
| showSizeChanger | `boolean` | - | Whether to show page size selector |
| pageSizeOptions | `number[]` | `[10, 20, 30, 40, 50]` | Available page size options |
| onPageSizeChange | `(size: number) => void` | - | Callback when page size changes |

## Examples

### With Custom Rendering

```jsx
import { Table, Badge, Button } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge 
          status={status === 'active' ? 'success' : 'error'} 
          text={status} 
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleView(record.id)}
        >
          View
        </Button>
      ),
    },
  ];

  // Rest of the component...
}
```

### With Pagination

```jsx
import { Table } from '@saeedkolivand/react-ui-toolkit';
import { useState } from 'react';

function MyComponent() {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: dataSource.length,
  });

  const handlePaginationChange = (page) => {
    setPagination({
      ...pagination,
      current: page,
    });
  };

  const handlePageSizeChange = (size) => {
    setPagination({
      ...pagination,
      pageSize: size,
      current: 1, // Reset to first page
    });
  };

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      pagination={{
        ...pagination,
        onChange: handlePaginationChange,
        showSizeChanger: true,
        onPageSizeChange: handlePageSizeChange,
      }}
    />
  );
}
```

### With Sorting

```jsx
import { Table } from '@saeedkolivand/react-ui-toolkit';

function MyComponent() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend', // Default sort
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
    },
    // More columns...
  ];

  const handleTableChange = (params) => {
    console.log('Sort or pagination changed:', params);
    // You can use this to fetch sorted data from the server
  };

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      onChange={handleTableChange}
    />
  );
}
```
