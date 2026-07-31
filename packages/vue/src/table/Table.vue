<script setup lang="ts" generic="T">
import { computed, onScopeDispose, shallowRef, triggerRef, watchEffect } from "vue";
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
import Icon from "../icon/Icon.vue";
import Spinner from "../spinner/Spinner.vue";
import Select from "../select/Select.vue";

const props = withDefaults(
  defineProps<{
    /** v0 called this `dataSource`. */
    data: T[];
    columns: TableColumn<T>[];
    getRowId?: (row: T, index: number) => string;
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
    /** Pass `false` to render every row. */
    pagination?: boolean;
    pageSize?: number;
    paginationState?: PaginationState;
    manualPagination?: boolean;
    rowCount?: number;
    /** v0 had this, but its Select never rendered its options (bug 0.3). */
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
  }>(),
  {
    density: "middle",
    hoverable: true,
    emptyMessage: "No data",
    pagination: true,
    pageSize: 10,
    pageSizeOptions: () => [10, 20, 50, 100],
  }
);

const emit = defineEmits<{
  sortingChange: [SortingState];
  paginationChange: [PaginationState];
}>();

const options = computed(() => ({
  data: props.data,
  columns: props.columns,
  getRowId: props.getRowId,
  sorting: props.sorting,
  defaultSorting: props.defaultSorting,
  onSortingChange: (sorting: SortingState) => emit("sortingChange", sorting),
  pagination: props.paginationState,
  defaultPagination: { pageIndex: 0, pageSize: props.pageSize },
  onPaginationChange: (pagination: PaginationState) => emit("paginationChange", pagination),
  manualPagination: props.manualPagination,
  rowCount: props.rowCount,
  paginated: props.pagination,
}));

const store = createTableStore<T>(options.value);
// shallowRef + triggerRef rather than reactive(): the table instance is a deep
// mutable graph and Vue must not proxy it.
const version = shallowRef(0);
const stop = store.subscribe(() => {
  version.value = store.getVersion();
  triggerRef(version);
});
onScopeDispose(stop);

watchEffect(() => store.setOptions(options.value));

const table = computed(() => {
  void version.value;
  void options.value;
  return store.getTable();
});
const rows = computed(() => table.value.getRowModel().rows);
const pageCount = computed(() => table.value.getPageCount());
const pageIndex = computed(() => table.value.getState().pagination.pageIndex);
const currentPageSize = computed(() => table.value.getState().pagination.pageSize);
const total = computed(() =>
  props.manualPagination ? (props.rowCount ?? props.data.length) : props.data.length
);
const columnById = computed(() =>
  Object.fromEntries(props.columns.map(column => [column.id, column]))
);
const pageWindow = computed(() => getPageWindow(pageIndex.value + 1, pageCount.value));
const sizeItems = computed(() =>
  props.pageSizeOptions.map(size => ({ value: String(size), label: `${size} / page` }))
);

const SORT_LABEL = { asc: "ascending", desc: "descending" } as const;
const sortLabel = (sorted: false | "asc" | "desc") => (sorted ? SORT_LABEL[sorted] : undefined);
</script>

<template>
  <div
    data-scope="table"
    data-part="root"
    :data-density="props.density"
    :data-bordered="dataAttr(props.bordered)"
    :data-striped="dataAttr(props.striped)"
    :data-hoverable="dataAttr(props.hoverable)"
    :data-sticky-header="dataAttr(props.stickyHeader)"
  >
    <div data-scope="table" data-part="scroll">
      <table data-scope="table" data-part="table">
        <thead data-scope="table" data-part="head">
          <tr
            v-for="group in table.getHeaderGroups()"
            :key="group.id"
            data-scope="table"
            data-part="row"
          >
            <th
              v-for="header in group.headers"
              :key="header.id"
              data-scope="table"
              data-part="header"
              scope="col"
              :data-align="columnById[header.column.id]?.align"
              :aria-sort="sortLabel(header.column.getIsSorted())"
              :style="
                columnById[header.column.id]?.width == null
                  ? undefined
                  : { width: columnById[header.column.id]?.width }
              "
            >
              <!-- v0's sortable <th> had a bare onClick: no tabindex, no role,
                   no Enter handler, so it was unreachable by keyboard. -->
              <button
                v-if="header.column.getCanSort()"
                type="button"
                data-scope="table"
                data-part="sort-trigger"
                @click="header.column.toggleSorting()"
              >
                {{ columnById[header.column.id]?.header }}
                <Icon
                  name="arrowUp"
                  size="sm"
                  data-part="sort-indicator"
                  :data-sorted="header.column.getIsSorted() || undefined"
                />
              </button>
              <template v-else>{{ columnById[header.column.id]?.header }}</template>
            </th>
          </tr>
        </thead>
        <tbody data-scope="table" data-part="body">
          <tr v-for="row in rows" :key="row.id" data-scope="table" data-part="row">
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              data-scope="table"
              data-part="cell"
              :data-align="columnById[cell.column.id]?.align"
            >
              <!-- Custom cell content is a slot named after the column id, so
                   the column definitions stay serialisable and identical in all
                   four frameworks. -->
              <slot :name="`cell:${cell.column.id}`" :row="row.original" :value="cell.getValue()">
                {{ cell.getValue() ?? "" }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="rows.length === 0 && !props.loading" data-scope="table" data-part="empty">
        <slot name="empty">{{ props.emptyMessage }}</slot>
      </div>
      <!-- An overlay rather than a replacement, so rows and scroll position
           survive a refetch. -->
      <div
        v-if="props.loading"
        data-scope="table"
        data-part="loading-overlay"
        aria-live="polite"
        aria-busy="true"
      >
        <Spinner />
      </div>
    </div>

    <div v-if="props.pagination && pageCount > 0" data-scope="table" data-part="pagination">
      <span data-scope="table" data-part="summary">
        {{
          total === 0
            ? "No results"
            : `${pageIndex * currentPageSize + 1}–${Math.min(
                (pageIndex + 1) * currentPageSize,
                total
              )} of ${total}`
        }}
      </span>

      <nav data-scope="table" data-part="pages" aria-label="Pagination">
        <button
          type="button"
          data-scope="table"
          data-part="page-trigger"
          aria-label="Previous page"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <Icon name="chevronLeft" size="sm" />
        </button>
        <!-- v0 rendered one button per page — 50 of them for 500 rows. -->
        <template v-for="(entry, index) in pageWindow">
          <span
            v-if="entry === PAGE_ELLIPSIS"
            :key="`gap-${index}`"
            data-scope="table"
            data-part="page-ellipsis"
            aria-hidden="true"
            >{{ PAGE_ELLIPSIS }}</span
          >
          <button
            v-else
            :key="entry"
            type="button"
            data-scope="table"
            data-part="page-trigger"
            :aria-label="`Page ${entry}`"
            :aria-current="entry === pageIndex + 1 ? 'page' : undefined"
            @click="table.setPageIndex((entry as number) - 1)"
          >
            {{ entry }}
          </button>
        </template>
        <button
          type="button"
          data-scope="table"
          data-part="page-trigger"
          aria-label="Next page"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <Icon name="chevronRight" size="sm" />
        </button>
      </nav>

      <div v-if="props.showSizeChanger" data-scope="table" data-part="page-size">
        <Select
          label="Rows per page"
          size="sm"
          :full-width="false"
          :items="sizeItems"
          :value="String(currentPageSize)"
          @update:value="value => table.setPageSize(Number(value))"
        />
      </div>
    </div>
  </div>
</template>
