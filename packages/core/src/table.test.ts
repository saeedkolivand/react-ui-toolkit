import { describe, expect, it, vi } from "vitest";
import {
  createTableStore,
  fromLegacyColumns,
  getPageWindow,
  PAGE_ELLIPSIS,
  toColumnDefs,
  type TableColumn,
} from "./table";

interface Person {
  name: string;
  age: number;
}

const columns: TableColumn<Person>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "age", header: "Age", accessor: "age" },
];

const people: Person[] = [
  { name: "Ada", age: 36 },
  { name: "Grace", age: 45 },
  { name: "Alan", age: 41 },
];

describe("toColumnDefs", () => {
  it("maps id, header and accessor", () => {
    const [first] = toColumnDefs(columns);
    expect(first).toMatchObject({ id: "name", header: "Name", accessorKey: "name" });
  });

  it("enables sorting only where asked", () => {
    const [name, age] = toColumnDefs(columns);
    expect(name).toMatchObject({ enableSorting: true });
    expect(age).toMatchObject({ enableSorting: false });
  });

  it("treats a custom sortFn as implying sortable", () => {
    const [only] = toColumnDefs<Person>([
      { id: "age", header: "Age", accessor: "age", sortFn: (a, b) => a.age - b.age },
    ]);
    expect(only).toMatchObject({ enableSorting: true });
    expect(only).toHaveProperty("sortingFn");
  });
});

describe("fromLegacyColumns", () => {
  it("translates every v0 key", () => {
    const sorter = (a: Person, b: Person) => a.age - b.age;
    expect(
      fromLegacyColumns<Person>([
        { key: "age", title: "Age", dataIndex: "age", sorter, width: 120 },
      ])
    ).toEqual([
      { id: "age", header: "Age", accessor: "age", sortable: true, sortFn: sorter, width: 120 },
    ]);
  });

  it("leaves a column without a sorter unsortable", () => {
    const [only] = fromLegacyColumns<Person>([{ key: "name", title: "Name", dataIndex: "name" }]);
    expect(only?.sortable).toBe(false);
  });

  it("round-trips into column defs", () => {
    const defs = toColumnDefs(
      fromLegacyColumns<Person>([{ key: "name", title: "Name", dataIndex: "name" }])
    );
    expect(defs[0]).toMatchObject({ id: "name", header: "Name", accessorKey: "name" });
  });
});

