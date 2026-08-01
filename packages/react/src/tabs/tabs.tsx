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
import { createCollection, dataAttr, navigate, type Orientation } from "@crosskit-ui/core";

export type TabsType = "line" | "card";
/** The four sides. The inline ones also flip the root to a row. */
export type TabPosition = "top" | "bottom" | "left" | "right";

export interface TabItem {
  key: string;
  label: ReactNode;
  /** The panel. Named `children` on the item rather than on the Tabs. */
  children?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  type?: TabsType;
  tabPosition?: TabPosition;
  /**
   * Whether arrowing to a tab selects it, or only focuses it.
   *
   * Not part of the API this mirrors, and kept anyway. Both are valid in the
   * ARIA pattern, and
   * `manual` is the one a tab panel that loads something wants — automatic
   * selection would fetch every panel the user arrows past. Removing it would
   * also be a silent removal from v1, which is worse than an extra prop.
   */
  activationMode?: "automatic" | "manual";
  id?: string;
  className?: string;
}

const VERTICAL: TabPosition[] = ["left", "right"];

export function Tabs({
  items,
  activeKey: controlled,
  defaultActiveKey,
  onChange,
  type = "line",
  tabPosition = "top",
  activationMode = "automatic",
  id,
  className,
}: TabsProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const baseId = id ?? autoId;

  const [uncontrolled, setUncontrolled] = useState(defaultActiveKey ?? items[0]?.key ?? "");
  const active = controlled ?? uncontrolled;

  // Focus is tracked apart from selection, because `manual` lets them differ —
  // that is the entire distinction between the two activation modes.
  const [focused, setFocused] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

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

  const select = useCallback(
    (key: string) => {
      if (controlled === undefined) setUncontrolled(key);
      onChange?.(key);
    },
    [controlled, onChange]
  );

  const tabId = (key: string) => `${baseId}-tab-${key}`;
  const panelId = (key: string) => `${baseId}-panel-${key}`;
  const orientation: Orientation = VERTICAL.includes(tabPosition) ? "vertical" : "horizontal";

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const result = navigate(event, collection, focused ?? active, {
      orientation,
      // Read off the DOM rather than taken as a prop: `dir` is set on an
      // ancestor and the browser already resolves inheritance.
      rtl: listRef.current ? getComputedStyle(listRef.current).direction === "rtl" : false,
    });
    if (!result.handled) return;
    event.preventDefault();
    if (result.value === undefined) return;

    setFocused(result.value);
    // Roving tabindex, so the tab that should be focused has to be told to be.
    listRef.current?.querySelector<HTMLElement>(`[id="${tabId(result.value)}"]`)?.focus();
    if (activationMode === "automatic") select(result.value);
  };

  return (
    <div
      data-scope="tabs"
      data-part="root"
      data-orientation={orientation}
      data-type={type}
      data-tab-position={tabPosition}
      className={className}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-orientation={orientation}
        data-scope="tabs"
        data-part="list"
        data-orientation={orientation}
        onKeyDown={onKeyDown}
      >
        {items.map(item => {
          const selected = item.key === active;
          return (
            <button
              key={item.key}
              id={tabId(item.key)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(item.key)}
              // Roving: exactly one tab is in the tab order, so Tab moves past
              // the whole list rather than through it. The focused tab wins
              // over the selected one, which is what `manual` needs.
              tabIndex={(focused ?? active) === item.key ? 0 : -1}
              disabled={item.disabled}
              data-scope="tabs"
              data-part="trigger"
              data-selected={dataAttr(selected)}
              data-disabled={dataAttr(item.disabled)}
              onClick={() => {
                setFocused(item.key);
                select(item.key);
              }}
              onFocus={() => setFocused(item.key)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map(item => (
        <div
          key={item.key}
          id={panelId(item.key)}
          role="tabpanel"
          aria-labelledby={tabId(item.key)}
          // Focusable so a keyboard user can reach panel content that holds no
          // control of its own — the ARIA pattern asks for it, and without it
          // Tab from the tab list skips straight past the panel.
          tabIndex={0}
          hidden={item.key !== active}
          data-scope="tabs"
          data-part="content"
        >
          {item.children}
        </div>
      ))}
    </div>
  );
}
