/**
 * Spring physics, and the trick that keeps it free at runtime.
 *
 * A spring is solved analytically here rather than integrated step by step: the
 * damped-harmonic-oscillator closed form gives position at any `t` directly, so
 * sampling 1000 points costs 1000 multiplications rather than 1000 dependent
 * timesteps, and there is no accumulated error.
 *
 * The payoff is `toLinearEasing`. A spring that nobody interrupts does not need
 * JavaScript at all — sample it once, emit a CSS `linear()` easing, and the
 * compositor runs it. That is how "springs, with no animation library" is true
 * rather than aspirational. The rAF path in ./animate.ts exists only for
 * springs that *are* interrupted, where a fixed curve cannot help.
 */

export interface SpringOptions {
  /** How hard the spring pulls. Higher is snappier. */
  stiffness?: number;
  /** How much the motion is resisted. Higher settles sooner, with less overshoot. */
  damping?: number;
  mass?: number;
  /**
   * Initial velocity, in units per second, where 1 unit is the whole distance.
   * Positive means already moving toward the target — the sign convention every
   * regime below shares, and the one a hand-off from a drag gesture needs.
   */
  velocity?: number;
}

export interface Spring {
  /** Normalised position at `t` seconds: 0 at rest, 1 at the target. */
  at(t: number): number;
  /** Seconds until the spring is within `precision` of the target and staying there. */
  readonly duration: number;
}

const DEFAULTS: Required<SpringOptions> = {
  stiffness: 180,
  damping: 22,
  mass: 1,
  velocity: 0,
};

/** How close to the target counts as arrived. Half a pixel over a 400px move. */
const PRECISION = 0.001;

export function createSpring(options: SpringOptions = {}): Spring {
  const { stiffness, damping, mass, velocity } = { ...DEFAULTS, ...options };

  const w0 = Math.sqrt(stiffness / mass);
  // Damping ratio: below 1 overshoots, at 1 is the fastest approach without
  // overshoot, above 1 crawls in.
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));

  const displacement = (t: number): number => {
    if (t <= 0) return 0;

    if (zeta < 1) {
      // Underdamped: oscillates inside a decaying envelope.
      const wd = w0 * Math.sqrt(1 - zeta * zeta);
      const envelope = Math.exp(-zeta * w0 * t);
      return 1 - envelope * (Math.cos(wd * t) + ((zeta * w0 - velocity) / wd) * Math.sin(wd * t));
    }

    if (zeta === 1) {
      // Critically damped: the boundary case, where the general solution's
      // denominator collapses to zero and this limit form takes over.
      const envelope = Math.exp(-w0 * t);
      return 1 - envelope * (1 + (w0 - velocity) * t);
    }

    // Overdamped: two real exponentials, no oscillation at all.
    const r = w0 * Math.sqrt(zeta * zeta - 1);
    const a = -zeta * w0 + r;
    const b = -zeta * w0 - r;
    const c1 = (-velocity - b) / (a - b);
    const c2 = 1 - c1;
    return 1 - (c1 * Math.exp(a * t) + c2 * Math.exp(b * t));
  };

  /**
   * Walks forward until the spring both sits within `PRECISION` of the target
   * and stays there — a bare "is it close" check stops at the first zero
   * crossing of an underdamped spring, mid-overshoot.
   */
  const settle = (): number => {
    const step = 1 / 60;
    // 10s ceiling so a nonsensical configuration terminates rather than
    // hanging whatever asked for the duration.
    for (let t = step; t < 10; t += step) {
      if (Math.abs(1 - displacement(t)) >= PRECISION) continue;
      let holds = true;
      for (let ahead = t; ahead < t + 0.25; ahead += step) {
        if (Math.abs(1 - displacement(ahead)) >= PRECISION) {
          holds = false;
          break;
        }
      }
      if (holds) return t;
    }
    return 10;
  };

  let duration: number | undefined;

  return {
    at: displacement,
    get duration() {
      duration ??= settle();
      return duration;
    },
  };
}

const round = (n: number) => Math.round(n * 10000) / 10000;

/**
 * Samples a spring into a CSS `linear()` easing function.
 *
 * `linear()` interpolates between the points it is given, so enough of them
 * reproduce any curve — including the overshoot past 1 that makes a spring look
 * like a spring, which no `cubic-bezier` can express.
 *
 * Returns the easing and the duration it must be paired with; the curve is
 * normalised to that duration, so using a different one plays the wrong motion.
 */
export function toLinearEasing(
  options: SpringOptions = {},
  samples = 40
): { easing: string; duration: number } {
  const spring = createSpring(options);
  const duration = spring.duration;

  const points: number[] = [];
  for (let i = 0; i <= samples; i++) {
    points.push(round(spring.at((i / samples) * duration)));
  }
  // Pin the ends. Sampling can land a hair off 1 at the last point, and a
  // `linear()` that does not reach 1 leaves the element permanently short of
  // where it was animating to.
  points[0] = 0;
  points[points.length - 1] = 1;

  return { easing: `linear(${points.join(", ")})`, duration: Math.round(duration * 1000) };
}
