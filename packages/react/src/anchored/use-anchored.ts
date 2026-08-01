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
  getTabbables,
  isFocusVisible,
  pushDismissable,
  type Placement,
  type PlacementAlias,
  type Presence,
} from "@crosskit-ui/core";

/** The trigger vocabulary. `contextMenu` is deliberately absent — see below. */
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
  /**
   * Move focus into the content when it opens, and hand it back on close.
   *
   * For the overlays whose contents are meant to be operated — a menu, a
   * popover with controls in it. Without it a portalled popup is unreachable:
   * Tab order follows DOM order, and the popup is a body sibling at the end of
   * the document rather than after its trigger.
   *
   * Never on a hover-open, whatever this says. Moving the caret out of whatever
   * the user was typing in because a pointer crossed a trigger is hostile, and
   * it is not a request for focus — which is why this tracks HOW the overlay
   * opened rather than only that it did.
   */
  takeFocus?: boolean;
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

/**
 * Keys that must never pull focus into the popup.
 *
 * `Tab` is the user leaving. The rest are modifiers, and they matter because a
 * modifier is its OWN keydown: a Shift+Tab is `Shift` then `Tab`, so filtering
 * `Tab` alone still let the bare `Shift` move focus, and the Shift+Tab that
 * followed then ran from the portal at the end of the document.
 */
const LEAVES_OR_MODIFIES = new Set([
  "Tab",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "CapsLock",
  "NumLock",
  "ScrollLock",
]);

