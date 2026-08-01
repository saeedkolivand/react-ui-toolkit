"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  createCollection,
  createTypeahead,
  dataAttr,
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

  /**
   * Every key the menu answers, wherever focus happens to be.
   *
   * One function rather than one per element, because the menu is operable from
   * two places: normally the content has focus, but a hover-open followed by a
   * press leaves focus on the trigger with the menu open. Two copies of this
   * would be two chances for them to disagree.
   *
   * Takes `open` and `setOpen` as arguments rather than closing over them —
   * the trigger's handler is passed to the hook that produces them, so it
   * cannot refer to its return value.
   */
  const handleMenuKeys = (
    event: KeyboardEvent<HTMLElement>,
    state: { open: boolean; setOpen: (open: boolean) => void }
  ) => {
    const current = state.open ? highlighted : null;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (current) selectKey(current, state.setOpen);
      return;
    }
    // Tab is not handled here. The hook closes on it from either side — a menu
    // is a single stop in the tab order — and closing here as well made one
    // press fire `onOpenChange` twice, because a menu's items are never
    // tabbable so both paths always agreed it was leaving.
    const result = navigate(
      event,
      collection,
      current,
      { orientation: "vertical", typeahead: true },
      typeaheadRef.current
    );
    if (!result.handled) return;
    event.preventDefault();
    if (result.value !== undefined) setHighlighted(result.value);
  };

  const selectKey = (key: string, setOpen: (open: boolean) => void) => {
    const item = menu.items.filter(isItem).find(i => i.key === key);
    if (!item || item.disabled) return;
    menu.onClick?.({ key });
    setOpen(false);
  };

  const anchored = useAnchored({
    ...rest,
    placement,
    trigger,
    arrow,
    disabled,
    takeFocus: true,
    // Reset here rather than in an effect watching `open`: an effect that calls
    // setState re-renders a second time for no visible reason, and this is a
    // plain event callback where setting state is what callbacks are for.
    onOpenChange: details => {
      if (!details.open) setHighlighted(null);
      onOpenChange?.(details);
    },
    onTriggerKeyDown: (event, state) => {
      // Focus can sit on the TRIGGER with the menu already open, and by the most
      // ordinary route there is: the pointer crosses the button, hover opens the
      // menu, and then the user presses it. `trigger="hover"` attaches no click
      // handler, so nothing closes it and nothing moves focus — the press just
      // gives the button DOM focus. Returning early here left every navigation
      // key unanswered by either side, with only Escape working.
      if (state.open) return handleMenuKeys(event, state);

      // Enter, Space and the arrows open a menu button whatever `trigger` says.
      // `trigger` decides which POINTER and focus gestures open it; a menu
      // button answering Enter is inherent to the role, and the hover default
      // this API brings with it would otherwise leave the menu unopenable by
      // keyboard — which is most of the reason to have a menu at all.
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        state.setOpen(true);
        setHighlighted(collection.first()?.value ?? null);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        state.setOpen(true);
        setHighlighted(collection.last()?.value ?? null);
      }
    },
    // The popup IS a menu, whatever the component that opens it is called, and
    // `data-scope` is the CSS contract rather than the component name.
    scope: "menu",
    role: "menu",
  });
  const { open, setOpen, contentId, contentNode } = anchored;

  // Read through `open` so a closed menu never reports a highlight, whatever
  // reset the last close did or did not run — including a controlled consumer
  // flipping `open` themselves, which calls no handler of ours at all.
  const active = open ? highlighted : null;
  const itemId = useCallback((key: string) => `${contentId}-item-${key}`, [contentId]);

  // Focus the menu itself and drive the highlight with `aria-activedescendant`,
  // rather than moving DOM focus from item to item. Both are valid ARIA; this
  // one keeps a single element focused, so closing has exactly one place to
  // restore from — and it is what the stylesheet already assumes, since
  // `data-highlighted` is the only thing it paints.
  //
  // `takeFocus` above does the moving, including declining to on a hover-open:
  // the default trigger IS hover, so grabbing focus whenever the menu appeared
  // would pull the caret out of whatever the user was typing in merely because
  // the pointer crossed the button.
  useEffect(() => {
    if (!open) typeaheadRef.current.clear();
  }, [open]);

  /**
   * Keep the highlighted row visible.
   *
   * `aria-activedescendant` keeps one element focused, which is what makes the
   * highlight announceable from a single node — but it gives up the scrolling
   * that moving real focus would have done for free, and nothing else does it.
   * That only started to bite once the menu began capping its own height
   * against the room available, because the box now scrolls by construction:
   * measured 968px of rows in a 469px box, with `End` putting the highlighted
   * row 462px below the fold and `scrollTop` still 0, so Enter selected
   * something the user could not see.
   *
   * `nearest`, so a row already visible is not yanked to an edge.
   */
  useEffect(() => {
    if (!open || !active || !contentNode) return;
    // Not until the popup is actually positioned. `attachPosition` writes
    // `position: fixed` and the coordinates from `autoUpdate`'s first
    // ResizeObserver callback, which is a frame after this effect can first
    // run — and until then the popup is a portalled block in normal flow at
    // the END of `<body>`, so `scrollIntoView` scrolls the whole document down
    // to it. Measured on Select: a click took `scrollY` from 663 to the
    // document maximum and left the trigger 385px above the viewport.
    //
    // `data-placement` is written in the same call as `left` and `top`, so its
    // presence is the signal that all of them are there — the same barrier the
    // browser specs use before measuring geometry.
    let frame = 0;
    const scrollWhenPlaced = () => {
      // Waits rather than skips: the attribute is not a dependency, so an early
      // return here would never run again once positioning landed.
      if (!contentNode.parentElement?.dataset.placement) {
        frame = requestAnimationFrame(scrollWhenPlaced);
        return;
      }
      contentNode.querySelector(`[id="${itemId(active)}"]`)?.scrollIntoView({ block: "nearest" });
    };
    scrollWhenPlaced();
    return () => cancelAnimationFrame(frame);
  }, [open, active, contentNode, itemId]);

  return (
    <AnchoredView
      anchored={anchored}
      arrow={arrow}
      className={className}
      overlayClassName={overlayClassName}
      contentProps={{
        "aria-activedescendant": active ? itemId(active) : undefined,
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => handleMenuKeys(event, { open, setOpen }),
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
            onClick={() => selectKey(item.key, setOpen)}
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