describe("getPageWindow", () => {
  it("returns nothing for no pages", () => {
    expect(getPageWindow(1, 0)).toEqual([]);
  });

  it("lists every page while they fit", () => {
    expect(getPageWindow(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("collapses the tail when current is near the start", () => {
    expect(getPageWindow(1, 20)).toEqual([1, 2, PAGE_ELLIPSIS, 20]);
  });

  it("collapses the head when current is near the end", () => {
    expect(getPageWindow(20, 20)).toEqual([1, PAGE_ELLIPSIS, 19, 20]);
  });

  it("collapses both sides in the middle", () => {
    expect(getPageWindow(10, 20)).toEqual([1, PAGE_ELLIPSIS, 9, 10, 11, PAGE_ELLIPSIS, 20]);
  });

  it("widens with more siblings", () => {
    expect(getPageWindow(10, 20, 2)).toEqual([
      1,
      PAGE_ELLIPSIS,
      8,
      9,
      10,
      11,
      12,
      PAGE_ELLIPSIS,
      20,
    ]);
  });

  it("clamps a current page outside the range", () => {
    expect(getPageWindow(99, 20)).toEqual(getPageWindow(20, 20));
    expect(getPageWindow(0, 20)).toEqual(getPageWindow(1, 20));
  });

  it("never renders more than a handful of buttons, unlike v0", () => {
    // v0 rendered one button per page: 50 of them for 500 rows at page size 10.
    expect(getPageWindow(25, 50).length).toBeLessThanOrEqual(9);
  });
});

describe("createTableStore", () => {
  it("exposes rows through the core row model", () => {
    const store = createTableStore({ data: people, columns });
    expect(store.getTable().getRowModel().rows).toHaveLength(3);
  });

  it("paginates by default", () => {
    const store = createTableStore({
      data: people,
      columns,
      defaultPagination: { pageIndex: 0, pageSize: 2 },
    });
    expect(store.getTable().getRowModel().rows).toHaveLength(2);
    expect(store.getTable().getPageCount()).toBe(2);
  });

  it("skips pagination when asked", () => {
    const store = createTableStore({
      data: people,
      columns,
      paginated: false,
      defaultPagination: { pageIndex: 0, pageSize: 2 },
    });
    expect(store.getTable().getRowModel().rows).toHaveLength(3);
  });

  it("notifies subscribers on a state change", () => {
    const store = createTableStore({ data: people, columns });
    const listener = vi.fn();
    store.subscribe(listener);
    store.getTable().setPageIndex(0);
    expect(listener).toHaveBeenCalled();
  });

  it("stops notifying after unsubscribe", () => {
    const store = createTableStore({ data: people, columns });
    const listener = vi.fn();
    store.subscribe(listener)();
    store.getTable().setPageIndex(0);
    expect(listener).not.toHaveBeenCalled();
  });

  it("sorts through the machine, not by mutating data", () => {
    const store = createTableStore({ data: people, columns });
    store.getTable().getColumn("name")?.toggleSorting(false);
    expect(
      store
        .getTable()
        .getRowModel()
        .rows.map(r => r.original.name)
    ).toEqual(["Ada", "Alan", "Grace"]);
    expect(people.map(p => p.name)).toEqual(["Ada", "Grace", "Alan"]);
  });

  it("reports sorting changes", () => {
    const onSortingChange = vi.fn();
    const store = createTableStore({ data: people, columns, onSortingChange });
    store.getTable().getColumn("name")?.toggleSorting(false);
    expect(onSortingChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
  });

  it("reports pagination changes", () => {
    const onPaginationChange = vi.fn();
    const store = createTableStore({
      data: people,
      columns,
      defaultPagination: { pageIndex: 0, pageSize: 2 },
      onPaginationChange,
    });
    store.getTable().nextPage();
    expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 2 });
  });

  it("lets a controlled sorting prop win over internal state", () => {
    const store = createTableStore({
      data: people,
      columns,
      sorting: [{ id: "name", desc: true }],
      onSortingChange: () => {},
    });
    expect(
      store
        .getTable()
        .getRowModel()
        .rows.map(r => r.original.name)
    ).toEqual(["Grace", "Alan", "Ada"]);
  });

  it("picks up new data through setOptions", () => {
    const store = createTableStore({ data: people, columns });
    store.setOptions({ data: [...people, { name: "Edsger", age: 72 }], columns });
    expect(store.getTable().getRowModel().rows).toHaveLength(4);
  });

  it("uses rowCount for server-side paging", () => {
    const store = createTableStore({
      data: people,
      columns,
      manualPagination: true,
      rowCount: 500,
      defaultPagination: { pageIndex: 0, pageSize: 10 },
    });
    expect(store.getTable().getPageCount()).toBe(50);
    // The consumer already paged the data, so every supplied row renders.
    expect(store.getTable().getRowModel().rows).toHaveLength(3);
  });
});

describe("createTableStore defaults through setOptions", () => {
  it("applies defaults supplied after construction, before any interaction", () => {
    // Angular and Svelte both construct the store with neutral options and
    // supply the real ones from their reactive scope a moment later.
    const store = createTableStore<Person>({ data: [], columns: [] });
    store.setOptions({
      data: people,
      columns,
      defaultPagination: { pageIndex: 0, pageSize: 2 },
      defaultSorting: [{ id: "name", desc: true }],
    });
    expect(store.getTable().getState().pagination.pageSize).toBe(2);
    expect(
      store
        .getTable()
        .getRowModel()
        .rows.map(r => r.original.name)
    ).toEqual(["Grace", "Alan"]);
  });

  it("stops re-applying defaults once the user has interacted", () => {
    const store = createTableStore({ data: people, columns });
    store.getTable().setPageSize(1);
    store.setOptions({ data: people, columns, defaultPagination: { pageIndex: 0, pageSize: 50 } });
    expect(store.getTable().getState().pagination.pageSize).toBe(1);
  });
});
