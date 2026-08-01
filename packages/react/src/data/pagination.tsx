"use client";

import { useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from "react";
import { dataAttr, getPageWindow, PAGE_ELLIPSIS } from "@crosskit-ui/core";
import { useConfig } from "../config/config-provider";
import { Icon } from "../icon/icon";
import { Select } from "../select/select";

export type PaginationSize = "small" | "default";

export interface PaginationProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "onChange" | "children"
> {
  /** Total number of *items*, not pages — the page count is derived. */
  total: number;
  current?: number;
  defaultCurrent?: number;
  pageSize?: number;
  defaultPageSize?: number;
  onChange?: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  /** `(total, [from, to]) => node`, for "1–10 of 240". */
  showTotal?: (total: number, range: [number, number]) => ReactNode;
  /** How many pages sit either side of the current one before an ellipsis. */
  siblings?: number;
  size?: PaginationSize;
  disabled?: boolean;
  /** Render nothing when everything fits on one page. */
  hideOnSinglePage?: boolean;
  ref?: Ref<HTMLElement>;
}

const clamp = (page: number, pages: number) => Math.min(Math.max(1, page), Math.max(1, pages));

export function Pagination({
  total,
  current: controlled,
  defaultCurrent = 1,
  pageSize: controlledSize,
  defaultPageSize = 10,
  onChange,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  showQuickJumper = false,
  showTotal,
  siblings = 1,
  size = "default",
  disabled = false,
  hideOnSinglePage = false,
  className,
  ref,
  "aria-label": ariaLabel = "Pagination",
  ...rest
}: PaginationProps) {
  const { locale } = useConfig();
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultCurrent);
  const [uncontrolledSize, setUncontrolledSize] = useState(defaultPageSize);
  const [jump, setJump] = useState("");

  const pageSize = controlledSize ?? uncontrolledSize;
  const pages = Math.max(1, Math.ceil(total / Math.max(1, pageSize)));
  // Clamped on read, not only on write. `total` and `pageSize` are props, so
  // shrinking either can strand a current page past the end without anything
  // calling `go` — and an out-of-range page renders a window with nothing
  // marked current.
  const page = clamp(controlled ?? uncontrolledPage, pages);

  const go = (next: number, nextSize = pageSize) => {
    const target = clamp(next, Math.max(1, Math.ceil(total / Math.max(1, nextSize))));
    if (controlled === undefined) setUncontrolledPage(target);
    if (controlledSize === undefined && nextSize !== pageSize) setUncontrolledSize(nextSize);
    onChange?.(target, nextSize);
  };

  const onJump = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const parsed = Number.parseInt(jump, 10);
    if (Number.isNaN(parsed)) return;
    go(parsed);
    setJump("");
  };

  // The current size, offered whether or not the caller listed it. `Select`
  // resolves its display text by looking the value up in `options`, so a size
  // outside them renders the placeholder while the list pages by it — the
  // control disagreeing with the thing it controls.
  const sizes = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  if (hideOnSinglePage && pages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      data-scope="pagination"
      data-part="root"
      data-size={size}
      data-disabled={dataAttr(disabled)}
      className={className}
      {...rest}
    >
      {showTotal && <div data-part="total">{showTotal(total, [from, to])}</div>}

      <ul data-part="list">
        <li>
          <button
            type="button"
            data-part="prev"
            aria-label={locale.Pagination.previous}
            disabled={disabled || page <= 1}
            onClick={() => go(page - 1)}
          >
            <Icon name="chevronLeft" size="sm" />
          </button>
        </li>

        {getPageWindow(page, pages, siblings).map((entry, index) =>
          entry === PAGE_ELLIPSIS ? (
            // Not a button, and not announced: it is a gap in the sequence
            // rather than a control, and "ellipsis" read between two page
            // numbers is noise.
            <li key={`gap-${index}`} data-part="ellipsis" aria-hidden="true">
              {PAGE_ELLIPSIS}
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                data-part="item"
                data-selected={dataAttr(entry === page)}
                // `aria-current="page"` is what says *which* page you are on;
                // the visual treatment alone says it to nobody.
                aria-current={entry === page ? "page" : undefined}
                disabled={disabled}
                onClick={() => go(entry)}
              >
                {entry}
              </button>
            </li>
          )
        )}

        <li>
          <button
            type="button"
            data-part="next"
            aria-label={locale.Pagination.next}
            disabled={disabled || page >= pages}
            onClick={() => go(page + 1)}
          >
            <Icon name="chevronRight" size="sm" />
          </button>
        </li>
      </ul>

      {showSizeChanger && (
        // Wrapped, and named through `Select`'s own `label`. Passing
        // `data-part` or `aria-label` straight to `Select` looks like it works
        // and does not: its `...rest` feeds `useAnchored` rather than the DOM,
        // so both vanish without a typecheck error and the combobox ships with
        // no accessible name at all. The label is visually hidden in
        // `data.css`, since the options already read "10 / per page".
        <div data-part="size-changer">
          <Select
            size={size === "small" ? "small" : "middle"}
            disabled={disabled}
            value={String(pageSize)}
            label={locale.Pagination.perPage}
            options={sizes.map(option => ({
              value: String(option),
              label: `${option} / ${locale.Pagination.perPage}`,
            }))}
            // Back to page one, because page 9 of 24 is page 3 of 8 at a bigger
            // size and there is no honest way to say which row you were looking
            // at. Landing past the end would be worse.
            onChange={value => go(1, Number(value))}
          />
        </div>
      )}

      {showQuickJumper && (
        <div data-part="jumper">
          <label data-part="jumper-label">
            {locale.Pagination.jumpTo}
            <input
              type="text"
              inputMode="numeric"
              data-part="jumper-input"
              disabled={disabled}
              value={jump}
              onChange={event => setJump(event.target.value)}
              onKeyDown={onJump}
            />
          </label>
        </div>
      )}
    </nav>
  );
}
