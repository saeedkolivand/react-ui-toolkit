"use client";

import { useState, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { dataAttr, hasContent } from "@crosskit-ui/core";
import { Empty } from "../empty/empty";
import { Spinner } from "../spinner/spinner";
import { Pagination, type PaginationProps } from "./pagination";

export type ListSize = "small" | "default" | "large";

export interface ListProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  dataSource: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Keys the rows. Without it the index is used, which reorders badly. */
  rowKey?: (item: T, index: number) => string;
  header?: ReactNode;
  footer?: ReactNode;
  bordered?: boolean;
  size?: ListSize;
  /** Rules between rows. */
  split?: boolean;
  loading?: boolean;
  itemLayout?: "horizontal" | "vertical";
  /** `false` for none. An object is passed through to `Pagination`. */
  pagination?: false | Omit<PaginationProps, "total">;
  /** Replaces the built-in `Empty`. */
  emptyText?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function List<T>({
  dataSource,
  renderItem,
  rowKey,
  header,
  footer,
  bordered = false,
  size = "default",
  split = true,
  loading = false,
  itemLayout = "horizontal",
  pagination = false,
  emptyText,
  className,
  ref,
  ...rest
}: ListProps<T>) {
  // Both halves of the page state, not just the page. `List` passes `pageSize`
  // down, which makes `Pagination` controlled on size — so forwarding
  // `nextSize` without keeping it means the size changer reports the user's
  // choice and then snaps back. A control that rejects its own input is worse
  // than one that is not offered.
  const [uncontrolledPage, setUncontrolledPage] = useState(
    pagination ? (pagination.defaultCurrent ?? 1) : 1
  );
  const [uncontrolledSize, setUncontrolledSize] = useState(
    pagination ? (pagination.defaultPageSize ?? 10) : 10
  );

  const pageSize = pagination ? (pagination.pageSize ?? uncontrolledSize) : 0;
  const pages = Math.max(1, Math.ceil(dataSource.length / Math.max(1, pageSize)));
  // Clamped, for the same reason `Pagination` clamps: `dataSource` is a prop
  // and can shrink under the page. Composition makes it worse than it is
  // there — `Pagination` clamps on read *for display*, so the bar renders a
  // page it was not given while the list slices an empty range and shows
  // nothing, with `empty` false so `Empty` does not catch it either.
  const page = pagination
    ? Math.min(Math.max(1, pagination.current ?? uncontrolledPage), pages)
    : 1;

  // Sliced here rather than by the consumer, because the alternative is every
  // caller reimplementing the same two lines of index maths against a page
  // number this component already owns.
  const visible = pagination
    ? dataSource.slice((page - 1) * pageSize, page * pageSize)
    : dataSource;

  const empty = dataSource.length === 0 && !loading;

  return (
    <div
      ref={ref}
      data-scope="list"
      data-part="root"
      data-size={size}
      data-layout={itemLayout}
      data-bordered={dataAttr(bordered)}
      data-split={dataAttr(split)}
      className={className}
      {...rest}
    >
      {hasContent(header) && <div data-part="header">{header}</div>}

      {loading ? (
        <div data-part="loading">
          <Spinner />
        </div>
      ) : empty ? (
        // `emptyText` given at all wins, including `null` — that is how a
        // caller asks for a list that shows nothing rather than an illustration.
        emptyText === undefined ? (
          <Empty />
        ) : (
          hasContent(emptyText) && <div data-part="empty">{emptyText}</div>
        )
      ) : (
        <ul data-part="list">
          {visible.map((item, index) => (
            <li key={rowKey ? rowKey(item, index) : index} data-part="item">
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      )}

      {hasContent(footer) && <div data-part="footer">{footer}</div>}

      {pagination !== false && !empty && (
        <div data-part="pagination">
          <Pagination
            {...pagination}
            total={dataSource.length}
            current={page}
            pageSize={pageSize}
            onChange={(next, nextSize) => {
              if (pagination.current === undefined) setUncontrolledPage(next);
              if (pagination.pageSize === undefined) setUncontrolledSize(nextSize);
              pagination.onChange?.(next, nextSize);
            }}
          />
        </div>
      )}
    </div>
  );
}

export interface ListItemMetaProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  avatar?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** The usual row shape: something on the left, a title and a line under it. */
export function ListItemMeta({
  avatar,
  title,
  description,
  className,
  ref,
  ...rest
}: ListItemMetaProps) {
  return (
    <div ref={ref} data-scope="list" data-part="meta" className={className} {...rest}>
      {hasContent(avatar) && <div data-part="meta-avatar">{avatar}</div>}
      <div data-part="meta-content">
        {hasContent(title) && <div data-part="meta-title">{title}</div>}
        {hasContent(description) && <div data-part="meta-description">{description}</div>}
      </div>
    </div>
  );
}

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Row-level controls, rendered at the end. */
  actions?: ReactNode[];
  extra?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/** Optional: `renderItem` can return anything. This is the conventional row. */
export function ListItem({ actions, extra, children, className, ref, ...rest }: ListItemProps) {
  return (
    <div ref={ref} data-scope="list" data-part="item-content" className={className} {...rest}>
      <div data-part="item-main">{children}</div>
      {hasContent(actions) && (
        <ul data-part="actions">
          {actions!.map((action, index) => (
            <li key={index} data-part="action">
              {action}
            </li>
          ))}
        </ul>
      )}
      {hasContent(extra) && <div data-part="extra">{extra}</div>}
    </div>
  );
}

List.Item = Object.assign(ListItem, { Meta: ListItemMeta });
