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

/** Named to avoid shadowing the DOM's own `DragEvent` on the public barrel. */
export interface DragGestureEvent {
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
  onStart?: (event: DragGestureEvent) => void;
  onMove?: (event: DragGestureEvent) => void;
  onEnd?: (event: DragGestureEvent) => void;
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

  const describe = (event: PointerEvent): DragGestureEvent => {
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

  /**
   * Move, up and cancel are bound to the *document* while a press is active,
   * not to the element.
   *
   * Capture is deliberately deferred until the threshold is passed, so a plain
   * click still reaches whatever is underneath — which leaves a window where
   * the pointer can leave the element with nothing capturing it. Element-bound
   * listeners then never see the release: `pointerId` stays set, every later
   * `pointerdown` is rejected by the guard below, and the element is dead to
   * dragging until it remounts.
   *
   * `axis` makes that window wide rather than a corner case: with `axis: "x"`,
   * dragging straight up off a toast never reaches the threshold, so capture is
   * never taken. Touch survives it — the specification grants implicit capture
   * on `pointerdown` — which is exactly why it would pass a touch test.
   */
  const listenWhilePressed = () => {
    const doc = element.ownerDocument;
    doc.addEventListener("pointermove", onPointerMove);
    doc.addEventListener("pointerup", finish);
    // `pointercancel` fires when the browser takes the gesture over — a scroll
    // starting, or a system gesture. Without it the drag never ends and the
    // element stays stuck mid-swipe.
    doc.addEventListener("pointercancel", finish);
  };

  const stopListeningWhilePressed = () => {
    const doc = element.ownerDocument;
    doc.removeEventListener("pointermove", onPointerMove);
    doc.removeEventListener("pointerup", finish);
    doc.removeEventListener("pointercancel", finish);
  };

  const onPointerDown = (event: PointerEvent) => {
    // Secondary buttons belong to the context menu, not to a drag.
    if (pointerId !== null || (event.pointerType === "mouse" && event.button !== 0)) return;
    pointerId = event.pointerId;
    origin = { t: event.timeStamp, x: event.clientX, y: event.clientY };
    samples = [origin];
    recognised = false;
    listenWhilePressed();
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
    // The release is the last point of the trailing window. Without it the
    // window still ends at the last *move*, so dragging fast, holding still for
    // a second and then letting go reports the old fast movement -- a
    // deliberate hold dismissed as a flick. Jittery holds happened to work,
    // because the jitter refreshed the window, which made it intermittent.
    if (recognised) track(event);
    const final = recognised ? describe(event) : null;

    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    stopListeningWhilePressed();
    pointerId = null;
    origin = null;
    samples = [];
    recognised = false;

    if (final) options.onEnd?.(final);
  };

  element.addEventListener("pointerdown", onPointerDown);

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    stopListeningWhilePressed();
  };
}
