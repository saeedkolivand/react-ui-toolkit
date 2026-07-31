"use client";

/**
 * The wiring every anchored overlay needs, over the primitives in `core`.
 *
 * Tooltip, Popover and Dropdown differ in their markup, their ARIA role and
 * almost nothing else: all three anchor a floating box to a trigger, open on
 * some mix of hover, focus and click, keep a node mounted through its exit
 * animation, and dismiss on Escape or a press outside. This is where that lives,
 * so the three cannot drift apart in the parts a user can observe.
 *
 * The sibling of `dialog/use-overlay.ts`, and deliberately not merged with it.
 * A modal overlay traps focus, locks scroll and inerts the page; an anchored one
 * does none of those and instead tracks an anchor across scroll and resize. The
 * two share `createPresence` and `pushDismissable` and disagree about everything
 * else, so one hook would be a flag soup.
 *
 * It returns plain objects rather than rendering anything, so each caller
 * spreads them onto whatever markup it needs.
 */

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  attachPosition,
  contains,
  createPresence,
  isFocusVisible,
  pushDismissable,
  type Placement,
  type PlacementAlias,
  type Presence,
} from "@crosskit-ui/core";

/** Ant's trigger vocabulary. `contextMenu` is deliberately absent — see below. */
export type TriggerKind = "hover" | "focus" | "click";

export interface AnchoredOptions {
  /** Controlled. Leave undefined and the overlay manages its own state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  /** Accepts the twelve camelCase names — `topLeft`, `bottomRight`, … */
  placement?: PlacementAlias | Placement;
  trigger?: TriggerKind | TriggerKind[];
  /**
   * SECONDS, not milliseconds, and named for the pointer rather than for what
   * they do. Both are inherited rather than corrected: a consumer pasting
   * `mouseEnterDelay={0.5}` from elsewhere must get half a second, and a prop
   * that silently means something else at the same name is worse than an
   * awkward one. The conversion happens once, here.
   */
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  /** No trigger opens it, and an already-open overlay closes. */
  disabled?: boolean;
  arrow?: boolean;
  /** Gap between the trigger and the floating box, in pixels. */
  offset?: number;
  /**
   * Runs after the trigger's own Escape handling, for keys a particular overlay
   * owns — a menu button's Enter and arrows. Composed here rather than by the
   * caller spreading over `triggerProps`, because an override that forgets to
   * call through silently drops Escape.
   *
   * Handed the open state it would otherwise have to read back off this hook's
   * own return value, which the caller cannot do without referring to a
   * binding that does not exist yet.
   */
  onTriggerKeyDown?: (
    event: ReactKeyboardEvent<HTMLElement>,
    state: { open: boolean; setOpen: (open: boolean) => void }
  ) => void;
  /** The `data-scope` all parts carry, and the CSS contract. */
  scope: string;
  /**
   * Drives which ARIA the trigger gets, because the three differ: a tooltip
   * *describes* its trigger, while a menu or a popover is a thing the trigger
   * *opens*.
   */
  role: "tooltip" | "menu" | "dialog";
  id?: string;
}

type Div = HTMLAttributes<HTMLElement> & Record<`data-${string}`, string | undefined>;

export interface Anchored {
  /** Whether to render at all. Gates on presence, never on `open`. */
  present: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  /**
   * The mounted content element, for a caller that has to focus or measure it.
   * Exposed so nobody has to thread a second ref through `contentProps` and
   * remember to call ours as well.
   */
  contentNode: HTMLElement | null;
  /** The trigger wrapper, for a caller that has to give focus back to it. */
  triggerNode: HTMLElement | null;
  triggerProps: Div & { ref: (node: HTMLElement | null) => void };
  /**
   * The ARIA that has to sit on the element the user actually focuses, which is
   * the consumer's own child rather than our wrapper.
   *
   * `aria-describedby` on a span wrapping a button describes the span, and a
   * screen reader announcing the focused button never reads it — so a tooltip
   * that looked correct in the DOM would be silent in the only place it
   * matters. Kept separate from `triggerProps` so the caller can put each on
   * the right element, and it is attributes only: no ref, no handlers, so
   * cloning it onto a child cannot clobber either.
   */
  triggerAria: Record<string, string | undefined>;
  positionerProps: Div & { ref: (node: HTMLElement | null) => void };
  contentProps: Div & { ref: (node: HTMLElement | null) => void };
  arrowProps: Div;
}

