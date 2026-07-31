"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  contains,
  createCollection,
  createTypeahead,
  dataAttr,
  getTabbables,
  navigate,
  type IconName,
  type Placement,
  type PlacementAlias,
} from "@crosskit-ui/core";
import { Icon } from "../icon/icon";
import { AnchoredView } from "../anchored/anchored";
import { useAnchored, type TriggerKind } from "../anchored/use-anchored";

export interface DropdownMenuItem {
  key: string;
  label: ReactNode;
  icon?: IconName;
  disabled?: boolean;
  /** Renders in the danger colour. */
  danger?: boolean;
}

/**
 * A rule between items. A separate type rather than an optional `type` on
 * `DropdownMenuItem`, so `{ type: "divider" }` does not have to carry a `key`
 * and a `label` it has no use for — which is what a single interface would
 * require, and what would push every consumer into writing `key: ""`.
 */
export interface DropdownMenuDivider {
  type: "divider";
  /** Optional, and only so React has something stable to key on. */
  key?: string;
}

export type DropdownMenuEntry = DropdownMenuItem | DropdownMenuDivider;

export interface DropdownMenuProps {
  items: DropdownMenuEntry[];
  onClick?: (info: { key: string }) => void;
}

export interface DropdownProps {
  /**
   * An object rather than the items directly, so the menu can grow props of its
   * own without competing with the trigger's.
   */
  menu: DropdownMenuProps;
  /**
   * The trigger, rendered as given. Dropdown never wraps it in a button, so a
   * consumer's own `<Button>` stays exactly one button rather than two nested.
   */
  children: ReactNode;
  placement?: PlacementAlias | Placement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  trigger?: TriggerKind | TriggerKind[];
  /** SECONDS. */
  mouseEnterDelay?: number;
  /** SECONDS. */
  mouseLeaveDelay?: number;
  disabled?: boolean;
  arrow?: boolean;
  overlayClassName?: string;
  /** Lands on the trigger wrapper, which is this component's root. */
  className?: string;
  id?: string;
}

const isDivider = (entry: DropdownMenuEntry): entry is DropdownMenuDivider =>
  "type" in entry && entry.type === "divider";

/** The narrowing half. `filter(e => !isDivider(e))` does not narrow on its own. */
const isItem = (entry: DropdownMenuEntry): entry is DropdownMenuItem => !isDivider(entry);

/** What typeahead matches on. A non-string label has nothing to search. */
const labelText = (label: ReactNode) => (typeof label === "string" ? label : "");

