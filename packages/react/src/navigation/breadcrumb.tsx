// Server-safe unless an item carries onClick, which is the consumer's own handler.
import { Fragment, type HTMLAttributes, type ReactNode, type Ref } from "react";
import { dataAttr, hasContent } from "@crosskit-ui/core";

export interface BreadcrumbItem {
  title: ReactNode;
  href?: string;
  onClick?: () => void;
  /** Distinguishes two items with the same title; falls back to the index. */
  key?: string;
}

// `title` collides with the DOM tooltip attribute; `children` is omitted
// because the content comes from `items`.
export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "children"> {
  items: BreadcrumbItem[];
  /** Rendered between items and hidden from assistive tech. */
  separator?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export function Breadcrumb({
  items,
  separator = "/",
  className,
  ref,
  "aria-label": ariaLabel = "Breadcrumb",
  ...rest
}: BreadcrumbProps) {
  return (
    // A landmark, so a screen reader can jump to it and skip it. The list is
    // ordered because the steps are a path, not a set.
    <nav
      ref={ref}
      aria-label={ariaLabel}
      data-scope="breadcrumb"
      data-part="root"
      className={className}
      {...rest}
    >
      <ol data-part="list">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <Fragment key={item.key ?? index}>
              {index > 0 && hasContent(separator) && (
                // In its own list item rather than inside the previous one:
                // a separator read out as part of the label turns "Settings"
                // into "Settings slash".
                <li data-part="separator" aria-hidden="true">
                  {separator}
                </li>
              )}
              <li data-part="item" data-current={dataAttr(last)}>
                {/* Three cases, not two. The last crumb is where you already
                    are, so it is text rather than a link and `aria-current`
                    says so without relying on it looking different. An item
                    with only `onClick` is a button, not an anchor: an `<a>`
                    with no `href` is not focusable and takes no Enter, so the
                    handler would be mouse-only. */}
                {last ? (
                  <span data-part="label" aria-current="page">
                    {item.title}
                  </span>
                ) : item.href !== undefined ? (
                  <a data-part="link" href={item.href} onClick={item.onClick}>
                    {item.title}
                  </a>
                ) : item.onClick !== undefined ? (
                  <button type="button" data-part="link" onClick={item.onClick}>
                    {item.title}
                  </button>
                ) : (
                  <span data-part="label">{item.title}</span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