const ARROW_SIZE = 8;

/** Seconds in, milliseconds out. Ant's unit is the public one; ours is the timer's. */
const ms = (seconds: number) => Math.max(0, seconds) * 1000;

export function useAnchored(options: AnchoredOptions): Anchored {
  const {
    open: controlled,
    defaultOpen = false,
    onOpenChange,
    placement = "top",
    trigger = "hover",
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    disabled = false,
    arrow = true,
    offset = 8,
    onTriggerKeyDown,
    scope,
    role,
    id,
  } = options;

  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const contentId = id ?? autoId;

  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  // Derived, not pushed through an effect that closes it. An effect would
  // render the overlay open for one frame first — a tooltip whose title just
  // became empty would flash an empty box — and it would fight a controlled
  // `open` by calling back with a value the consumer did not ask for.
  const open = (controlled ?? uncontrolled) && !disabled;

  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [positioner, setPositioner] = useState<HTMLElement | null>(null);
  const [content, setContent] = useState<HTMLElement | null>(null);

  const kinds = useMemo(() => (Array.isArray(trigger) ? trigger : [trigger]), [trigger]);
  const on = useCallback((kind: TriggerKind) => kinds.includes(kind), [kinds]);

  // Read through a ref inside effects and timers so neither re-subscribes when
  // a consumer passes a new inline function every render — the same reason
  // `use-overlay` does it, and the reason the position effect below can depend
  // on `open` without tearing down on every parent render.
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next);
      onOpenChangeRef.current?.({ open: next });
    },
    [controlled]
  );

  // ---------------------------------------------------------------- presence

  const [present, setPresent] = useState(open);
  // A lazy `useState` initialiser rather than a ref assigned during render:
  // reading and writing a ref while rendering is not safe under concurrent
  // rendering, and it is what `use-overlay` does for the same object.
  const [presence] = useState<Presence>(() => createPresence(open, { onChange: setPresent }));

  useEffect(() => presence.setNode(content), [presence, content]);
  useEffect(() => presence.setOpen(open), [presence, open]);
  useEffect(() => () => presence.destroy(), [presence]);

  // ------------------------------------------------------------------ delays

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cancel = useCallback(() => {
    if (timerRef.current !== undefined) clearTimeout(timerRef.current);
    timerRef.current = undefined;
  }, []);
  // Every scheduled change goes through here, so opening cancels a pending
  // close and vice versa. Without that, crossing the gap between trigger and
  // popup — which fires leave then enter — would close it a beat later.
  const schedule = useCallback(
    (next: boolean, delay: number) => {
      cancel();
      if (delay === 0) return setOpen(next);
      timerRef.current = setTimeout(() => setOpen(next), delay);
    },
    [cancel, setOpen]
  );
  useEffect(() => cancel, [cancel]);

  // --------------------------------------------------------------- behaviour

  useEffect(() => {
    if (!open || !anchor || !positioner || !content) return;
    // Two separate concerns, one effect, because both need the same nodes and
    // the same lifetime — and splitting them would let a re-run order them
    // differently on different renders.
    const stop = attachPosition(anchor, positioner, {
      placement,
      offset,
      arrow: arrow ? { size: ARROW_SIZE, padding: 4 } : undefined,
    });
    const removeLayer = pushDismissable(() => content, {
      onDismiss: () => {
        cancel();
        setOpen(false);
      },
      // The trigger is outside the content and must not count as outside, or
      // clicking to close would dismiss and immediately reopen.
      exclude: () => [anchor],
      // True, unlike a dialog's: these are the layers that own focus while open
      // and mean nothing once they lose it. Tab out of a menu and it should go.
      focus: true,
    });
    return () => {
      stop();
      removeLayer();
    };
  }, [open, anchor, positioner, content, placement, offset, arrow, cancel, setOpen]);

  // ------------------------------------------------------------------- props

  const hover = on("hover");
  const focus = on("focus");
  const click = on("click");

  const triggerProps: Anchored["triggerProps"] = {
    ref: setAnchor,
    "data-scope": scope,
    "data-part": "trigger",
    "data-state": open ? "open" : "closed",
  };

  // A tooltip DESCRIBES its trigger; a menu or a popover is something the
  // trigger OPENS. Wiring both would have a screen reader read the popup's
  // entire contents as the button's description.
  const triggerAria: Anchored["triggerAria"] =
    role === "tooltip"
      ? { "aria-describedby": open ? contentId : undefined }
      : {
          "aria-haspopup": role,
          // The one place `="false"` is correct, and deliberately not
          // `ariaAttr`. The presence-attribute rule is about `data-*`, where
          // "false" matches `[data-x]` in CSS. `aria-expanded` is a tri-state in
          // the ARIA spec: absent means "not expandable", which is a different
          // statement from "expandable, currently collapsed" — and a collapsed
          // menu button that omits it is announced as if it opened nothing.
          "aria-expanded": open ? "true" : "false",
          "aria-controls": open ? contentId : undefined,
        };

  if (!disabled) {
    if (hover) {
      triggerProps.onPointerEnter = event => {
        // A tap fires pointerenter and never fires a matching pointerleave, so
        // opening on it would produce an overlay nothing could close. Touch is
        // handled by the tap-to-toggle below instead.
        if (event.pointerType === "touch") return;
        schedule(true, ms(mouseEnterDelay));
      };
      triggerProps.onPointerLeave = event => {
        if (event.pointerType === "touch") return;
        schedule(false, ms(mouseLeaveDelay));
      };
    }

    // Tap to toggle, for hover overlays a pointer alone can never reach.
    //
    // A touch device has no hover state to enter, and the focus path is no help
    // either: it is gated on `isFocusVisible`, which is false for focus a
    // pointer moved. So without this a tap dispatches pointerenter(touch) —
    // ignored just above — and then a click nothing is listening for, and the
    // overlay never opens at all. A tooltip a touch user cannot read is a
    // degradation; a menu they cannot open is a dead control, and hover is its
    // default.
    //
    // Only when `click` is absent, or the two would both fire and cancel out.
    if (hover && !click) {
      triggerProps.onPointerUp = event => {
        if (event.pointerType !== "touch") return;
        schedule(!open, 0);
      };
    }

    if (focus) {
      triggerProps.onFocus = event => {
        // Only keyboard focus. Without this a click on the trigger opens it
        // twice over — once for the press, once for the focus the press moved —
        // and a hover overlay pops back up the moment the pointer leaves.
        if (isFocusVisible(event.target)) schedule(true, 0);
      };
      triggerProps.onBlur = event => {
        // Focus moving INTO the popup is not focus leaving. Reading
        // relatedTarget rather than checking on the next tick keeps this
        // synchronous, which is what stops the menu closing under a click on
        // its own first item.
        if (content && contains(content, event.relatedTarget as Node | null)) return;
        schedule(false, 0);
      };
    }

    if (click) {
      triggerProps.onClick = () => schedule(!open, 0);
    }

    // Escape while focus is still on the trigger. The dismissable layer only
    // sees keys once focus is inside the content, which for a hover tooltip it
    // never is.
    triggerProps.onKeyDown = event => {
      if (event.key === "Escape" && open) {
        cancel();
        setOpen(false);
        return;
      }
      onTriggerKeyDown?.(event, { open, setOpen });
    };
  }

  const positionerProps: Anchored["positionerProps"] = {
    ref: setPositioner,
    "data-scope": scope,
    "data-part": "positioner",
    // The positioner is what `applyPosition` writes `position: fixed` and
    // coordinates onto, so it must portal to document.body — an ancestor with a
    // transform, filter or contain:paint would otherwise become its containing
    // block and the popup would land somewhere else entirely.
  };

  const contentProps: Anchored["contentProps"] = {
    ref: setContent,
    id: contentId,
    role,
    "data-scope": scope,
    "data-part": "content",
    "data-state": open ? "open" : "closed",
  };

  // Hovering the popup itself keeps it open, and leaving it closes it on the
  // same delay as the trigger. Without this every popover with a link in it
  // would vanish on the way to the link.
  if (hover && !disabled) {
    contentProps.onPointerEnter = () => cancel();
    contentProps.onPointerLeave = event => {
      if (event.pointerType === "touch") return;
      schedule(false, ms(mouseLeaveDelay));
    };
  }

  const arrowProps: Div = {
    "data-scope": scope,
    "data-part": "arrow",
    "aria-hidden": "true",
  };

  return {
    present,
    open,
    setOpen,
    contentId,
    contentNode: content,
    triggerNode: anchor,
    triggerProps,
    triggerAria,
    positionerProps,
    contentProps,
    arrowProps,
  };
}
