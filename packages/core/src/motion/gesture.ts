/**
 * Pointer drag recognition, for drag-to-dismiss and swipe-away.
 *
 * Pointer events only — one code path for mouse, touch and pen. The older
 * approach of separate mouse and touch handlers has to de-duplicate the
 * synthetic mouse events touch produces, which is where double-fire bugs come
 * from.
 *
 * Velocity is what makes a dismiss feel right: a short, fast flick should
 * dismiss even though it moved less than a slow, deliberate drag that should
 * not. It is measured over a trailing window rather than the whole gesture, so
 * pausing mid-drag and then releasing does not count as a throw.
 */

export interface DragEvent {
  /** Movement since the gesture began. */
  dx: number;
  dy: number;
  /** Pixels per second, over the trailing window. */
  vx: number;
  vy: number;
  /** The event that produced this, so a caller can prevent defaults. */
  originalEvent: PointerEvent;
}

export interface DragOptions {
  /** Movement in px before the gesture is recognised at all. */
  threshold?: number;
  /** Which axis to track. The other is ignored, and left to the page to scroll. */
  axis?: "x" | "y" | "both";
  onStart?: (event: DragEvent) => void;
  onMove?: (event: DragEvent) => void;
  onEnd?: (event: DragEvent) => void;
}

interface Sample {
  t: number;
  x: number;
  y: number;
}

/** Velocity is averaged over this many milliseconds of trailing movement. */
const VELOCITY_WINDOW = 100;

export function createDrag(element: HTMLElement, options: DragOptions = {}): () => void {
  const { threshold = 3, axis = "both" } = options;

  let pointerId: number | null = null;
  let origin: Sample | null = null;
  let samples: Sample[] = [];
  let recognised = false;

  const track = (event: PointerEvent) => {
    samples.push({ t: event.timeStamp, x: event.clientX, y: event.clientY });
    // Keep only the trailing window, plus one sample before it so a gesture
    // shorter than the window still has two points to measure between.
    const cutoff = event.timeStamp - VELOCITY_WINDOW;
    while (samples.length > 2 && samples[1]!.t < cutoff) samples.shift();
  };

  const describe = (event: PointerEvent): DragEvent => {
    const first = samples[0]!;
    const last = samples[samples.length - 1]!;
    const elapsed = (last.t - first.t) / 1000;
    // A gesture confined to one frame has no measurable duration; reporting
    // Infinity would dismiss anything that moved at all.
    const vx = elapsed > 0 ? (last.x - first.x) / elapsed : 0;
    const vy = elapsed > 0 ? (last.y - first.y) / elapsed : 0;

    return {
      dx: axis === "y" ? 0 : event.clientX - origin!.x,
      dy: axis === "x" ? 0 : event.clientY - origin!.y,
      vx: axis === "y" ? 0 : vx,
      vy: axis === "x" ? 0 : vy,
      originalEvent: event,
    };
  };

  const onPointerDown = (event: PointerEvent) => {
    // Secondary buttons belong to the context menu, not to a drag.
    if (pointerId !== null || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointerId = event.pointerId;
    origin = { t: event.timeStamp, x: event.clientX, y: event.clientY };
    samples = [origin];
    recognised = false;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId || !origin) return;
    track(event);

    if (!recognised) {
      const dx = Math.abs(event.clientX - origin.x);
      const dy = Math.abs(event.clientY - origin.y);
      const travelled = axis === "x" ? dx : axis === "y" ? dy : Math.hypot(dx, dy);
      if (travelled < threshold) return;

      recognised = true;
      // Captured only once the gesture is real, so a plain click still reaches
      // whatever is underneath.
      element.setPointerCapture(event.pointerId);
      options.onStart?.(describe(event));
    }

    options.onMove?.(describe(event));
  };

  const finish = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    const wasRecognised = recognised;
    const final = wasRecognised ? describe(event) : null;

    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    pointerId = null;
    origin = null;
    samples = [];
    recognised = false;

    if (final) options.onEnd?.(final);
  };

  element.addEventListener("pointerdown", onPointerDown);
  element.addEventListener("pointermove", onPointerMove);
  element.addEventListener("pointerup", finish);
  // `pointercancel` fires when the browser takes the gesture over — a scroll
  // starting, or a system gesture. Without it the drag never ends and the
  // element stays stuck mid-swipe.
  element.addEventListener("pointercancel", finish);

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointermove", onPointerMove);
    element.removeEventListener("pointerup", finish);
    element.removeEventListener("pointercancel", finish);
  };
}
