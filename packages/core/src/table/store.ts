/**
 * The table store: filter, sort, paginate, select, expand — over plain data.
 *
 * No framework and no DOM. It holds state, derives rows, and notifies; every
 * adapter subscribes and renders. That is what lets one implementation of
 * multi-column sorting serve four frameworks instead of four that differ in
 * ways nobody notices until a bug report.
 *
 * The pipeline order is fixed and load-bearing: **filter → sort → paginate**.
 * Sorting before filtering wastes work on rows about to be dropped; paginating
 * before sorting sorts one page and leaves the table looking sorted while it is
 * not, which is the version of this bug that ships.
 */

import { directedCompare } from "./compare";

export type SortDirection = "asc" | "desc";

export interface SortRule {
  id: string;
  direction: SortDirection;
}

export interface TableColumnDef<T> {
  id: string;
  /** Reads the cell value. Given the whole row so a column can be computed. */
  accessor: (row: T) => unknown;
  /** Opt in to sorting. Implied by `sortFn`. */
  sortable?: boolean;
  /** Overrides the default comparator for this column, and implies `sortable`. */
  sortFn?: (a: T, b: T) => number;
  /** Opt in to filtering. Implied by `filterFn`. */
  filterable?: boolean;
  /** Overrides the default "includes, case-insensitive" match, and implies `filterable`. */
  filterFn?: (row: T, query: unknown) => boolean;
}

export interface TableState {
  sorting: SortRule[];
  /** Per-column filter values, keyed by column id. */
  filters: Record<string, unknown>;
  globalFilter: string;
  pageIndex: number;
  pageSize: number;
  /** Keyed by row id, so a selection survives filtering and re-sorting. */
  selection: Record<string, boolean>;
  expanded: Record<string, boolean>;
  hiddenColumns: string[];
}

export interface TableStoreOptions<T> {
  data: readonly T[];
  columns: ReadonlyArray<TableColumnDef<T>>;
  /** Stable identity for a row. Defaults to its index, which selection needs. */
  getRowId?: (row: T, index: number) => string;
  initialState?: Partial<TableState>;
  /** Data is already filtered, sorted and paged by a server. */
  manual?: boolean;
  /** Total rows on the server, when `manual`. */
  rowCount?: number;
  onStateChange?: (state: TableState) => void;
}

export interface TableRow<T> {
  id: string;
  original: T;
  /** Index within the full filtered-and-sorted set, not within the page. */
  index: number;
  selected: boolean;
  expanded: boolean;
}

export type SelectionState = "none" | "some" | "all";

export interface TableStore<T> {
  getState(): TableState;
  setState(partial: Partial<TableState>): void;
  subscribe(listener: () => void): () => void;
  /** Replaces the data and columns, keeping state. */
  setData(data: readonly T[], columns?: ReadonlyArray<TableColumnDef<T>>): void;

  /** The current page, after filtering and sorting. */
  getRows(): TableRow<T>[];
  /** Everything that survived filtering, before paging. */
  getFilteredRows(): TableRow<T>[];
  getPageCount(): number;
  getRowCount(): number;
  getVisibleColumns(): ReadonlyArray<TableColumnDef<T>>;

  toggleSort(id: string, options?: { multi?: boolean }): void;
  getSortDirection(id: string): SortDirection | undefined;
  setFilter(id: string, value: unknown): void;
  setGlobalFilter(query: string): void;
  setPage(index: number): void;
  setPageSize(size: number): void;

  toggleSelection(id: string): void;
  /** Selects or clears every row that survived filtering, never the hidden ones. */
  toggleAllSelection(): void;
  getSelectionState(): SelectionState;
  getSelectedRows(): T[];
  toggleExpanded(id: string): void;
}

const DEFAULT_STATE: TableState = {
  sorting: [],
  filters: {},
  globalFilter: "",
  pageIndex: 0,
  pageSize: 10,
  selection: {},
  expanded: {},
  hiddenColumns: [],
};

const defaultFilter = (value: unknown, query: unknown): boolean => {
  if (query === undefined || query === null || query === "") return true;
  return String(value ?? "")
    .toLowerCase()
    .includes(String(query).toLowerCase());
};

