"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { dataAttr, fromRatio, numericKey, ratio, snap } from "@crosskit-ui/core";

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  /** Fires on every move, including during a drag. */
  onChange?: (value: number) => void;
  /** Fires once, when the drag ends — the one to hang a network call on. */
  onChangeComplete?: (value: number) => void;
  vertical?: boolean;
  disabled?: boolean;
  marks?: SliderMark[];
  /** Renders the value above the thumb. */
  tooltip?: boolean | ((value: number) => ReactNode);
  ref?: Ref<HTMLDivElement>;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value: controlled,
  defaultValue,
  onChange,
  onChangeComplete,
  vertical = false,
  disabled = false,
  marks,
  tooltip = false,
  className,
  style,
  ref,
  ...rest
}: SliderProps) {
  const range = { min, max, step };
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? min);
  // Snapped on read, so a `defaultValue` off the grid and a `value` off the
  // grid go through the same path. Snapping the initial state as well was
  // written first and measured to change nothing.
  const value = snap(controlled ?? uncontrolled, range);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // No `useCallback`. The React Compiler memoizes this itself, and a manual one
  // it cannot prove equivalent makes it skip the whole component — which is a
  // worse trade than the allocation it saves.
  const commit = (next: number) => {
    if (controlled === undefined) setUncontrolled(next);
    if (next !== value) onChange?.(next);
  };

  /** A pointer position on the track, as a value. */
  const valueAt = (event: PointerEvent<HTMLElement>) => {
    const track = trackRef.current;
    if (!track) return value;
    const box = track.getBoundingClientRect();
    // Read direction off the DOM rather than taking a prop: `dir` is inherited
    // from an ancestor and the browser has already resolved it.
    const rtl = getComputedStyle(track).direction === "rtl";
    const position = vertical
      ? // The block axis runs downward on screen and upward in value, so a
        // vertical slider is inverted rather than merely rotated.
        (box.bottom - event.clientY) / box.height
      : rtl
        ? (box.right - event.clientX) / box.width
        : (event.clientX - box.left) / box.width;
    return fromRatio(position, range);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return;
    // Capture on the element, so a drag that leaves the track keeps tracking —
    // without it the thumb stops the moment the pointer crosses the edge, which
    // is exactly when a user is trying to reach the end.
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging.current = true;
    commit(valueAt(event));
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    commit(valueAt(event));
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onChangeComplete?.(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const next = numericKey(event, value, range, { rtl });
    if (next === undefined) return;
    // Only after the key is ours: an unhandled key must keep scrolling the page.
    event.preventDefault();
    commit(next);
    onChangeComplete?.(next);
  };

  const filled = ratio(value, min, max);

  return (
    <div
      ref={ref}
      data-scope="slider"
      data-part="root"
      data-orientation={vertical ? "vertical" : "horizontal"}
      data-disabled={dataAttr(disabled)}
      className={className}
      style={{ ...style, ["--ck-slider-filled" as string]: String(filled) } as CSSProperties}
      {...rest}
    >
      <div
        ref={trackRef}
        data-part="track"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div data-part="range" />
        {marks?.map(mark => (
          <span
            key={mark.value}
            data-part="mark"
            data-active={dataAttr(mark.value <= value)}
            style={{ ["--ck-slider-mark" as string]: String(ratio(mark.value, min, max)) }}
          >
            {mark.label !== undefined && <span data-part="mark-label">{mark.label}</span>}
          </span>
        ))}
        <div
          role="slider"
          data-part="thumb"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-orientation={vertical ? "vertical" : "horizontal"}
          aria-disabled={disabled ? "true" : undefined}
          onKeyDown={onKeyDown}
        >
          {tooltip !== false && (
            <span data-part="tooltip" aria-hidden="true">
              {typeof tooltip === "function" ? tooltip(value) : value}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
