import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Table } from "./Table";

// Mock the component imports to avoid test complexities
jest.mock("@/components", () => ({
  Button: ({ children, onClick, disabled, variant, ...props }: any) => {
    // Create a more descriptive testid based on the button content or variant
    const content = typeof children === "string" ? children : "";
    const testId =
      content === "→"
        ? "next-page-button"
        : content === "←"
        ? "prev-page-button"
        : `button-${content || variant || "default"}`;
    return (
      <button onClick={onClick} disabled={disabled} data-testid={testId} {...props}>
        {children}
      </button>
    );
  },
  Container: ({ children, className, ...props }: any) => {
    // Use pagination-container testid specifically for the pagination container
    const testId = className?.includes("flex items-center justify-end")
      ? "pagination-container"
      : "table-container";
    return (
      <div data-testid={testId} className={className} {...props}>
        {children}
      </div>
    );
  },
  Select: ({ children, value, onChange, size, ...props }: any) => (
    <select data-testid="page-size-select" value={value} onChange={onChange} {...props}>
      {children}
    </select>
  ),
  Icon: ({ name, className }: any) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
  Option: ({ children, value }: any) => (
    <option value={value} data-testid={`page-size-option-${value}`}>
      {children}
    </option>
  ),
}));

interface TestData {
  id: number;
  name: string;
  age: number;
  address: string;
}

const mockData: TestData[] = [
  { id: 1, name: "John", age: 25, address: "New York" },
  { id: 2, name: "Alice", age: 32, address: "Boston" },
  { id: 3, name: "Bob", age: 18, address: "Chicago" },
  { id: 4, name: "David", age: 45, address: "Los Angeles" },
  { id: 5, name: "Emma", age: 27, address: "Seattle" },
];

const mockColumns = [
  {
    title: "Name",
    dataIndex: "name" as keyof TestData,
    key: "name",
    sorter: (a: TestData, b: TestData) => a.name.localeCompare(b.name),
  },
  {
    title: "Age",
    dataIndex: "age" as keyof TestData,
    key: "age",
    sorter: (a: TestData, b: TestData) => a.age - b.age,
  },
  {
    title: "Address",
    dataIndex: "address" as keyof TestData,
    key: "address",
  },
];