/** Seconds in, milliseconds out. Seconds is the public unit; ours is the timer's. */
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
    takeFocus = false,
    scope,
    role,
    id,
  } = options;

  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const contentId = id ?? autoId;

  const [uncontrolled, setUncontrolled] = useState(defaultOpen);

  /**
   * Disabling an uncontrolled overlay closes it for good, not merely for now.
   *
   * `open` below is derived, so `disabled` hides it — but the state underneath
   * stays `true`, and every handler is detached while disabled, so nothing can
   * ever write `false`. Re-enabling then reopened it with no gesture at all and
   * `takeFocus` took the caret with it, which is exactly what that option's own
   * doc calls hostile. Both of Tooltip's routes in do it, including the empty
   * `title` one the docs encourage writing as `title={row.note}`.
   *
   * Adjusted during render rather than from an effect: an effect would render
   * the reopened overlay for a frame first, and this is the documented way to
   * reset state when a prop changes.
   *
   * On every render while disabled, NOT on the `disabled` transition. Flipping
   * the prop does not cancel a timer `schedule` already armed, so a hover
   * followed by a disable inside the 100ms enter delay let that timer fire
   * *while disabled* and write `true` invisibly — `open` is derived, so nothing
   * showed — and re-enabling then saw no transition and reset nothing. Writing
   * unconditionally converges instead: the timer sets it, the next render
   * clears it.
   *
   * Controlled is deliberately untouched — that value is the consumer's answer,
   * and it is read back correctly when they re-enable.
   */
  if (disabled && uncontrolled) setUncontrolled(false);
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

  /**
   * The last value handed to the consumer, so a repeat is not reported twice.
   *
   * Comparing against `open` cannot work: several handlers can call `setOpen`
   * within one event, and every one of them reads the same pre-render value.
   * Kept in step with reality by the effect below.
   */
  const reportedRef = useRef(open);
  useEffect(() => {
    reportedRef.current = open;
  });

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setUncontrolled(next);
      // Only when it actually changed. Notifying unconditionally reported
      // things that never happened: a hover shorter than the enter delay
      // reported a close for an overlay that never opened, a trigger → popup →
      // trigger round trip reported a second open with no close between, and
      // any two handlers agreeing on a close reported it twice. The Tab and
      // Escape double-fires fixed by hand earlier were two instances of this.
      if (reportedRef.current === next) return;
      reportedRef.current = next;
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
  /**
   * How the pending open was asked for. Read when the overlay actually opens,
   * to decide whether taking focus would be helping or interrupting.
   */
  const reasonRef = useRef<"hover" | "press" | "keyboard" | "none">("none");

  /** True only while the close is handing focus back, so the trigger ignores it. */
  const restoringRef = useRef(false);
  const schedule = useCallback(
    (next: boolean, delay: number, reason: "hover" | "press" | "keyboard" = "press") => {
      cancel();
      if (next) reasonRef.current = reason;
      if (delay === 0) return setOpen(next);
      timerRef.current = setTimeout(() => setOpen(next), delay);
    },
    [cancel, setOpen]
  );
  useEffect(() => cancel, [cancel]);

  /**
   * Disabling also disarms whatever was already scheduled.
   *
   * Resetting the state converges what is RENDERED, and stops there: the timer
   * `schedule` armed still runs, and `setOpen` notifies unconditionally. So a
   * hover followed by a disable inside the enter delay reported `{open:true}`
   * for an overlay that is disabled and not in the document, and never reported
   * a close. A controlled consumer mirroring that callback then holds `true`
   * themselves — which the render-time reset deliberately does not touch, since
   * their value is their answer — and re-enabling reopens with no gesture.
   */
  useEffect(() => {
    if (disabled) cancel();
  }, [disabled, cancel]);

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
      // True only for the layers that OWN focus while open and mean nothing
      // once they lose it — a menu, a tooltip. Tab out of one and it should go.
      //
      // False for anything dialog-shaped, which is what the option's own doc in
      // `core` says and what this violated: a popover does not trap, so focus
      // starts on the trigger OUTSIDE the layer, and the first Tab past it
      // dismissed the thing before the user could reach what is in it.
      focus: role !== "dialog",
    });
    return () => {
      stop();
      removeLayer();
    };
  }, [open, anchor, positioner, content, placement, offset, arrow, role, cancel, setOpen]);

  // ------------------------------------------------------------- focus moves

  // Taking focus on open and dropping it on close leaves <body> focused, so the
  // next Tab restarts at the top of the page. Both halves belong together.
  useEffect(() => {
    if (!takeFocus) return;
    if (open) {
      // Only a press or a key asks for focus.
      //
      // A pointer crossing a trigger does not, and neither does an opening
      // nobody gestured for at all: `defaultOpen` put the caret inside the
      // popup on page load, and a controlled consumer flipping `open` took it
      // out of whatever the user was typing in — `INPUT` → `DIV/content`, which
      // is verbatim what this option's doc calls hostile, reached by the one
      // route that writes no reason. Defaulting to "press" made the absence of
      // a gesture look like the most deliberate one.
      if (reasonRef.current !== "press" && reasonRef.current !== "keyboard") return;
      content?.focus({ preventScroll: true });
      return;
    }
    // Whatever gesture opened it is spent. Leaving it set made the NEXT opening
    // inherit it, which is how a stale "hover" once left a menu keyboard-dead.
    reasonRef.current = "none";

    // Focus being inside is the whole condition, and there is deliberately no
    // "did we put it there" flag alongside it. There was, and it was wrong in
    // both directions: it is redundant, because `content` is null until the
    // popup mounts and so the guard below already covers the first render; and
    // it excluded the case that matters most, since a POINTER press inside the
    // popup moves focus without us doing anything. The default configuration of
    // both components is hover-open, so a press on a menu item left `<body>`
    // focused and the next Tab restarted at the top of the page.
    //
    // Only when focus is still inside — the same rule `createFocusTrap` applies.
    // A press outside has already moved it, and restoring would take it back
    // from wherever the user just put it. The content is still mounted here,
    // because presence outlives `open`.
    if (!content || !contains(content, document.activeElement)) return;
    const target = anchor ? (getTabbables(anchor)[0] ?? anchor) : null;
    // Marked, so the trigger's own `focus` handler ignores the focus this
    // causes. Two correct mechanisms, wrong together: the restore hands focus
    // back to the trigger, that focus IS keyboard-visible, and a `focus`
    // trigger reads it as a request to open — so Escape closed and reopened in
    // one breath and the overlay could not be dismissed at all. `focus()`
    // dispatches synchronously, so the flag is down again before anything else
    // can see it.
    restoringRef.current = true;
    target?.focus({ preventScroll: true });
    restoringRef.current = false;
  }, [takeFocus, open, content, anchor]);

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
        schedule(true, ms(mouseEnterDelay), "hover");
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
        if (restoringRef.current) return;
        if (isFocusVisible(event.target)) schedule(true, 0, "keyboard");
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

    triggerProps.onKeyDown = event => {
      // Escape is deliberately NOT handled here. `pushDismissable` listens on
      // the document in the CAPTURE phase, so it has already answered this key
      // and already called back before anything on the trigger runs — wherever
      // focus happens to be. Closing again here fired `onOpenChange` twice for
      // one press, which is the same defect the Tab path had.

      // The `setOpen` handed over records the reason, rather than trusting the
      // caller to. It opens without going through `schedule`, so `reasonRef`
      // would otherwise keep whatever the last POINTER gesture wrote — and one
      // hover-open-and-close earlier left a keyboard open reading "hover",
      // declining to take focus, and the menu keyboard-dead with only Escape
      // working.
      // A key arriving at the trigger while the overlay is OPEN means the user
      // is driving the popup from the wrong element. `aria-activedescendant` is
      // only interpreted on the focused node, so the highlight would move
      // visibly and be announced to nobody — measured as `activeTag "BUTTON"`
      // with the trigger carrying no active descendant and the content carrying
      // one. Focus follows the keys.
      //
      // Modifiers are excluded because a modifier is its OWN keydown: a
      // Shift+Tab is `Shift` then `Tab`, so filtering `Tab` alone still let the
      // bare `Shift` pull focus into a popup a hover-open had declined to
      // focus, and the Shift+Tab that followed then ran from the portal.
      // Tab at the trigger with the popup open is the user leaving, and the
      // hook answers it here rather than passing it on. It owns Tab on the
      // content side too, and a caller that also closed on Tab — as Dropdown
      // did — made one press fire `onOpenChange` twice.
      if (open && takeFocus && event.key === "Tab") {
        cancel();
        setOpen(false);
        return;
      }

      if (open && takeFocus && !LEAVES_OR_MODIFIES.has(event.key)) {
        content?.focus({ preventScroll: true });
      }

      onTriggerKeyDown?.(event, {
        open,
        setOpen: next => {
          if (next) reasonRef.current = "keyboard";
          setOpen(next);
        },
      });
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
    // Focusable only programmatically, and only where something actually moves
    // focus here. Without it `.focus()` is a no-op on a plain div, so the popup
    // stays unreachable and the restore has nothing to restore from — and
    // adding it unconditionally would put a tooltip in the tab order.
    ...(takeFocus
      ? {
          tabIndex: -1,
          // Tab OUT of a popup that holds focus, and it closes.
          //
          // Out, not any Tab: focus starts on the container, so the first Tab
          // steps into whatever the popup contains and must be left alone —
          // closing on every Tab made the controls inside unreachable, which is
          // the opposite of the bug being fixed. Leaving means the last tabbable
          // going forward, or the container or first tabbable going back.
          //
          // Not `preventDefault`: the browser's own Tab then runs from wherever
          // focus ends up, and the close restores it to the trigger — so the
          // user lands on the control after the trigger rather than wherever the
          // portal happens to sit in the document. Without this a Popover was a
          // one-way trip: Tab past its last control reached `<body>`, outside
          // the document, with the popover still open.
          onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
            if (event.key !== "Tab" || !content) return;
            const tabbables = getTabbables(content);
            const active = content.ownerDocument.activeElement;
            const leaving = event.shiftKey
              ? active === content || active === tabbables[0]
              : tabbables.length === 0 || active === tabbables[tabbables.length - 1];
            if (!leaving) return;
            cancel();
            setOpen(false);
          },
        }
      : {}),
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
