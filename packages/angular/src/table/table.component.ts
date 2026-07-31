import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  NgZone,
  output,
  signal,
  TemplateRef,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { ckDataAttr } from "@crosskit-ui/zag-angular";
import {
  createTableStore,
  getPageWindow,
  PAGE_ELLIPSIS,
  type Density,
  type PageWindowEntry,
  type PaginationState,
  type SortingState,
  type TableColumn,
} from "@crosskit-ui/core";
import { CkIcon } from "../icon/icon.component";
import { CkSpinner } from "../feedback/spinner.component";
import { CkSelect } from "../select/select.component";

const SORT_LABEL: Record<string, string> = { asc: "ascending", desc: "descending" };

/**
 * Custom cell content, keyed by column id. Column definitions stay serialisable
 * so they are identical in all four frameworks; only this directive is
 * Angular-specific.
 *
 *   <ng-template ckTableCell="name" let-row>{{ row.name | uppercase }}</ng-template>
 */
@Directive({ selector: "[ckTableCell]", standalone: true })
export class CkTableCell {
  readonly ckTableCell = input.required<string>();
  constructor(readonly template: TemplateRef<unknown>) {}
}

@Component({
  selector: "ck-table",
  standalone: true,
  imports: [NgTemplateOutlet, CkIcon, CkSpinner, CkSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      data-scope="table"
      data-part="root"
      [attr.data-density]="density()"
      [attr.data-bordered]="attr(bordered())"
      [attr.data-striped]="attr(striped())"
      [attr.data-hoverable]="attr(hoverable())"
      [attr.data-sticky-header]="attr(stickyHeader())"
    >
      <div data-scope="table" data-part="scroll">
        <table data-scope="table" data-part="table">
          <thead data-scope="table" data-part="head">
            @for (group of table().getHeaderGroups(); track group.id) {
              <tr data-scope="table" data-part="row">
                @for (header of group.headers; track header.id) {
                  <th
                    data-scope="table"
                    data-part="header"
                    scope="col"
                    [attr.data-align]="columnById()[header.column.id]?.align"
                    [attr.aria-sort]="sortLabel(header.column.getIsSorted())"
                    [style.width]="columnById()[header.column.id]?.width"
                  >
                    <!-- v0's sortable <th> had a bare click handler: no
                         tabindex, no role, no Enter handler, so it could not be
                         operated from the keyboard at all. -->
                    @if (header.column.getCanSort()) {
                      <button
                        type="button"
                        data-scope="table"
                        data-part="sort-trigger"
                        (click)="header.column.toggleSorting()"
                      >
                        {{ columnById()[header.column.id]?.header }}
                        <svg
                          ckIcon
                          name="arrowUp"
                          size="sm"
                          data-part="sort-indicator"
                          [attr.data-sorted]="header.column.getIsSorted() || null"
                        ></svg>
                      </button>
                    } @else {
                      {{ columnById()[header.column.id]?.header }}
                    }
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody data-scope="table" data-part="body">
            @for (row of rows(); track row.id) {
              <tr data-scope="table" data-part="row">
                @for (cell of row.getVisibleCells(); track cell.id) {
                  <td
                    data-scope="table"
                    data-part="cell"
                    [attr.data-align]="columnById()[cell.column.id]?.align"
                  >
                    @if (cellTemplate(cell.column.id); as template) {
                      <ng-container
                        [ngTemplateOutlet]="template"
                        [ngTemplateOutletContext]="{
                          $implicit: row.original,
                          value: cell.getValue(),
                        }"
                      />
                    } @else {
                      {{ cell.getValue() ?? "" }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
        @if (rows().length === 0 && !loading()) {
          <div data-scope="table" data-part="empty">{{ emptyMessage() }}</div>
        }
        <!-- An overlay rather than a replacement, so rows and scroll position
             survive a refetch. -->
        @if (loading()) {
          <div data-scope="table" data-part="loading-overlay" aria-live="polite" aria-busy="true">
            <ck-spinner />
          </div>
        }
      </div>

      @if (pagination() && pageCount() > 0) {
        <div data-scope="table" data-part="pagination">
          <span data-scope="table" data-part="summary">{{ summary() }}</span>

          <nav data-scope="table" data-part="pages" aria-label="Pagination">
            <button
              type="button"
              data-scope="table"
              data-part="page-trigger"
              aria-label="Previous page"
              [disabled]="!table().getCanPreviousPage()"
              (click)="table().previousPage()"
            >
              <svg ckIcon name="chevronLeft" size="sm"></svg>
            </button>
            <!-- v0 rendered one button per page — 50 of them for 500 rows. -->
            @for (entry of pageWindow(); track $index) {
              @if (entry === ellipsis) {
                <span data-scope="table" data-part="page-ellipsis" aria-hidden="true">{{
                  ellipsis
                }}</span>
              } @else {
                <button
                  type="button"
                  data-scope="table"
                  data-part="page-trigger"
                  [attr.aria-label]="'Page ' + entry"
                  [attr.aria-current]="entry === pageIndex() + 1 ? 'page' : null"
                  (click)="table().setPageIndex($any(entry) - 1)"
                >
                  {{ entry }}
                </button>
              }
            }
            <button
              type="button"
              data-scope="table"
              data-part="page-trigger"
              aria-label="Next page"
              [disabled]="!table().getCanNextPage()"
              (click)="table().nextPage()"
            >
              <svg ckIcon name="chevronRight" size="sm"></svg>
            </button>
          </nav>

          @if (showSizeChanger()) {
            <div data-scope="table" data-part="page-size">
              <ck-select
                label="Rows per page"
                size="sm"
                [fullWidth]="false"
                [items]="sizeItems()"
                [value]="currentPageSize() + ''"
                (valueChange)="table().setPageSize(+($event ?? currentPageSize()))"
              />
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class CkTable<T> {
  /** v0 called this `dataSource`. */
  readonly data = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();
  readonly getRowId = input<(row: T, index: number) => string>();
  /** v0 called this `size`; renamed to stop colliding with the shared Size type. */
  readonly density = input<Density>("middle");
  readonly bordered = input(false, { transform: booleanAttribute });
  readonly striped = input(false, { transform: booleanAttribute });
  readonly hoverable = input(true, { transform: booleanAttribute });
  readonly stickyHeader = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });
  readonly emptyMessage = input("No data");
  readonly sorting = input<SortingState>();
  readonly defaultSorting = input<SortingState>();
  readonly pagination = input(true, { transform: booleanAttribute });
  readonly pageSize = input(10);
  readonly paginationState = input<PaginationState>();
  readonly manualPagination = input(false, { transform: booleanAttribute });
  readonly rowCount = input<number>();
  /** v0 had this, but its Select never rendered its options (bug 0.3). */
  readonly showSizeChanger = input(false, { transform: booleanAttribute });
  readonly pageSizeOptions = input<number[]>([10, 20, 50, 100]);

  readonly sortingChange = output<SortingState>();
  readonly paginationChange = output<PaginationState>();

  protected readonly attr = ckDataAttr;
  protected readonly ellipsis = PAGE_ELLIPSIS;

  private readonly templates = contentChildren(CkTableCell);
  private readonly version = signal(0);

  // Neutral at construction: inputs are not readable in a field initializer,
  // so the effect below applies the real options, defaults included.
  private readonly store = createTableStore<T>({ data: [], columns: [] });

  constructor() {
    const zone = inject(NgZone);
    inject(DestroyRef).onDestroy(
      this.store.subscribe(() => zone.run(() => this.version.set(this.store.getVersion())))
    );
    // Options are re-applied in an effect rather than inside the computed
    // below: a computed must stay pure, and setOptions mutates the table.
    effect(() => {
      this.store.setOptions({
        data: this.data(),
        columns: this.columns(),
        getRowId: this.getRowId(),
        sorting: this.sorting(),
        defaultSorting: this.defaultSorting(),
        onSortingChange: sorting => this.sortingChange.emit(sorting),
        pagination: this.paginationState(),
        defaultPagination: { pageIndex: 0, pageSize: this.pageSize() },
        onPaginationChange: pagination => this.paginationChange.emit(pagination),
        manualPagination: this.manualPagination(),
        rowCount: this.rowCount(),
        paginated: this.pagination(),
      });
      this.version.update(v => v + 1);
    });
  }

  protected readonly table = computed(() => {
    this.version();
    return this.store.getTable();
  });
  protected readonly rows = computed(() => this.table().getRowModel().rows);
  protected readonly pageCount = computed(() => this.table().getPageCount());
  protected readonly pageIndex = computed(() => this.table().getState().pagination.pageIndex);
  protected readonly currentPageSize = computed(() => this.table().getState().pagination.pageSize);
  // A reduce rather than Object.fromEntries: the Angular compiler's tsconfig
  // targets an older lib than the other packages and does not declare it.
  protected readonly columnById = computed(() =>
    this.columns().reduce<Record<string, TableColumn<T>>>((all, column) => {
      all[column.id] = column;
      return all;
    }, {})
  );
  protected readonly pageWindow = computed<PageWindowEntry[]>(() =>
    getPageWindow(this.pageIndex() + 1, this.pageCount())
  );
  protected readonly sizeItems = computed(() =>
    this.pageSizeOptions().map(size => ({ value: String(size), label: `${size} / page` }))
  );
  protected readonly summary = computed(() => {
    const total = this.manualPagination()
      ? (this.rowCount() ?? this.data().length)
      : this.data().length;
    if (total === 0) return "No results";
    const start = this.pageIndex() * this.currentPageSize() + 1;
    const end = Math.min((this.pageIndex() + 1) * this.currentPageSize(), total);
    return `${start}–${end} of ${total}`;
  });

  protected sortLabel(sorted: false | "asc" | "desc"): string | null {
    return sorted ? (SORT_LABEL[sorted] ?? null) : null;
  }

  protected cellTemplate(id: string): TemplateRef<unknown> | null {
    return this.templates().find(t => t.ckTableCell() === id)?.template ?? null;
  }
}
