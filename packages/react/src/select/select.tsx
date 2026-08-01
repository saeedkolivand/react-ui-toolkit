"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  createCollection,
  ariaAttr,
  createTypeahead,
  dataAttr,
  navigate,
  type Placement,
  type PlacementAlias,
} from "@crosskit-ui/core";
import { Icon } from "../icon/icon";
import { AnchoredView } from "../anchored/anchored";
import { useAnchored } from "../anchored/use-anchored";

export type SelectSize = "small" | "middle" | "large";
export type SelectStatus = "error" | "warning";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  /**
   * The value, and the option it came from — the second is what a consumer
   * usually wants and would otherwise have to look up again.
   */
  onChange?: (value: string, option: SelectOption) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  placeholder?: string;
  size?: SelectSize;
  /**
   * Colours the control, and `"error"` also marks the trigger `aria-invalid`.
   *
   * `"warning"` is presentation only — there is no ARIA state for it, and
   * inventing one would be a claim a screen reader cannot act on. Use
   * `errorMessage` for something that should actually be read out; it sets
   * `aria-invalid` too, and describes the trigger.
   */
  status?: SelectStatus;
  placement?: PlacementAlias | Placement;
  label?: ReactNode;
  helperText?: ReactNode;
  errorMessage?: ReactNode;
  disabled?: boolean;
  /** Submitted through a hidden native select, so plain forms just work. */
  name?: string;
  required?: boolean;
  fullWidth?: boolean;
  id?: string;
  className?: string;
}

