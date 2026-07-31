import { describe, expect, it, vi } from "vitest";
import { createTableStore, type TableColumnDef } from "./store";
import { compareValues, directedCompare } from "./compare";

interface Person {
  name: string;
  age: number;
  city: string;
}

const people: Person[] = [
  { name: "Ada", age: 36, city: "London" },
  { name: "Grace", age: 45, city: "New York" },
  { name: "Alan", age: 41, city: "London" },
  { name: "Barbara", age: 29, city: "Boston" },
  { name: "Katherine", age: 52, city: "Hampton" },
];

const columns: TableColumnDef<Person>[] = [
  { id: "name", accessor: row => row.name, sortable: true, filterable: true },
  { id: "age", accessor: row => row.age, sortable: true },
  { id: "city", accessor: row => row.city, filterable: true },
];

const store = (overrides = {}) =>
  createTableStore<Person>({
    data: people,
    columns,
    getRowId: row => row.name,
    initialState: { pageSize: 10 },
    ...overrides,
  });

const names = (rows: Array<{ original: Person }>) => rows.map(row => row.original.name);

describe("compare", () => {
  it("orders numbers numerically, not lexically", () => {
    expect(compareValues(2, 10)).toBeLessThan(0);
  });

  it("orders strings by locale, so accents land where a reader expects", () => {
    // A plain `<` puts "ä" after "z".
    expect(compareValues("ä", "b")).toBeLessThan(0);
  });

  it("orders embedded numbers naturally", () => {
    expect(compareValues("item 2", "item 10")).toBeLessThan(0);
  });

  it("orders dates and booleans", () => {
    expect(compareValues(new Date(2020, 0, 1), new Date(2021, 0, 1))).toBeLessThan(0);
    expect(compareValues(false, true)).toBeLessThan(0);
  });

  it("puts blanks last in both directions", () => {
    // Reversing them with everything else makes a mostly-empty column
    // unreadable descending — the direction you sort it to find the filled ones.
    for (const blank of [null, undefined, ""]) {
      expect(directedCompare(blank, "a", false)).toBeGreaterThan(0);
      expect(directedCompare(blank, "a", true)).toBeGreaterThan(0);
    }
  });

  it("treats two blanks as equal", () => {
    expect(directedCompare(null, undefined, false)).toBe(0);
  });
});

