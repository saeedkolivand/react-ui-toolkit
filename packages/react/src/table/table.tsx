"use client";

import { useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  createTableStore,
  dataAttr,
  getPageWindow,
  PAGE_ELLIPSIS,
  type Density,
  type PaginationState,
  type SortingState,
  type TableColumn,
} from "@crosskit-ui/core";
import { Icon } from "../icon/icon";
import { Spinner } from "../spinner/spinner";
import { Select } from "../select/select";

export interface TableProps<T> {
  /** v0 called this `dataSource`. */
  data: T[];
  columns: TableColumn<T>[];
  /** v0 took a `keyof T`; this takes the same function TanStack does. */
  getRowId?: (row: T, index: number) => string;
  /**
   * Custom cell content, keyed by column id. Column definitions stay
   * serialisable so they are identical in all four frameworks; only this map is
   * framework-specific.
   */
  renderCell?: { [id: string]: (row: T) => ReactNode };
  /** v0 called this `size`; renamed to stop colliding with the shared Size type. */
  density?: Density;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  loading?: boolean;
  emptyMessage?: ReactNode;

  sorting?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  /** Pass `false` to render every row. */
  pagination?: boolean;
  pageSize?: number;
  paginationState?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  /** Server-side paging: page the data yourself and pass the total. */
  manualPagination?: boolean;
  rowCount?: number;
  /** v0 had this, but its Select never rendered its options (bug 0.3). */
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];

  className?: string;
}

const SORT_LABEL = { asc: "ascending", desc: "descending" } as const;

export function Table<T>({
  data,
  columns,
  getRowId,
  renderCell,
  density = "middle",
  bordered = false,
  striped = false,
  hoverable = true,
  stickyHeader = false,
  loading = false,
  emptyMessage = "No data",
  sorting,
  defaultSorting,
  onSortingChange,
  pagination = true,
  pageSize = 10,
  paginationState,
  onPaginationChange,
  manualPagination,
  rowCount,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  className,
}: TableProps<T>) {
  const options = {
    data,
    columns,
    getRowId,
    sorting,
    defaultSorting,
    onSortingChange,
    pagination: paginationState,
    defaultPagination: { pageIndex: 0, pageSize },
    onPaginationChange,
    manualPagination,
    rowCount,
    paginated: pagination,
  };

  // Created once; every later prop change is re-applied during render rather
  // than in an effect, so the very first render after a prop change already
  // reads the new rows. setOptions does not notify, which is what stops this
  // from looping.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const store = useMemo(() => createTableStore<T>(options), []);
  store.setOptions(options);

  // The store is deliberately shaped as a useSyncExternalStore pair, which is
  // what keeps the four bindings a handful of lines each.
  useSyncExternalStore(store.subscribe, store.getVersion, store.getVersion);

  const table = store.getTable();
  const rows = table.getRowModel().rows;
  const pageCount = table.getPageCount();
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination;
  const total = manualPagination ? (rowCount ?? data.length) : data.length;
  const columnById = useMemo(
    () => Object.fromEntries(columns.map(column => [column.id, column])),
    [columns]
  );

  return (
    <div
      data-scope="table"
      data-part="root"
      data-density={density}
      data-bordered={dataAttr(bordered)}
      data-striped={dataAttr(striped)}
      data-hoverable={dataAttr(hoverable)}
      data-sticky-header={dataAttr(stickyHeader)}
      className={className}
    >
      <div data-scope="table" data-part="scroll">
        <table data-scope="table" data-part="table">
          <thead data-scope="table" data-part="head">
            {table.getHeaderGroups().map(group => (
              <tr key={group.id} data-scope="table" data-part="row">
                {group.headers.map(header => {
                  const column = columnById[header.column.id];
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      data-scope="table"
                      data-part="header"
                      data-align={column?.align}
                      // aria-sort belongs on the cell, not the button.
                      aria-sort={sorted ? SORT_LABEL[sorted] : undefined}
                      style={column?.width == null ? undefined : { width: column.width }}
                      scope="col"
                    >
                      {header.column.getCanSort() ? (
                        <button
                          type="button"
                          data-scope="table"
                          data-part="sort-trigger"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {column?.header}
                          <Icon
                            name="arrowUp"
                            size="sm"
                            data-part="sort-indicator"
                            data-sorted={sorted || undefined}
                          />
                        </button>
                      ) : (
                        column?.header
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody data-scope="table" data-part="body">
            {rows.map(row => (
              <tr key={row.id} data-scope="table" data-part="row">
                {row.getVisibleCells().map(cell => {
                  const column = columnById[cell.column.id];
                  const custom = renderCell?.[cell.column.id];
                  return (
                    <td
                      key={cell.id}
                      data-scope="table"
                      data-part="cell"
                      data-align={column?.align}
                    >
                      {custom ? custom(row.original) : String(cell.getValue() ?? "")}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && !loading && (
          <div data-scope="table" data-part="empty">
            {emptyMessage}
          </div>
        )}
        {/* An overlay rather than a replacement, so rows and scroll position
            survive a refetch. */}
        {loading && (
          <div data-scope="table" data-part="loading-overlay" aria-live="polite" aria-busy="true">
            <Spinner />
          </div>
        )}
      </div>

      {pagination && pageCount > 0 && (
        <div data-scope="table" data-part="pagination">
          <span data-scope="table" data-part="summary">
            {total === 0
              ? "No results"
              : `${pageIndex * currentPageSize + 1}–${Math.min(
                  (pageIndex + 1) * currentPageSize,
                  total
                )} of ${total}`}
          </span>

          <nav data-scope="table" data-part="pages" aria-label="Pagination">
            <button
              type="button"
              data-scope="table"
              data-part="page-trigger"
              aria-label="Previous page"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <Icon name="chevronLeft" size="sm" />
            </button>
            {/* v0 rendered one button per page — 50 of them for 500 rows. */}
            {getPageWindow(pageIndex + 1, pageCount).map((entry, index) =>
              entry === PAGE_ELLIPSIS ? (
                <span
                  // An ellipsis has no identity beyond its position.
                  // eslint-disable-next-line @eslint-react/no-array-index-key
                  key={`gap-${index}`}
                  data-scope="table"
                  data-part="page-ellipsis"
                  aria-hidden="true"
                >
                  {PAGE_ELLIPSIS}
                </span>
              ) : (
                <button
                  key={entry}
                  type="button"
                  data-scope="table"
                  data-part="page-trigger"
                  aria-label={`Page ${entry}`}
                  aria-current={entry === pageIndex + 1 ? "page" : undefined}
                  onClick={() => table.setPageIndex(entry - 1)}
                >
                  {entry}
                </button>
              )
            )}
            <button
              type="button"
              data-scope="table"
              data-part="page-trigger"
              aria-label="Next page"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <Icon name="chevronRight" size="sm" />
            </button>
          </nav>

          {showSizeChanger && (
            <div data-scope="table" data-part="page-size">
              <Select
                label="Rows per page"
                fullWidth={false}
                size="small"
                options={pageSizeOptions.map(size => ({
                  value: String(size),
                  label: `${size} / page`,
                }))}
                value={String(currentPageSize)}
                onChange={value => table.setPageSize(Number(value))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