export function Select({
  options,
  value: controlled,
  defaultValue,
  onChange,
  onOpenChange,
  placeholder = "Select an option",
  size = "middle",
  status,
  placement = "bottomLeft",
  label,
  helperText,
  errorMessage,
  disabled,
  name,
  required,
  fullWidth = true,
  id,
  className,
  ...rest
}: SelectProps) {
  // Unconditional: `id ?? useId()` would be a conditional hook call.
  const autoId = useId();
  const selectId = id ?? autoId;

  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const selected = controlled ?? uncontrolled;
  const selectedOption = options.find(option => option.value === selected) ?? null;

  const [highlighted, setHighlighted] = useState<string | null>(null);
  const typeaheadRef = useRef(createTypeahead());

  const collection = useMemo(
    () =>
      createCollection(
        options.map(option => ({
          value: option.value,
          label: option.label,
          disabled: option.disabled,
        }))
      ),
    [options]
  );

  const choose = useCallback(
    (optionValue: string, setOpen: (open: boolean) => void) => {
      const option = options.find(o => o.value === optionValue);
      if (!option || option.disabled) return;
      if (controlled === undefined) setUncontrolled(optionValue);
      onChange?.(optionValue, option);
      setOpen(false);
    },
    [controlled, onChange, options]
  );

  /**
   * Every key the listbox answers, from either side.
   *
   * The arrangement Dropdown uses, for the same reason: focus normally sits on
   * the content, but a pointer press can leave it on the trigger with the popup
   * open, and two copies of this would be two chances to disagree.
   */
  const handleKeys = (
    event: KeyboardEvent<HTMLElement>,
    state: { open: boolean; setOpen: (open: boolean) => void }
  ) => {
    if (!state.open) {
      // A closed listbox opens on the keys its role promises, whatever
      // `trigger` says — the same reasoning as a menu button answering Enter.
      // Opening lands on the current selection rather than the top of the list,
      // so a long list does not start somewhere the user has to scroll back
      // from.
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
        event.preventDefault();
        state.setOpen(true);
        setHighlighted(selected || (collection.first()?.value ?? null));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        state.setOpen(true);
        setHighlighted(selected || (collection.last()?.value ?? null));
      } else {
        // A closed select still answers letters, Home and End — it changes the
        // selection without opening, which is what a native `<select>` does and
        // what the three adapters still on the machine do. Returning here left
        // React the only one that ignored them.
        const jumped = navigate(
          event,
          collection,
          selected || null,
          // `both`, not `vertical`: a CLOSED select steps on the horizontal
          // arrows too. `vertical` answered the letters and Home/End and left
          // ArrowLeft/ArrowRight falling through, which is half the keymap the
          // other three adapters and a native `<select>` both provide.
          //
          // `rtl` stays at its default deliberately. With `dir="rtl"` the other
          // three still take ArrowRight as *next*, so mirroring here would open
          // a new divergence rather than close one.
          { orientation: "both", typeahead: true },
          typeaheadRef.current
        );
        if (!jumped.handled) return;
        event.preventDefault();
        if (jumped.value !== undefined) choose(jumped.value, state.setOpen);
      }
      return;
    }

    const current = highlighted ?? selected;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (current) choose(current, state.setOpen);
      return;
    }
    if (event.key === "Tab") {
      state.setOpen(false);
      return;
    }

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

  const anchored = useAnchored({
    ...rest,
    placement,
    trigger: "click",
    arrow: false,
    disabled,
    takeFocus: true,
    // Seeded here rather than from an effect, and on EVERY route in rather than
    // only the keyboard one. A click-open left the highlight unset, so the
    // first ArrowDown landed on the first option instead of moving from it —
    // the keyboard path happened to seed itself and the pointer path did not.
    onOpenChange: details => {
      setHighlighted(details.open ? selected || (collection.first()?.value ?? null) : null);
      onOpenChange?.(details);
    },
    onTriggerKeyDown: handleKeys,
    scope: "select",
    role: "listbox",
    id: `${selectId}-listbox`,
  });
  const { open, setOpen, contentId, contentNode } = anchored;

  // Read through `open`, so a closed listbox never reports a highlight whatever
  // the last close did or did not reset.
  const active = open ? (highlighted ?? selected) : null;
  const optionId = useCallback((v: string) => `${selectId}-option-${v}`, [selectId]);

  useEffect(() => {
    if (!open) typeaheadRef.current.clear();
  }, [open]);

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
      contentNode.querySelector(`[id="${optionId(active)}"]`)?.scrollIntoView({ block: "nearest" });
    };
    scrollWhenPlaced();
    return () => cancelAnimationFrame(frame);
  }, [open, active, contentNode, optionId]);

  const describedBy = errorMessage
    ? `${selectId}-error`
    : helperText
      ? `${selectId}-helper`
      : undefined;
  const labelId = label != null ? `${selectId}-label` : undefined;

  return (
    <div
      data-scope="select"
      data-part="root"
      data-size={size}
      data-status={status}
      data-invalid={dataAttr(status === "error" || errorMessage != null)}
      data-full-width={dataAttr(fullWidth)}
      data-disabled={dataAttr(disabled)}
      className={className}
    >
      {label != null && (
        <label id={labelId} htmlFor={`${selectId}-trigger`} data-scope="select" data-part="label">
          {label}
        </label>
      )}

      <AnchoredView
        anchored={anchored}
        arrow={false}
        triggerPart="control"
        contentProps={{
          "aria-labelledby": labelId,
          "aria-activedescendant": active ? optionId(active) : undefined,
          onKeyDown: (event: KeyboardEvent<HTMLElement>) => handleKeys(event, { open, setOpen }),
        }}
        body={options.map(option => {
          const isSelected = option.value === selected;
          return (
            <div
              key={option.value}
              id={optionId(option.value)}
              role="option"
              aria-selected={isSelected}
              aria-disabled={option.disabled ? "true" : undefined}
              data-scope="select"
              data-part="item"
              data-highlighted={dataAttr(active === option.value)}
              // `data-state`, which is what the stylesheet has always keyed
              // the checked row on. A `data-selected` of my own was a second
              // name for the same thing, and nothing styled it.
              data-state={isSelected ? "checked" : "unchecked"}
              data-disabled={dataAttr(option.disabled)}
              // `onPointerMove`, not enter: a keyboard press that scrolls a
              // row under a stationary cursor would otherwise strand the
              // highlight on whatever it happens to be over.
              onPointerMove={() => !option.disabled && setHighlighted(option.value)}
              onClick={() => choose(option.value, setOpen)}
            >
              <span data-scope="select" data-part="item-text">
                {option.label}
              </span>
              <span data-scope="select" data-part="item-indicator">
                {isSelected && <Icon name="check" size="sm" />}
              </span>
            </div>
          );
        })}
      >
        <button
          id={`${selectId}-trigger`}
          type="button"
          role="combobox"
          aria-controls={contentId}
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-invalid={ariaAttr(status === "error" || errorMessage != null)}
          aria-required={ariaAttr(required)}
          // The colour half lives on the root's `data-invalid`; this is the half
          // a screen reader hears. `required` had no route at all — the only
          // element carrying it is the hidden, `aria-hidden` native select.

          disabled={disabled}
          data-scope="select"
          data-part="trigger"
          // The trigger's own, not just the root's: `select.css` keys the
          // dimmed, not-allowed treatment on `[data-part="trigger"][data-disabled]`.
          data-disabled={dataAttr(disabled)}
          data-placeholder-shown={dataAttr(selectedOption == null)}
        >
          <span data-scope="select" data-part="value-text">
            {selectedOption?.label ?? placeholder}
          </span>
          <span data-scope="select" data-part="indicator" data-state={open ? "open" : "closed"}>
            <Icon name="chevronDown" size="sm" />
          </span>
        </button>
      </AnchoredView>

      {/* A real control, so an ordinary form submission carries the value with
          no JavaScript of ours involved. Hidden from assistive tech, which has
          the combobox above it already. */}
      <select
        aria-hidden="true"
        tabIndex={-1}
        name={name}
        required={required}
        disabled={disabled}
        value={selected}
        onChange={() => {}}
        style={{
          position: "absolute",
          inlineSize: 1,
          blockSize: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <option value="" />
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {errorMessage != null ? (
        <p id={`${selectId}-error`} data-scope="select" data-part="error-text" aria-live="polite">
          {errorMessage}
        </p>
      ) : (
        helperText != null && (
          <p id={`${selectId}-helper`} data-scope="select" data-part="helper-text">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}
