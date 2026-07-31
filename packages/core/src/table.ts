import {
  createTable,
  functionalUpdate,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type PaginationState,
  type RowData,
  type SortingState,
  type Table,
  type TableState,
} from "@tanstack/table-core";

/**
 * A column is plain, serialisable data — no render functions.
 *
 * That is the one deliberate divergence from TanStack's own `ColumnDef`: a
 * `cell` returning React JSX cannot render in Vue, so custom cell content is a
 * per-framework slot keyed by column id instead, and the column definition
 * itself stays identical in all four.
 */
export interface TableColumn<T> {
  /** v0 called this `key`. */
  id: string;
  /** v0 called this `title`. */
  header: string;
  /** v0 called this `dataIndex`. */
  accessor: keyof T & string;
  /** v0 passed a comparator as `sorter`; pass `sortFn` for a custom one. */
  sortable?: boolean;
  sortFn?: (a: T, b: T) => number;
  width?: number | string;
  align?: "start" | "center" | "end";
}

/** v0's column shape, accepted by `fromLegacyColumns` for migration. */
export interface LegacyTableColumn<T> {
  title: string;
  dataIndex: keyof T & string;
  key: string;
  sorter?: (a: T, b: T) => number;
  width?: number | string;
}

export function toColumnDefs<T extends RowData>(columns: TableColumn<T>[]): ColumnDef<T>[] {
  return columns.map(column => ({
    id: column.id,
    header: column.header,
    accessorKey: column.accessor,
    enableSorting: column.sortable ?? column.sortFn != null,
    ...(column.sortFn
      ? { sortingFn: (a, b) => column.sortFn!(a.original as T, b.original as T) }
      : {}),
  }));
}

export function fromLegacyColumns<T>(columns: LegacyTableColumn<T>[]): TableColumn<T>[] {
  return columns.map(column => ({
    id: column.key,
    header: column.title,
    accessor: column.dataIndex,
    sortable: column.sorter != null,
    sortFn: column.sorter,
    width: column.width,
  }));
}

export const PAGE_ELLIPSIS = "…";
export type PageWindowEntry = number | typeof PAGE_ELLIPSIS;

/**
 * The page buttons to render, with gaps collapsed to an ellipsis.
 *
 * v0 rendered every page — 50 buttons for 500 rows at a page size of 10. Pages
 * are 1-based here, matching what a consumer displays.
 */
export function getPageWindow(current: number, total: number, siblings = 1): PageWindowEntry[] {
  if (total <= 0) return [];
  const clamped = Math.min(Math.max(current, 1), total);
  // first + last + current + 2 ellipses + siblings on each side
  if (total <= siblings * 2 + 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const start = Math.max(clamped - siblings, 2);
  const end = Math.min(clamped + siblings, total - 1);
  const out: PageWindowEntry[] = [1];
  if (start > 2) out.push(PAGE_ELLIPSIS);
  for (let page = start; page <= end; page++) out.push(page);
  if (end < total - 1) out.push(PAGE_ELLIPSIS);
  out.push(total);
  return out;
}

export interface TableStoreOptions<T extends RowData> {
  data: T[];
  columns: TableColumn<T>[];
  getRowId?: (row: T, index: number) => string;
  sorting?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  pagination?: PaginationState;
  defaultPagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  /** Server-side paging: supply `rowCount` and page the data yourself. */
  manualPagination?: boolean;
  rowCount?: number;
  paginated?: boolean;
}

export interface TableStore<T extends RowData> {
  getTable: () => Table<T>;
  subscribe: (listener: () => void) => () => void;
  /**
   * Bumped only by the table's own state changes, never by `setOptions`.
   *
   * That distinction is what keeps `setOptions`-during-render from looping: a
   * prop change is already causing a render, so re-notifying would schedule
   * another one, whose `setOptions` would notify again.
   */
  getVersion: () => number;
  /** Re-apply options after a prop change. Deliberately does not notify. */
  setOptions: (options: TableStoreOptions<T>) => void;
}

/**
 * Binds `@tanstack/table-core` once, here, rather than through the four
 * official framework adapters.
 *
 * `@tanstack/svelte-table` peers svelte ^3||^4 and would have forced a bespoke
 * binding for Svelte anyway; doing it once in framework-free code means all
 * four adapters are the same shape instead of three-plus-one, and drops three
 * dependencies. The subscribe/getSnapshot pair is deliberately the shape
 * `useSyncExternalStore` wants, so each binding is a handful of lines.
 */
export function createTableStore<T extends RowData>(options: TableStoreOptions<T>): TableStore<T> {
  const listeners = new Set<() => void>();
  let current = options;
  let state: Partial<TableState> = {
    sorting: options.sorting ?? options.defaultSorting ?? [],
    pagination: options.pagination ?? options.defaultPagination ?? { pageIndex: 0, pageSize: 10 },
  };

  let version = 0;
  const notify = () => {
    version++;
    listeners.forEach(listener => listener());
  };

  // onStateChange is deliberately absent: resolve() is spread over the existing
  // options on every setOptions, and including it would overwrite the real
  // handler installed below with whatever placeholder appeared here.
  const resolve = () => ({
    data: current.data,
    columns: toColumnDefs(current.columns),
    getRowId: current.getRowId,
    manualPagination: current.manualPagination,
    rowCount: current.rowCount,
    getCoreRowModel: getCoreRowModel<T>(),
    getSortedRowModel: getSortedRowModel<T>(),
    ...(current.paginated === false ? {} : { getPaginationRowModel: getPaginationRowModel<T>() }),
    // Controlled props win over internal state, which is what makes
    // `sorting`/`pagination` behave the same way as every other controlled prop
    // in the library.
    state: {
      ...state,
      ...(current.sorting ? { sorting: current.sorting } : {}),
      ...(current.pagination ? { pagination: current.pagination } : {}),
    },
    renderFallbackValue: null,
  });

  const table = createTable<T>({
    ...resolve(),
    onStateChange: updater => {
      state = functionalUpdate(updater, state as TableState);
      current.onSortingChange?.(state.sorting ?? []);
      current.onPaginationChange?.(state.pagination ?? { pageIndex: 0, pageSize: 10 });
      table.setOptions(previous => ({ ...previous, ...resolve() }));
      notify();
    },
  });

  // Seeded only after creation, because table.initialState is what supplies the
  // slices no feature of ours touches — columnPinning above all, which
  // getHeaderGroups reads unconditionally and which throws when absent.
  state = { ...table.initialState, ...state };
  table.setOptions(previous => ({ ...previous, ...resolve() }));

  return {
    getTable: () => table,
    getVersion: () => version,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    setOptions(next) {
      current = next;
      // Until the first real interaction the defaults are still live, so a
      // binding that constructs the store before its props are known (Angular
      // and Svelte both do, to keep their reactive scopes clean) still gets
      // `defaultSorting` and `defaultPagination` applied.
      if (version === 0) {
        if (next.defaultSorting) state.sorting = next.defaultSorting;
        if (next.defaultPagination) state.pagination = next.defaultPagination;
      }
      table.setOptions(previous => ({ ...previous, ...resolve() }));
    },
  };
}

export type { ColumnDef, PaginationState, SortingState, Table };
