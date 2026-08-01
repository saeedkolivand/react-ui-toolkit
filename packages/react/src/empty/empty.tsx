// Reads locale from context, so it is a client component despite static markup.
"use client";

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { hasContent } from "@crosskit-ui/core";
import { useConfig } from "../config/config-provider";

/**
 * The two built-in illustrations.
 *
 * Both are decorative — the description carries the meaning — so they are
 * `aria-hidden` and drawn in `currentColor`, which is what lets a consumer
 * recolour them with nothing but `color` on an ancestor.
 */
export const PRESENTED_IMAGE_DEFAULT = (
  <svg viewBox="0 0 64 41" aria-hidden="true" focusable="false" data-part="illustration">
    <ellipse cx="32" cy="33" rx="32" ry="7" fill="currentColor" opacity=".06" />
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M19 5h26l7 16v9a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3v-9z" />
      <path d="M12 21h12l2 4h12l2-4h12" />
    </g>
  </svg>
);

export const PRESENTED_IMAGE_SIMPLE = (
  <svg viewBox="0 0 64 41" aria-hidden="true" focusable="false" data-part="illustration">
    <ellipse cx="32" cy="33" rx="32" ry="7" fill="currentColor" opacity=".06" />
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="15" y="9" width="34" height="21" rx="3" />
      <path d="M15 20h34" />
    </g>
  </svg>
);

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Defaults to the locale's string. `null` or `false` removes it entirely. */
  description?: ReactNode;
  /** A node, or a URL string rendered as an `<img>`. */
  image?: ReactNode;
  imageStyle?: CSSProperties;
  /** Rendered below the description — usually the action that fills the void. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function Empty({
  description,
  image = PRESENTED_IMAGE_DEFAULT,
  imageStyle,
  children,
  className,
  ref,
  ...rest
}: EmptyProps) {
  const { locale } = useConfig();

  // `undefined` means "not specified" and takes the locale string; `null` and
  // `false` are how you ask for no description at all. Collapsing the two would
  // make an explicitly empty state impossible to express — which is why this is
  // an `=== undefined` check rather than `hasContent`, the opposite question.
  const text = description === undefined ? locale.Empty.description : description;

  return (
    <div ref={ref} data-scope="empty" data-part="root" className={className} {...rest}>
      <div data-part="image" style={imageStyle}>
        {typeof image === "string" ? <img src={image} alt="" data-part="illustration" /> : image}
      </div>
      {hasContent(text) && <div data-part="description">{text}</div>}
      {hasContent(children) && <div data-part="footer">{children}</div>}
    </div>
  );
}

Empty.PRESENTED_IMAGE_DEFAULT = PRESENTED_IMAGE_DEFAULT;
Empty.PRESENTED_IMAGE_SIMPLE = PRESENTED_IMAGE_SIMPLE;
