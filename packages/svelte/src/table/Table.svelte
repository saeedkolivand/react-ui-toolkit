<script lang="ts" generics="T">
  import { onDestroy } from "svelte";
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
  import Icon from "../icon/Icon.svelte";
  import Spinner from "../spinner/Spinner.svelte";
  import Select from "../select/Select.svelte";
  import type { TableProps } from "./types";

  let {
    data,
    columns,
    getRowId,
    cells,
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
    class: klass,
  }: TableProps<T> = $props();

  const SORT_LABEL = { asc: "ascending", desc: "descending" } as const;
  const sortLabel = (sorted: false | "asc" | "desc") => (sorted ? SORT_LABEL[sorted] : undefined);

  const options = $derived({
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
  });

  // Constructed with neutral options rather than the derived ones: reading
  // reactive state during setup captures only its initial value. The first
  // setOptions below applies the real props, defaults included.
  const store = createTableStore<T>({ data: [], columns: [] });
  let version = $state(0);
  onDestroy(store.subscribe(() => (version = store.getVersion())));

  const table = $derived.by(() => {
    void version;
    store.setOptions(options);
    return store.getTable();
  });

  const rows = $derived(table.getRowModel().rows);
  const pageCount = $derived(table.getPageCount());
  const pageIndex = $derived(table.getState().pagination.pageIndex);
  const currentPageSize = $derived(table.getState().pagination.pageSize);
  const total = $derived(manualPagination ? (rowCount ?? data.length) : data.length);
  const columnById = $derived(Object.fromEntries(columns.map(column => [column.id, column])));
  const pageWindow = $derived(getPageWindow(pageIndex + 1, pageCount));
  const sizeItems = $derived(
    pageSizeOptions.map(size => ({ value: String(size), label: `${size} / page` }))
  );
</script>

<div
  data-scope="table"
  data-part="root"
  data-density={density}
  data-bordered={dataAttr(bordered)}
  data-striped={dataAttr(striped)}
  data-hoverable={dataAttr(hoverable)}
  data-sticky-header={dataAttr(stickyHeader)}
  class={klass}
>
  <div data-scope="table" data-part="scroll">
    <table data-scope="table" data-part="table">
      <thead data-scope="table" data-part="head">
        {#each table.getHeaderGroups() as group (group.id)}
          <tr data-scope="table" data-part="row">
            {#each group.headers as header (header.id)}
              <th
                data-scope="table"
                data-part="header"
                scope="col"
                data-align={columnById[header.column.id]?.align}
                aria-sort={sortLabel(header.column.getIsSorted())}
                style={columnById[header.column.id]?.width == null
                  ? undefined
                  : `width: ${columnById[header.column.id]?.width}`}
              >
                <!-- v0's sortable <th> had a bare onClick: no tabindex, no role,
                     no Enter handler, so it was unreachable by keyboard. -->
                {#if header.column.getCanSort()}
                  <button
                    type="button"
                    data-scope="table"
                    data-part="sort-trigger"
                    onclick={() => header.column.toggleSorting()}
                  >
                    {columnById[header.column.id]?.header}
                    <Icon
                      name="arrowUp"
                      size="sm"
                      data-part="sort-indicator"
                      data-sorted={header.column.getIsSorted() || undefined}
                    />
                  </button>
                {:else}
                  {columnById[header.column.id]?.header}
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>
      <tbody data-scope="table" data-part="body">
        {#each rows as row (row.id)}
          <tr data-scope="table" data-part="row">
            {#each row.getVisibleCells() as cell (cell.id)}
              <td
                data-scope="table"
                data-part="cell"
                data-align={columnById[cell.column.id]?.align}
              >
                {#if cells?.[cell.column.id]}
                  {@render cells[cell.column.id]!(row.original, cell.getValue())}
                {:else}
                  {cell.getValue() ?? ""}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
    {#if rows.length === 0 && !loading}
      <div data-scope="table" data-part="empty">{emptyMessage}</div>
    {/if}
    <!-- An overlay rather than a replacement, so rows and scroll position
         survive a refetch. -->
    {#if loading}
      <div data-scope="table" data-part="loading-overlay" aria-live="polite" aria-busy="true">
        <Spinner />
      </div>
    {/if}
  </div>

  {#if pagination && pageCount > 0}
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
          onclick={() => table.previousPage()}
        >
          <Icon name="chevronLeft" size="sm" />
        </button>
        <!-- v0 rendered one button per page — 50 of them for 500 rows. -->
        {#each pageWindow as entry, index (entry === PAGE_ELLIPSIS ? `gap-${index}` : entry)}
          {#if entry === PAGE_ELLIPSIS}
            <span data-scope="table" data-part="page-ellipsis" aria-hidden="true"
              >{PAGE_ELLIPSIS}</span
            >
          {:else}
            <button
              type="button"
              data-scope="table"
              data-part="page-trigger"
              aria-label={`Page ${entry}`}
              aria-current={entry === pageIndex + 1 ? "page" : undefined}
              onclick={() => table.setPageIndex((entry as number) - 1)}
            >
              {entry}
            </button>
          {/if}
        {/each}
        <button
          type="button"
          data-scope="table"
          data-part="page-trigger"
          aria-label="Next page"
          disabled={!table.getCanNextPage()}
          onclick={() => table.nextPage()}
        >
          <Icon name="chevronRight" size="sm" />
        </button>
      </nav>

      {#if showSizeChanger}
        <div data-scope="table" data-part="page-size">
          <Select
            label="Rows per page"
            size="sm"
            fullWidth={false}
            items={sizeItems}
            value={String(currentPageSize)}
            onValueChange={details => table.setPageSize(Number(details.value))}
          />
        </div>
      {/if}
    </div>
  {/if}
</div>