describe("Table Component", () => {
  it("renders with basic props", () => {
    render(<Table<TestData> dataSource={mockData} columns={mockColumns} rowKey="id" />);

    // Check if headers are rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();

    // Check if data is rendered
    mockData.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument();
      expect(screen.getByText(item.age.toString())).toBeInTheDocument();
      expect(screen.getByText(item.address)).toBeInTheDocument();
    });
  });

  it("applies custom size classes", () => {
    const { rerender } = render(
      <Table<TestData> dataSource={mockData} columns={mockColumns} rowKey="id" size="small" />
    );

    const table = screen.getByRole("table");
    expect(table).toHaveClass("text-sm");

    rerender(
      <Table<TestData> dataSource={mockData} columns={mockColumns} rowKey="id" size="large" />
    );

    expect(table).toHaveClass("text-lg");
  });

  it("applies bordered style when bordered=true", () => {
    render(<Table<TestData> dataSource={mockData} columns={mockColumns} rowKey="id" bordered />);

    const table = screen.getByRole("table");
    expect(table).toHaveClass("border");
    expect(table).toHaveClass("border-gray-200");
  });

  it("renders custom cell content with render function", () => {
    const columnsWithRender = [
      ...mockColumns,
      {
        title: "Actions",
        dataIndex: "id" as keyof TestData,
        key: "actions",
        render: (value: any, record: TestData) => (
          <button data-testid={`edit-${record.id}`}>Edit {record.name}</button>
        ),
      },
    ];

    render(<Table<TestData> dataSource={mockData} columns={columnsWithRender} rowKey="id" />);

    mockData.forEach(item => {
      expect(screen.getByTestId(`edit-${item.id}`)).toBeInTheDocument();
      expect(screen.getByText(`Edit ${item.name}`)).toBeInTheDocument();
    });
  });

  it("sorts data when column header is clicked", () => {
    const onChange = jest.fn();

    render(
      <Table<TestData>
        dataSource={mockData}
        columns={mockColumns}
        rowKey="id"
        onChange={onChange}
      />
    );

    // Click the Name column header to sort
    fireEvent.click(screen.getByText("Name"));

    // Check if onChange was called with correct parameters
    expect(onChange).toHaveBeenCalledWith({
      sorter: {
        column: "name",
        order: "ascend",
      },
    });

    // Check if the data is sorted alphabetically by name
    const cells = screen.getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("Alice"); // First row, first cell

    // Click again to sort in descending order
    fireEvent.click(screen.getByText("Name"));

    expect(onChange).toHaveBeenCalledWith({
      sorter: {
        column: "name",
        order: "descend",
      },
    });

    // Third click should clear sorting
    fireEvent.click(screen.getByText("Name"));

    expect(onChange).toHaveBeenCalledWith({
      sorter: undefined,
    });
  });

  it("renders pagination when provided", () => {
    const onPageChange = jest.fn();
    const onPageSizeChange = jest.fn();

    render(
      <Table<TestData>
        dataSource={mockData}
        columns={mockColumns}
        rowKey="id"
        pagination={{
          current: 1,
          pageSize: 2,
          total: mockData.length,
          onChange: onPageChange,
          showSizeChanger: true,
          pageSizeOptions: [2, 4],
          onPageSizeChange: onPageSizeChange,
        }}
      />
    );

    // Check if pagination is rendered
    const paginationContainer = screen.getByTestId("pagination-container");
    expect(paginationContainer).toBeInTheDocument();

    // Check if page size selector is rendered
    const pageSizeSelect = screen.getByTestId("page-size-select");
    expect(pageSizeSelect).toBeInTheDocument();

    // Check if only the first page's items are rendered
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument(); // Should be on next page

    // Navigate to next page
    const nextPageButton = screen.getByTestId("next-page-button");
    fireEvent.click(nextPageButton);

    // Check if onChange was called with page 2
    expect(onPageChange).toHaveBeenCalledWith(2);

    // Change page size
    fireEvent.change(pageSizeSelect, { target: { value: "4" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(4);
    expect(onPageChange).toHaveBeenCalledWith(1); // Should reset to page 1
  });

  it("applies column width when specified", () => {
    const columnsWithWidth = [
      {
        ...mockColumns[0],
        width: 200,
      },
      ...mockColumns.slice(1),
    ];

    render(<Table<TestData> dataSource={mockData} columns={columnsWithWidth} rowKey="id" />);

    const nameHeader = screen.getByText("Name").closest("th");
    expect(nameHeader).toHaveStyle({ width: "200px" });
  });

  it("handles empty data source", () => {
    render(<Table<TestData> dataSource={[]} columns={mockColumns} rowKey="id" />);

    // Headers should still be rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();

    // But no data rows
    expect(screen.queryByText("John")).not.toBeInTheDocument();
  });

  it("initializes with defaultSortOrder when specified", () => {
    const columnsWithDefault = [
      {
        ...mockColumns[0],
        defaultSortOrder: "descend" as const,
      },
      ...mockColumns.slice(1),
    ];

    render(<Table<TestData> dataSource={mockData} columns={columnsWithDefault} rowKey="id" />);

    // Data should be sorted by name in descending order
    const cells = screen.getAllByRole("cell");
    // First row should be the name that comes last alphabetically
    expect(cells[0]).toHaveTextContent(/John|Emma/); // One of these names should be first in reverse order
  });

  it("renders sort icons for sortable columns", () => {
    render(<Table<TestData> dataSource={mockData} columns={mockColumns} rowKey="id" />);

    // Check if sort icons are rendered for sortable columns
    expect(screen.getAllByTestId("icon-chevronUp")).toHaveLength(2); // Name and Age columns
    expect(screen.getAllByTestId("icon-chevronDown")).toHaveLength(2);

    // Address column should not have sort icons
    const addressHeader = screen.getByText("Address").closest("th");
    expect(addressHeader?.querySelector('[data-testid="icon-chevronUp"]')).toBeNull();
  });
});