describe("table store", () => {
  it("returns every row when unfiltered", () => {
    expect(store().getRows()).toHaveLength(5);
  });

  describe("sorting", () => {
    it("cycles ascending, descending, then off", () => {
      const table = store();
      table.toggleSort("name");
      expect(names(table.getRows())).toEqual(["Ada", "Alan", "Barbara", "Grace", "Katherine"]);

      table.toggleSort("name");
      expect(names(table.getRows())).toEqual(["Katherine", "Grace", "Barbara", "Alan", "Ada"]);

      // The third state is what makes the data's natural order reachable again.
      table.toggleSort("name");
      expect(names(table.getRows())).toEqual(names(store().getRows()));
      expect(table.getSortDirection("name")).toBeUndefined();
    });

    it("replaces the sort unless asked for multi", () => {
      const table = store();
      table.toggleSort("name");
      table.toggleSort("age");
      expect(table.getState().sorting).toEqual([{ id: "age", direction: "asc" }]);
    });

    it("keeps earlier columns as tie-breakers under multi-sort", () => {
      const tied: Person[] = [
        { name: "B", age: 30, city: "X" },
        { name: "A", age: 30, city: "X" },
        { name: "C", age: 20, city: "X" },
      ];
      const table = createTableStore<Person>({ data: tied, columns, getRowId: r => r.name });
      table.toggleSort("age");
      table.toggleSort("name", { multi: true });
      expect(names(table.getRows())).toEqual(["C", "A", "B"]);
    });

    it("is stable, so equal rows keep their original order", () => {
      // Which is what makes a second sort column meaningful at all.
      const tied: Person[] = [
        { name: "B", age: 30, city: "X" },
        { name: "A", age: 30, city: "X" },
      ];
      const table = createTableStore<Person>({ data: tied, columns, getRowId: r => r.name });
      table.toggleSort("age");
      expect(names(table.getRows())).toEqual(["B", "A"]);
    });

    it("uses a column's own comparator, and honours direction with it", () => {
      const byLength: TableColumnDef<Person>[] = [
        { id: "name", accessor: r => r.name, sortFn: (a, b) => a.name.length - b.name.length },
      ];
      const table = createTableStore<Person>({
        data: people,
        columns: byLength,
        getRowId: r => r.name,
      });
      table.toggleSort("name");
      expect(names(table.getRows())[0]).toBe("Ada");
      table.toggleSort("name");
      expect(names(table.getRows())[0]).toBe("Katherine");
    });

    it("does not mutate the source data", () => {
      const original = [...people];
      const table = store();
      table.toggleSort("age");
      table.getRows();
      expect(people).toEqual(original);
    });

    it("returns to the first page", () => {
      // Staying on page 9 of a re-sorted table shows different rows for no
      // reason the reader can see.
      const table = store({ initialState: { pageSize: 2, pageIndex: 2 } });
      table.toggleSort("name");
      expect(table.getState().pageIndex).toBe(0);
    });
  });

  describe("filtering", () => {
    it("matches a column filter case-insensitively", () => {
      const table = store();
      table.setFilter("city", "london");
      expect(names(table.getRows())).toEqual(["Ada", "Alan"]);
    });

    it("combines filters across columns", () => {
      const table = store();
      table.setFilter("city", "London");
      table.setFilter("name", "ada");
      expect(names(table.getRows())).toEqual(["Ada"]);
    });

    it("ignores a cleared filter", () => {
      const table = store();
      table.setFilter("city", "London");
      table.setFilter("city", "");
      expect(table.getRows()).toHaveLength(5);
    });

    it("searches every column globally, not only filterable ones", () => {
      // One search box means "find this anywhere".
      const table = store();
      table.setGlobalFilter("45");
      expect(names(table.getRows())).toEqual(["Grace"]);
    });

    it("uses a column's own filter function", () => {
      const table = createTableStore<Person>({
        data: people,
        columns: [{ id: "age", accessor: r => r.age, filterFn: (row, q) => row.age > Number(q) }],
        getRowId: r => r.name,
      });
      table.setFilter("age", 40);
      expect(names(table.getRows()).sort()).toEqual(["Alan", "Grace", "Katherine"]);
    });

    it("filters before sorting and paging", () => {
      // Paginating first would sort one page and leave the table looking
      // sorted while it is not.
      const table = store({ initialState: { pageSize: 2 } });
      table.setFilter("city", "London");
      table.toggleSort("age");
      expect(names(table.getRows())).toEqual(["Ada", "Alan"]);
      expect(table.getPageCount()).toBe(1);
    });

    it("returns to the first page", () => {
      const table = store({ initialState: { pageSize: 2, pageIndex: 2 } });
      table.setFilter("city", "London");
      expect(table.getState().pageIndex).toBe(0);
    });
  });

  describe("pagination", () => {
    it("slices the current page", () => {
      const table = store({ initialState: { pageSize: 2 } });
      expect(table.getRows()).toHaveLength(2);
      table.setPage(1);
      expect(names(table.getRows())).toEqual(["Alan", "Barbara"]);
    });

    it("reports a page count of at least one, even when empty", () => {
      // Zero would make "page 1 of 0" and break every pagination control.
      const table = createTableStore<Person>({ data: [], columns });
      expect(table.getPageCount()).toBe(1);
      expect(table.getRows()).toEqual([]);
    });

    it("clamps a page beyond the end", () => {
      const table = store({ initialState: { pageSize: 2 } });
      table.setPage(99);
      expect(table.getState().pageIndex).toBe(2);
      table.setPage(-5);
      expect(table.getState().pageIndex).toBe(0);
    });

    it("keeps the first visible row visible when the page size changes", () => {
      // Otherwise changing page size deep in a table jumps somewhere unrelated.
      const table = store({ initialState: { pageSize: 2, pageIndex: 2 } });
      table.setPageSize(1);
      expect(table.getState().pageIndex).toBe(4);
    });

    it("clamps the page when data shrinks underneath it", () => {
      // Deleting rows while on the last page otherwise shows nothing, with no
      // way back except paging.
      const table = store({ initialState: { pageSize: 2, pageIndex: 2 } });
      table.setData(people.slice(0, 2));
      expect(table.getState().pageIndex).toBe(0);
      expect(table.getRows()).toHaveLength(2);
    });

    it("clamps against the new data even when rows were already rendered", () => {
      // The version above passed by accident: with a cold cache the clamp
      // recomputed and happened to be right. Every adapter renders before it
      // replaces data, so this is the real path -- and the clamp measured the
      // *old* row count, left pageIndex alone, and produced an empty table.
      const table = store({ initialState: { pageSize: 2, pageIndex: 2 } });
      table.getRows();
      table.setData(people.slice(0, 2));
      expect(table.getState().pageIndex).toBe(0);
      expect(table.getRows()).toHaveLength(2);
    });

    it("reports the new row count immediately after setData", () => {
      const table = store();
      table.getRows();
      table.setData(people.slice(0, 2));
      expect(table.getRowCount()).toBe(2);
    });
  });

  describe("selection", () => {
    it("toggles a row on and off", () => {
      const table = store();
      table.toggleSelection("Ada");
      expect(table.getSelectedRows().map(r => r.name)).toEqual(["Ada"]);
      table.toggleSelection("Ada");
      expect(table.getSelectedRows()).toEqual([]);
    });

    it("survives filtering and re-sorting, being keyed by row id", () => {
      const table = store();
      table.toggleSelection("Ada");
      table.setFilter("city", "Boston");
      table.toggleSort("age");
      table.setFilter("city", "");
      expect(table.getSelectedRows().map(r => r.name)).toEqual(["Ada"]);
    });

    it("reports none, some and all", () => {
      const table = store();
      expect(table.getSelectionState()).toBe("none");
      table.toggleSelection("Ada");
      expect(table.getSelectionState()).toBe("some");
      table.toggleAllSelection();
      expect(table.getSelectionState()).toBe("all");
    });

    it("selects only what survived filtering", () => {
      const table = store();
      table.setFilter("city", "London");
      table.toggleAllSelection();
      expect(
        table
          .getSelectedRows()
          .map(r => r.name)
          .sort()
      ).toEqual(["Ada", "Alan"]);
    });

    it("clearing all leaves a selection made under another filter alone", () => {
      const table = store();
      table.toggleSelection("Katherine");
      table.setFilter("city", "London");
      table.toggleAllSelection(); // selects Ada + Alan
      table.toggleAllSelection(); // clears only those two
      expect(table.getSelectedRows().map(r => r.name)).toEqual(["Katherine"]);
    });

    it("reports none for an empty table rather than all", () => {
      // `every` on an empty array is true, which would render the header
      // checkbox ticked over no rows.
      const table = createTableStore<Person>({ data: [], columns });
      expect(table.getSelectionState()).toBe("none");
    });

    it("keeps duplicate rows independently selectable", () => {
      // Ids are assigned against the original data before anything is filtered
      // or sorted. Deriving them later from `indexOf` would give two identical
      // rows the same id and silently tie their selection together — as well as
      // being O(n²) across the table.
      const duplicated: Person[] = [
        { name: "Ada", age: 36, city: "London" },
        { name: "Ada", age: 36, city: "London" },
      ];
      const table = createTableStore<Person>({
        data: duplicated,
        columns,
        getRowId: (_row, index) => `row-${index}`,
      });

      table.toggleSelection("row-1");
      expect(table.getSelectionState()).toBe("some");
      expect(table.getRows().map(r => r.selected)).toEqual([false, true]);
    });

    it("marks rows as selected", () => {
      const table = store();
      table.toggleSelection("Ada");
      expect(table.getRows().find(r => r.id === "Ada")?.selected).toBe(true);
    });
  });

  describe("opting in", () => {
    it("refuses to sort a column that did not opt in", () => {
      // Enforced in the store so four adapters do not each decide separately
      // whether to guard the header click.
      const table = store();
      table.toggleSort("city");
      expect(table.getSortDirection("city")).toBeUndefined();
      expect(names(table.getRows())).toEqual(names(store().getRows()));
    });

    it("refuses to filter a column that did not opt in", () => {
      const table = store();
      table.setFilter("age", 36);
      expect(table.getRows()).toHaveLength(5);
    });

    it("treats a comparator or matcher as the opt-in", () => {
      // There is no reason to write one for a column that cannot use it.
      const table = createTableStore<Person>({
        data: people,
        getRowId: r => r.name,
        columns: [
          { id: "name", accessor: r => r.name, sortFn: (a, b) => a.name.length - b.name.length },
          { id: "age", accessor: r => r.age, filterFn: (row, q) => row.age > Number(q) },
        ],
      });
      table.toggleSort("name");
      expect(table.getSortDirection("name")).toBe("asc");
      table.setFilter("age", 40);
      expect(table.getRows()).toHaveLength(3);
    });

    it("ignores an unknown column id", () => {
      const table = store();
      expect(() => table.toggleSort("nope")).not.toThrow();
      expect(table.getState().sorting).toEqual([]);
    });
  });

  describe("columns and expansion", () => {
    it("hides a column without removing it from the data", () => {
      const table = store();
      table.setState({ hiddenColumns: ["age"] });
      expect(table.getVisibleColumns().map(c => c.id)).toEqual(["name", "city"]);
      table.toggleSort("age");
      expect(names(table.getRows())[0]).toBe("Barbara");
    });

    it("toggles expansion", () => {
      const table = store();
      table.toggleExpanded("Ada");
      expect(table.getRows().find(r => r.id === "Ada")?.expanded).toBe(true);
      table.toggleExpanded("Ada");
      expect(table.getRows().find(r => r.id === "Ada")?.expanded).toBe(false);
    });
  });

  describe("subscription", () => {
    it("notifies on every state change and stops on unsubscribe", () => {
      const table = store();
      const listener = vi.fn();
      const unsubscribe = table.subscribe(listener);

      table.toggleSort("name");
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      table.toggleSort("age");
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("reports the new state to onStateChange", () => {
      const onStateChange = vi.fn();
      const table = store({ onStateChange });
      table.setPageSize(2);
      expect(onStateChange).toHaveBeenCalledWith(expect.objectContaining({ pageSize: 2 }));
    });
  });

  describe("manual mode", () => {
    it("leaves server-processed data alone", () => {
      const table = createTableStore<Person>({
        data: people.slice(0, 2),
        columns,
        manual: true,
        rowCount: 57,
        getRowId: r => r.name,
        initialState: { pageSize: 10 },
      });
      table.setFilter("city", "nowhere");
      // The server already filtered; filtering again would empty the page.
      expect(table.getRows()).toHaveLength(2);
      expect(table.getRowCount()).toBe(57);
      expect(table.getPageCount()).toBe(6);
    });
  });
});
