"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createCollection, dataAttr, navigate } from "@crosskit-ui/core";
import { Icon } from "../icon/icon";

export interface CollapseItem {
  key: string;
  label: ReactNode;
  /** The panel. Named `children` on the item rather than on the Collapse. */
  children?: ReactNode;
  disabled?: boolean;
}

export interface CollapseProps {
  items: CollapseItem[];
  /** Open panels. A bare string is accepted for the single-panel case. */
  activeKey?: string | string[];
  defaultActiveKey?: string | string[];
  /** Always the full open set, even in `accordion` mode where it holds one. */
  onChange?: (key: string[]) => void;
  /** Only one panel open at a time. The widget pattern
   *  the `data-scope` is named after. */
  accordion?: boolean;
  id?: string;
  className?: string;
}

const toArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

export function Collapse({
  items,
  activeKey: controlled,
  defaultActiveKey,
  onChange,
  accordion = false,
  id,
  className,
}: CollapseProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const baseId = id ?? autoId;

  const [uncontrolled, setUncontrolled] = useState(() => toArray(defaultActiveKey));
  const open = useMemo(
    () => (controlled === undefined ? uncontrolled : toArray(controlled)),
    [controlled, uncontrolled]
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const collection = useMemo(
    () =>
      createCollection(
        items.map(item => ({
          value: item.key,
          label: typeof item.label === "string" ? item.label : "",
          disabled: item.disabled,
        }))
      ),
    [items]
  );

  const toggle = useCallback(
    (key: string) => {
      const isOpen = open.includes(key);
      // In accordion mode opening one closes the rest, and the open one can
      // still be closed — a set with nothing in it is a legitimate state.
      const next = accordion
        ? isOpen
          ? []
          : [key]
        : isOpen
          ? open.filter(k => k !== key)
          : [...open, key];
      if (controlled === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [accordion, controlled, onChange, open]
  );

  const headerId = (key: string) => `${baseId}-header-${key}`;
  const panelId = (key: string) => `${baseId}-panel-${key}`;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    // Vertical only: the headers are stacked, so Left and Right belong to the
    // text inside them rather than to the widget.
    const result = navigate(event, collection, focused, { orientation: "vertical" });
    if (!result.handled || result.value === undefined) return;
    event.preventDefault();
    setFocused(result.value);
    rootRef.current?.querySelector<HTMLElement>(`[id="${headerId(result.value)}"]`)?.focus();
  };

  return (
    <div ref={rootRef} data-scope="accordion" data-part="root" className={className}>
      {items.map(item => {
        const isOpen = open.includes(item.key);
        const state = isOpen ? "open" : "closed";
        return (
          <div key={item.key} data-scope="accordion" data-part="item" data-state={state}>
            {/* A heading, so the panels are navigable as landmarks by a screen
                reader rather than being an undifferentiated run of buttons. */}
            <h3 data-scope="accordion" data-part="item-heading">
              <button
                id={headerId(item.key)}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId(item.key)}
                disabled={item.disabled}
                data-scope="accordion"
                data-part="item-trigger"
                data-state={state}
                data-disabled={dataAttr(item.disabled)}
                onClick={() => {
                  setFocused(item.key);
                  toggle(item.key);
                }}
                onFocus={() => setFocused(item.key)}
                onKeyDown={onKeyDown}
              >
                {item.label}
                {/* Rotates off `data-state`, so nothing toggles a class.
                    
                    No `data-scope` here, deliberately. `Icon` spreads its rest
                    props last — rule 3, so a consumer can override anything —
                    which means passing one REPLACES the svg's own
                    `data-scope="icon"`, and `icon.css` keys every bit of icon
                    presentation off that alone. The chevron rendered as an
                    866px black block. The stylesheet does not need it either:
                    the rule is `[data-scope="accordion"] [data-part=…]`, a
                    descendant selector already satisfied by the root. */}
                <Icon name="chevronDown" size="sm" data-part="item-indicator" data-state={state} />
              </button>
            </h3>
            <div
              id={panelId(item.key)}
              role="region"
              aria-labelledby={headerId(item.key)}
              hidden={!isOpen}
              data-scope="accordion"
              data-part="item-content"
              data-state={state}
            >
              {item.children}
            </div>
          </div>
        );
      })}
    </div>
  );
}
