import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TableColumn } from "@crosskit-ui/core";
import { Table } from "./table";

interface Person {
  name: string;
  age: number;
}

const columns: TableColumn<Person>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "age", header: "Age", accessor: "age", align: "end" },
];

const people: Person[] = [
  { name: "Ada", age: 36 },
  { name: "Grace", age: 45 },
  { name: "Alan", age: 41 },
];

const many = Array.from({ length: 95 }, (_, i) => ({ name: `Person ${i + 1}`, age: 20 + i }));

const bodyRows = (c: HTMLElement) =>
  Array.from(c.querySelectorAll<HTMLElement>('[data-part="body"] [data-part="row"]'));
const cellText = (c: HTMLElement) =>
  bodyRows(c).map(row => row.querySelector('[data-part="cell"]')?.textContent);

describe("Table", () => {
  it("renders the root with scope and part", () => {
    const { container } = render(<Table data={people} columns={columns} />);
    expect(container.querySelector('[data-scope="table"][data-part="root"]')).toBeInTheDocument();
  });

  it("puts density on the root", () => {
    const { container } = render(<Table data={people} columns={columns} density="small" />);
    expect(container.querySelector('[data-part="root"]')).toHaveAttribute("data-density", "small");
  });

  it("omits boolean data attributes rather than writing false", () => {
    const { container } = render(<Table data={people} columns={columns} hoverable={false} />);
    const root = container.querySelector('[data-part="root"]');
    expect(root).not.toHaveAttribute("data-bordered");
    expect(root).not.toHaveAttribute("data-striped");
    expect(root).not.toHaveAttribute("data-hoverable");
  });

  it("sets boolean data attributes when true", () => {
    const { container } = render(<Table data={people} columns={columns} bordered striped />);
    const root = container.querySelector('[data-part="root"]');
    expect(root).toHaveAttribute("data-bordered", "");
    expect(root).toHaveAttribute("data-striped", "");
  });

  it("passes className to the root", () => {
    const { container } = render(<Table data={people} columns={columns} className="mine" />);
    expect(container.querySelector('[data-part="root"]')).toHaveClass("mine");
  });

  it("renders one header per column", () => {
    const { container } = render(<Table data={people} columns={columns} />);
    const headers = container.querySelectorAll('[data-part="header"]');
    expect(headers).toHaveLength(2);
    expect(headers[0]).toHaveTextContent("Name");
  });

  it("carries column alignment onto header and cells", () => {
    const { container } = render(<Table data={people} columns={columns} />);
    expect(container.querySelectorAll('[data-part="header"]')[1]).toHaveAttribute(
      "data-align",
      "end"
    );
    expect(container.querySelectorAll('[data-part="cell"]')[1]).toHaveAttribute(
      "data-align",
      "end"
    );
  });

  it("renders a row per record", () => {
    const { container } = render(<Table data={people} columns={columns} />);
    expect(bodyRows(container)).toHaveLength(3);
  });

  it("renders cell values from the accessor", () => {
    const { container } = render(<Table data={people} columns={columns} />);
    expect(cellText(container)).toEqual(["Ada", "Grace", "Alan"]);
  });

  it("uses a custom cell renderer when one is given for that column", () => {
    const { container } = render(
      <Table
        data={people}
        columns={columns}
        renderCell={{ name: row => <strong>{row.name.toUpperCase()}</strong> }}
      />
    );
    expect(cellText(container)).toEqual(["ADA", "GRACE", "ALAN"]);
    expect(container.querySelector("strong")).toBeInTheDocument();
  });

  // v0's sortable <th> had a bare onClick — no tabindex, no role, no Enter
  // handler — so it could not be operated from the keyboard at all.
  it("renders a real button for a sortable column", () => {
    render(<Table data={people} columns={columns} />);
    expect(screen.getByRole("button", { name: /Name/ })).toBeInTheDocument();
  });

  it("renders no sort button for an unsortable column", () => {
    render(<Table data={people} columns={columns} />);
    expect(screen.queryByRole("button", { name: /^Age/ })).not.toBeInTheDocument();
  });

  it("sorts on click", async () => {
    const user = userEvent.setup();
    const { container } = render(<Table data={people} columns={columns} />);
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(cellText(container)).toEqual(["Ada", "Alan", "Grace"]);
  });

  it("sorts from the keyboard", async () => {
    const user = userEvent.setup();
    const { container } = render(<Table data={people} columns={columns} />);
    screen.getByRole("button", { name: /Name/ }).focus();
    await user.keyboard("{Enter}");
    expect(cellText(container)).toEqual(["Ada", "Alan", "Grace"]);
  });

  it("reverses on a second click", async () => {
    const user = userEvent.setup();
    const { container } = render(<Table data={people} columns={columns} />);
    await user.click(screen.getByRole("button", { name: /Name/ }));
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(cellText(container)).toEqual(["Grace", "Alan", "Ada"]);
  });

  it("reports aria-sort on the header cell, not the button", async () => {
    const user = userEvent.setup();
    const { container } = render(<Table data={people} columns={columns} />);
    const header = container.querySelector('[data-part="header"]');
    expect(header).not.toHaveAttribute("aria-sort");
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(header).toHaveAttribute("aria-sort", "ascending");
  });

  it("reports sorting changes", async () => {
    const user = userEvent.setup();
    const onSortingChange = vi.fn();
    render(<Table data={people} columns={columns} onSortingChange={onSortingChange} />);
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(onSortingChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
  });

  it("honours controlled sorting", () => {
    const { container } = render(
      <Table
        data={people}
        columns={columns}
        sorting={[{ id: "name", desc: true }]}
        onSortingChange={() => {}}
      />
    );
    expect(cellText(container)).toEqual(["Grace", "Alan", "Ada"]);
  });

  it("does not mutate the data it was given", async () => {
    const user = userEvent.setup();
    const data = [...people];
    render(<Table data={data} columns={columns} />);
    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(data.map(p => p.name)).toEqual(["Ada", "Grace", "Alan"]);
  });

  it("shows an empty message when there is nothing to render", () => {
    const { container } = render(<Table data={[]} columns={columns} />);
    expect(container.querySelector('[data-part="empty"]')).toHaveTextContent("No data");
  });

  it("accepts a custom empty message", () => {
    const { container } = render(
      <Table data={[]} columns={columns} emptyMessage="Nothing here yet" />
    );
    expect(container.querySelector('[data-part="empty"]')).toHaveTextContent("Nothing here yet");
  });

  // An overlay rather than a replacement, so rows and scroll position survive.
  it("overlays a spinner while loading without dropping the rows", () => {
    const { container } = render(<Table data={people} columns={columns} loading />);
    expect(container.querySelector('[data-part="loading-overlay"]')).toBeInTheDocument();
    expect(bodyRows(container)).toHaveLength(3);
  });

  it("hides the empty message while loading", () => {
    const { container } = render(<Table data={[]} columns={columns} loading />);
    expect(container.querySelector('[data-part="empty"]')).not.toBeInTheDocument();
  });

  it("paginates to the given page size", () => {
    const { container } = render(<Table data={many} columns={columns} pageSize={10} />);
    expect(bodyRows(container)).toHaveLength(10);
  });

  it("renders every row when pagination is off", () => {
    const { container } = render(<Table data={people} columns={columns} pagination={false} />);
    expect(container.querySelector('[data-part="pagination"]')).not.toBeInTheDocument();
    expect(bodyRows(container)).toHaveLength(3);
  });

  // v0 rendered one button per page: 10 for 95 rows, 50 for 500.
  it("windows the page buttons instead of rendering one per page", () => {
    const { container } = render(<Table data={many} columns={columns} pageSize={10} />);
    const numbered = Array.from(
      container.querySelectorAll('[data-part="page-trigger"][aria-label^="Page"]')
    );
    expect(numbered.length).toBeLessThan(10);
    expect(container.querySelector('[data-part="page-ellipsis"]')).toBeInTheDocument();
  });

  it("marks the current page for assistive tech", () => {
    const { container } = render(<Table data={many} columns={columns} pageSize={10} />);
    expect(container.querySelector('[aria-current="page"]')).toHaveTextContent("1");
  });

  it("moves to the next page", async () => {
    const user = userEvent.setup();
    const { container } = render(<Table data={many} columns={columns} pageSize={10} />);
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(cellText(container)[0]).toBe("Person 11");
  });

  it("jumps to a numbered page", async () => {
    const user = userEvent.setup();
    const { container } = render(<Table data={many} columns={columns} pageSize={10} />);
    await user.click(screen.getByRole("button", { name: "Page 10" }));
    expect(cellText(container)[0]).toBe("Person 91");
  });

  it("disables previous on the first page and next on the last", async () => {
    const user = userEvent.setup();
    render(<Table data={many} columns={columns} pageSize={10} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Page 10" }));
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("summarises the visible range", () => {
    const { container } = render(<Table data={many} columns={columns} pageSize={10} />);
    expect(container.querySelector('[data-part="summary"]')).toHaveTextContent("1–10 of 95");
  });

  it("clamps the summary on a short final page", async () => {
    const user = userEvent.setup();
    const { container } = render(<Table data={many} columns={columns} pageSize={10} />);
    await user.click(screen.getByRole("button", { name: "Page 10" }));
    expect(container.querySelector('[data-part="summary"]')).toHaveTextContent("91–95 of 95");
  });

  it("reports pagination changes", async () => {
    const user = userEvent.setup();
    const onPaginationChange = vi.fn();
    render(
      <Table data={many} columns={columns} pageSize={10} onPaginationChange={onPaginationChange} />
    );
    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 });
  });

  it("counts server-side pages from rowCount", () => {
    const { container } = render(
      <Table data={people} columns={columns} manualPagination rowCount={500} pageSize={10} />
    );
    expect(container.querySelector('[data-part="summary"]')).toHaveTextContent("1–10 of 500");
    expect(bodyRows(container)).toHaveLength(3);
  });

  // Bug 0.3: v0 passed <Option> children to a Select that never rendered them,
  // so showSizeChanger produced a permanently empty dropdown.
  it("renders a page-size changer whose options actually exist", () => {
    const { container } = render(
      <Table data={many} columns={columns} pageSize={10} showSizeChanger />
    );
    expect(container.querySelector('[data-part="page-size"]')).toBeInTheDocument();
    expect(document.querySelectorAll('[data-scope="select"][data-part="item"]')).toHaveLength(4);
  });

  it("hides the page-size changer by default", () => {
    const { container } = render(<Table data={many} columns={columns} pageSize={10} />);
    expect(container.querySelector('[data-part="page-size"]')).not.toBeInTheDocument();
  });

  it("changes the page size through the changer", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Table data={many} columns={columns} pageSize={10} showSizeChanger />
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /20 \/ page/ }));
    expect(bodyRows(container)).toHaveLength(20);
  });

  it("picks up new data without remounting", () => {
    const { container, rerender } = render(<Table data={people} columns={columns} />);
    rerender(<Table data={[...people, { name: "Edsger", age: 72 }]} columns={columns} />);
    expect(bodyRows(container)).toHaveLength(4);
  });
});