export function createTableStore<T>(options: TableStoreOptions<T>): TableStore<T> {
  let data = options.data;
  let columns = options.columns;
  let state: TableState = { ...DEFAULT_STATE, ...options.initialState };

  const listeners = new Set<() => void>();
  const getRowId = options.getRowId ?? ((_row: T, index: number) => String(index));

  // Derived results are cached and invalidated by a version counter rather than
  // recomputed per call: an adapter's render reads `getRows`, `getPageCount`
  // and `getSelectionState` in one pass, and sorting the whole table three
  // times for one paint is the difference between a smooth table and a janky
  // one at a few thousand rows.
  let version = 0;
  let cache: { version: number; filtered?: TableRow<T>[]; page?: TableRow<T>[] } = { version: -1 };

  const invalidate = () => {
    version++;
    for (const listener of listeners) listener();
    options.onStateChange?.(state);
  };

  const columnById = () => new Map(columns.map(column => [column.id, column]));

  // Opt in, the way a `sorter` on a column definition reads: supplying a
  // comparator or a matcher is itself the opt-in, since there is no reason to
  // write one for a column that cannot use it.
  //
  // Enforced here rather than in the adapters. Left unchecked, each of the four
  // would have to decide independently whether to guard a header click, which
  // is exactly the divergence "prop names are identical in all four" exists to
  // prevent — and the kind only the parity suite would ever catch.
  const isSortable = (column: TableColumnDef<T> | undefined) =>
    column !== undefined && (column.sortable === true || column.sortFn !== undefined);

  const isFilterable = (column: TableColumnDef<T> | undefined) =>
    column !== undefined && (column.filterable === true || column.filterFn !== undefined);

  /**
   * Row ids are assigned once, against the original data, before anything is
   * filtered or sorted.
   *
   * Deriving an id later from `data.indexOf(row)` would be O(n²) over the whole
   * table, and would hand two identical rows the same id — which silently ties
   * their selection and expansion together.
   */
  const identify = (): Array<{ row: T; id: string }> =>
    data.map((row, index) => ({ row, id: getRowId(row, index) }));

  const computeFiltered = (): TableRow<T>[] => {
    const byId = columnById();
    const query = state.globalFilter.trim().toLowerCase();
    const active = Object.entries(state.filters).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    );

    const rows = identify().filter(({ row }) => {
      for (const [id, value] of active) {
        const column = byId.get(id);
        if (!column) continue;
        const matched = column.filterFn
          ? column.filterFn(row, value)
          : defaultFilter(column.accessor(row), value);
        if (!matched) return false;
      }
      if (!query) return true;
      // Global search spans every column with an accessor, not only the
      // filterable ones — a reader typing into one box means "find this
      // anywhere".
      return columns.some(column =>
        String(column.accessor(row) ?? "")
          .toLowerCase()
          .includes(query)
      );
    });

    const sorted = state.sorting.length > 0 ? sortRows(rows, byId) : rows;

    return sorted.map(({ row, id }, index) => ({
      id,
      original: row,
      index,
      selected: state.selection[id] === true,
      expanded: state.expanded[id] === true,
    }));
  };

  const sortRows = (
    rows: Array<{ row: T; id: string }>,
    byId: Map<string, TableColumnDef<T>>
  ): Array<{ row: T; id: string }> =>
    // Copied before sorting: this must never reorder `data` itself. Sort is
    // stable in every engine targeted here, so equal rows keep their original
    // order — which is what makes a second sort column meaningful.
    [...rows].sort((a, b) => {
      for (const rule of state.sorting) {
        const column = byId.get(rule.id);
        if (!column) continue;
        const descending = rule.direction === "desc";
        const result = column.sortFn
          ? column.sortFn(a.row, b.row) * (descending ? -1 : 1)
          : directedCompare(column.accessor(a.row), column.accessor(b.row), descending);
        if (result !== 0) return result;
      }
      return 0;
    });

  const filtered = (): TableRow<T>[] => {
    if (cache.version !== version || !cache.filtered) {
      cache = { version, filtered: options.manual ? toRows(data) : computeFiltered() };
    }
    return cache.filtered!;
  };

  const toRows = (rows: readonly T[]): TableRow<T>[] =>
    rows.map((row, index) => {
      const id = getRowId(row, index);
      return {
        id,
        original: row,
        index,
        selected: state.selection[id] === true,
        expanded: state.expanded[id] === true,
      };
    });

  const store: TableStore<T> = {
    getState: () => state,

    setState(partial) {
      state = { ...state, ...partial };
      invalidate();
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    setData(nextData, nextColumns) {
      data = nextData;
      if (nextColumns) columns = nextColumns;
      // The cache has to be dropped *before* the row count is read. Every
      // derived getter returns the cache while `version` is unchanged, so
      // clamping first would measure the data that was just replaced — leaving
      // `pageIndex` untouched and the table showing nothing, which is the exact
      // case the clamp exists for.
      version++;
      cache = { version: -1 };

      // Deleting rows while on the last page otherwise leaves no way back
      // except paging.
      const pageCount = Math.max(1, Math.ceil(store.getRowCount() / state.pageSize));
      if (state.pageIndex >= pageCount) state = { ...state, pageIndex: pageCount - 1 };
      invalidate();
    },

    getFilteredRows: filtered,

    getRows() {
      if (options.manual) return filtered();
      if (cache.version === version && cache.page) return cache.page;
      const start = state.pageIndex * state.pageSize;
      const page = filtered().slice(start, start + state.pageSize);
      cache = { ...cache, version, page };
      return page;
    },

    getRowCount: () => (options.manual ? (options.rowCount ?? data.length) : filtered().length),

    getPageCount() {
      return Math.max(1, Math.ceil(store.getRowCount() / state.pageSize));
    },

    getVisibleColumns: () => columns.filter(column => !state.hiddenColumns.includes(column.id)),

    /**
     * Cycles ascending → descending → unsorted.
     *
     * The third state matters: without it there is no way back to the data's
     * natural order once a column has been touched.
     */
    toggleSort(id, { multi = false } = {}) {
      if (!isSortable(columnById().get(id))) return;
      const existing = state.sorting.find(rule => rule.id === id);
      const others = multi ? state.sorting.filter(rule => rule.id !== id) : [];

      const sorting: SortRule[] = !existing
        ? [...others, { id, direction: "asc" }]
        : existing.direction === "asc"
          ? [...others, { id, direction: "desc" }]
          : others;

      // Back to page one: staying on page 9 of a re-sorted table shows
      // different rows for no reason the reader can see.
      store.setState({ sorting, pageIndex: 0 });
    },

    getSortDirection: id => state.sorting.find(rule => rule.id === id)?.direction,

    setFilter(id, value) {
      if (!isFilterable(columnById().get(id))) return;
      store.setState({ filters: { ...state.filters, [id]: value }, pageIndex: 0 });
    },

    setGlobalFilter(query) {
      store.setState({ globalFilter: query, pageIndex: 0 });
    },

    setPage(index) {
      store.setState({ pageIndex: Math.min(Math.max(index, 0), store.getPageCount() - 1) });
    },

    setPageSize(size) {
      // Keep the first visible row visible. Changing page size while deep in a
      // table otherwise jumps somewhere unrelated.
      const firstVisible = state.pageIndex * state.pageSize;
      store.setState({ pageSize: size, pageIndex: Math.floor(firstVisible / size) });
    },

    toggleSelection(id) {
      const selection = { ...state.selection };
      if (selection[id]) delete selection[id];
      else selection[id] = true;
      store.setState({ selection });
    },

    toggleAllSelection() {
      const rows = filtered();
      const allSelected = rows.length > 0 && rows.every(row => state.selection[row.id]);
      if (allSelected) {
        // Clears only what is currently visible, so a selection made under a
        // different filter is not silently discarded.
        const selection = { ...state.selection };
        for (const row of rows) delete selection[row.id];
        return store.setState({ selection });
      }
      const selection = { ...state.selection };
      for (const row of rows) selection[row.id] = true;
      store.setState({ selection });
    },

    getSelectionState() {
      const rows = filtered();
      if (rows.length === 0) return "none";
      const count = rows.reduce((total, row) => total + (state.selection[row.id] ? 1 : 0), 0);
      return count === 0 ? "none" : count === rows.length ? "all" : "some";
    },

    getSelectedRows: () =>
      identify()
        .filter(({ id }) => state.selection[id] === true)
        .map(({ row }) => row),

    toggleExpanded(id) {
      const expanded = { ...state.expanded };
      if (expanded[id]) delete expanded[id];
      else expanded[id] = true;
      store.setState({ expanded });
    },
  };

  return store;
}