export function Dropdown({
  menu,
  children,
  placement = "bottomLeft",
  trigger = "hover",
  arrow = false,
  disabled,
  overlayClassName,
  className,
  onOpenChange,
  ...rest
}: DropdownProps) {
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const typeaheadRef = useRef(createTypeahead());

  const collection = useMemo(
    () =>
      createCollection(
        menu.items.filter(isItem).map(item => ({
          value: item.key,
          label: labelText(item.label),
          disabled: item.disabled,
        }))
      ),
    [menu.items]
  );

  const anchored = useAnchored({
    ...rest,
    placement,
    trigger,
    arrow,
    disabled,
    // Reset here rather than in an effect watching `open`: an effect that calls
    // setState re-renders a second time for no visible reason, and this is a
    // plain event callback where setting state is what callbacks are for.
    onOpenChange: details => {
      if (!details.open) setHighlighted(null);
      onOpenChange?.(details);
    },
    onTriggerKeyDown: (event, { open, setOpen }) => {
      if (open) return;
      // Enter, Space and the arrows open a menu button whatever `trigger` says.
      // `trigger` decides which POINTER and focus gestures open it; a menu
      // button answering Enter is inherent to the role, and the hover default
      // this API brings with it would otherwise leave the menu unopenable by
      // keyboard — which is most of the reason to have a menu at all.
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
        setHighlighted(collection.first()?.value ?? null);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setOpen(true);
        setHighlighted(collection.last()?.value ?? null);
      }
    },
    // The popup IS a menu, whatever the component that opens it is called, and
    // `data-scope` is the CSS contract rather than the component name.
    scope: "menu",
    role: "menu",
  });
  const { open, setOpen, contentId, contentNode, triggerNode } = anchored;

  // Read through `open` so a closed menu never reports a highlight, whatever
  // reset the last close did or did not run — including a controlled consumer
  // flipping `open` themselves, which calls no handler of ours at all.
  const active = open ? highlighted : null;
  const itemId = (key: string) => `${contentId}-item-${key}`;

  // Focus the menu itself and drive the highlight with `aria-activedescendant`,
  // rather than moving DOM focus from item to item. Both are valid ARIA; this
  // one keeps a single element focused, so closing has exactly one place to
  // restore from — and it is what the stylesheet already assumes, since
  // `data-highlighted` is the only thing it paints.
  //
  // Restoring is the other half, and it is not optional: taking focus on open
  // and dropping it on close leaves `document.body` focused, so the next Tab
  // restarts at the top of the page rather than after the menu the user was
  // just in.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      contentNode?.focus({ preventScroll: true });
      return;
    }
    typeaheadRef.current.clear();
    // Guarded on having been open, or the first mount would pull focus to a
    // trigger nobody touched.
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    // Only when focus is still inside the menu — the same rule `createFocusTrap`
    // applies, and deliberately not a looser one. A press outside has already
    // moved focus, so restoring would take it back from wherever the user just
    // put it. At this point the content is still mounted, because presence
    // outlives `open`.
    if (!contentNode || !contains(contentNode, document.activeElement)) return;
    const target = triggerNode ? (getTabbables(triggerNode)[0] ?? triggerNode) : null;
    target?.focus({ preventScroll: true });
  }, [open, contentNode, triggerNode]);

  const select = (key: string) => {
    const item = menu.items.filter(isItem).find(i => i.key === key);
    if (!item || item.disabled) return;
    menu.onClick?.({ key });
    setOpen(false);
  };

  const onContentKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (active) select(active);
      return;
    }
    if (event.key === "Tab") {
      // Tab out closes rather than stepping through the items: a menu is a
      // single stop in the tab order. The dismissable layer would catch the
      // focus leaving anyway, but doing it here keeps the close synchronous
      // with the key rather than one focus event later.
      setOpen(false);
      return;
    }
    const result = navigate(
      event,
      collection,
      active,
      { orientation: "vertical", typeahead: true },
      typeaheadRef.current
    );
    if (!result.handled) return;
    event.preventDefault();
    if (result.value !== undefined) setHighlighted(result.value);
  };

  return (
    <AnchoredView
      anchored={anchored}
      arrow={arrow}
      className={className}
      overlayClassName={overlayClassName}
      contentProps={{
        tabIndex: -1,
        "aria-activedescendant": active ? itemId(active) : undefined,
        onKeyDown: onContentKeyDown,
      }}
      body={menu.items.map((item, index) =>
        isDivider(item) ? (
          // A divider carries no identity and no state, so its position IS its
          // identity — there is nothing else to key on.
          // eslint-disable-next-line @eslint-react/no-array-index-key
          <hr key={`divider-${index}`} data-scope="menu" data-part="separator" />
        ) : (
          <div
            key={item.key}
            id={itemId(item.key)}
            role="menuitem"
            data-scope="menu"
            data-part="item"
            data-highlighted={dataAttr(active === item.key)}
            data-disabled={dataAttr(item.disabled)}
            data-danger={dataAttr(item.danger)}
            aria-disabled={item.disabled ? "true" : undefined}
            // `onPointerMove`, not `onPointerEnter`: entering fires once, so a
            // keyboard press that scrolls a different row under a stationary
            // cursor would leave the highlight stuck on whatever it is over.
            onPointerMove={() => !item.disabled && setHighlighted(item.key)}
            onClick={() => select(item.key)}
          >
            {item.icon && <Icon name={item.icon} size="sm" />}
            {item.label}
          </div>
        )
      )}
    >
      {children}
    </AnchoredView>
  );
}
