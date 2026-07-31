import type { Snippet } from "svelte";
import type { Density, PaginationState, SortingState, TableColumn } from "@crosskit-ui/core";

/**
 * Declared here rather than inside the component: svelte-package emits a
 * generic factory function for `<script generics>` components, and its return
 * type has to name a type the .d.ts can actually see.
 */
export interface TableProps<T> {
  /** v0 called this `dataSource`. */
  data: T[];
  columns: TableColumn<T>[];
  getRowId?: (row: T, index: number) => string;
  /**
   * Custom cell content, keyed by column id. Column definitions stay
   * serialisable so they are identical in all four frameworks.
   */
  cells?: { [id: string]: Snippet<[T, unknown]> };
  /** v0 called this `size`; renamed to stop colliding with the shared Size type. */
  density?: Density;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  stickyHeader?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  sorting?: SortingState;
  defaultSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  /** Pass `false` to render every row. */
  pagination?: boolean;
  pageSize?: number;
  paginationState?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  manualPagination?: boolean;
  rowCount?: number;
  /** v0 had this, but its Select never rendered its options (bug 0.3). */
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  class?: string;
}
