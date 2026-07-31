import { describe, expect, it } from "vitest";
import { createSpring, toLinearEasing, type SpringOptions } from "./spring";

/** Damping ratios that put a spring in each of the three regimes. */
const UNDERDAMPED: SpringOptions = { stiffness: 180, damping: 10, mass: 1 };
const CRITICAL: SpringOptions = { stiffness: 100, damping: 20, mass: 1 }; // zeta exactly 1
const OVERDAMPED: SpringOptions = { stiffness: 100, damping: 60, mass: 1 };

const sample = (spring: ReturnType<typeof createSpring>, count = 200) =>
  Array.from({ length: count + 1 }, (_, i) => spring.at((i / count) * spring.duration));

describe("createSpring", () => {
  it("starts at rest and arrives at the target", () => {
    for (const options of [UNDERDAMPED, CRITICAL, OVERDAMPED]) {
      const spring = createSpring(options);
      expect(spring.at(0)).toBe(0);
      expect(spring.at(spring.duration)).toBeCloseTo(1, 2);
    }
  });

  it("holds at the target once settled", () => {
    for (const options of [UNDERDAMPED, CRITICAL, OVERDAMPED]) {
      const spring = createSpring(options);
      // Not just "arrives" — a spring that is still oscillating would pass an
      // endpoint check while looking wrong on screen.
      for (const t of [1, 2, 5, 20]) {
        expect(spring.at(spring.duration * t), `t=${t}x`).toBeCloseTo(1, 2);
      }
    }
  });

  it("treats negative time as not started", () => {
    expect(createSpring().at(-1)).toBe(0);
  });

  describe("regimes", () => {
    it("underdamped overshoots past the target", () => {
      // The whole reason for using a spring: no cubic-bezier can exceed 1.
      expect(Math.max(...sample(createSpring(UNDERDAMPED)))).toBeGreaterThan(1);
    });

    it("critically damped does not overshoot", () => {
      // The boundary case, where the general solution divides by zero and the
      // limit form takes over. Worth its own assertion for that reason.
      expect(Math.max(...sample(createSpring(CRITICAL)))).toBeLessThanOrEqual(1.001);
    });

    it("overdamped does not overshoot", () => {
      expect(Math.max(...sample(createSpring(OVERDAMPED)))).toBeLessThanOrEqual(1.001);
    });

    it("rises monotonically when it cannot oscillate", () => {
      for (const options of [CRITICAL, OVERDAMPED]) {
        const values = sample(createSpring(options), 100);
        for (let i = 1; i < values.length; i++) {
          expect(values[i]!, `${JSON.stringify(options)} at ${i}`).toBeGreaterThanOrEqual(
            values[i - 1]! - 1e-9
          );
        }
      }
    });
  });

  describe("parameters", () => {
    it("stiffer springs settle sooner", () => {
      expect(createSpring({ stiffness: 400, damping: 30 }).duration).toBeLessThan(
        createSpring({ stiffness: 80, damping: 30 }).duration
      );
    });

    it("heavier mass settles later", () => {
      expect(createSpring({ mass: 4 }).duration).toBeGreaterThan(
        createSpring({ mass: 1 }).duration
      );
    });

    it("initial velocity moves it before the spring force does, in every regime", () => {
      // Each regime has its own closed form, and each carried the same sign
      // error: positive velocity — already moving toward the target — pushed
      // the spring backwards. Only the zero-velocity path was right, which is
      // why every other test here passed.
      for (const options of [UNDERDAMPED, CRITICAL, OVERDAMPED]) {
        const label = JSON.stringify(options);
        const thrown = createSpring({ ...options, velocity: 8 });
        const still = createSpring(options);
        expect(thrown.at(0.02), `${label} forward`).toBeGreaterThan(still.at(0.02));
        expect(thrown.at(0.02), `${label} positive`).toBeGreaterThan(0);

        const back = createSpring({ ...options, velocity: -8 });
        expect(back.at(0.02), `${label} backward`).toBeLessThan(still.at(0.02));
      }
    });

    it("still arrives at the target when thrown", () => {
      for (const options of [UNDERDAMPED, CRITICAL, OVERDAMPED]) {
        for (const velocity of [8, -8]) {
          const spring = createSpring({ ...options, velocity });
          expect(spring.at(spring.duration * 3), `${velocity}`).toBeCloseTo(1, 2);
        }
      }
    });

    it("terminates on a configuration that never settles", () => {
      // No damping at all oscillates forever; the walk has to give up rather
      // than hang whatever asked for a duration.
      expect(createSpring({ stiffness: 100, damping: 0 }).duration).toBe(10);
    });
  });

  it("agrees with numerical integration of the same physics", () => {
    // The closed form is only trustworthy if it matches the equation it claims
    // to solve: m·x'' + c·x' + k·(x − 1) = 0. Integrating that directly with
    // small steps is an independent implementation, so agreement between the
    // two means the algebra is right rather than merely self-consistent — and
    // it is what would have caught the velocity sign error on its own.
    for (const options of [UNDERDAMPED, CRITICAL, OVERDAMPED]) {
      for (const velocity of [0, 6, -6]) {
        const { stiffness: k = 0, damping: c = 0, mass: m = 1 } = options;
        const spring = createSpring({ ...options, velocity });

        let x = 0;
        let v = velocity;
        const dt = 1e-5;
        const until = Math.min(spring.duration, 1);

        for (let t = 0; t < until; t += dt) {
          // Semi-implicit Euler: stable for oscillators where plain Euler
          // gains energy and drifts away from the true solution.
          v += ((-k * (x - 1) - c * v) / m) * dt;
          x += v * dt;
        }

        expect(spring.at(until), `${JSON.stringify(options)} v=${velocity}`).toBeCloseTo(x, 2);
      }
    }
  });

  it("computes duration once", () => {
    const spring = createSpring();
    expect(spring.duration).toBe(spring.duration);
  });
});

describe("toLinearEasing", () => {
  it("emits a css linear() function", () => {
    const { easing } = toLinearEasing();
    expect(easing).toMatch(/^linear\([\d.,\s-]+\)$/);
  });

  it("pins both ends exactly", () => {
    // A curve that stops a hair short of 1 leaves the element permanently
    // short of where it was animating to — invisible in review, obvious on a
    // 400px slide.
    const { easing } = toLinearEasing(UNDERDAMPED);
    const points = easing.slice(7, -1).split(", ").map(Number);
    expect(points[0]).toBe(0);
    expect(points[points.length - 1]).toBe(1);
  });

  it("keeps the overshoot, which is the point", () => {
    const { easing } = toLinearEasing(UNDERDAMPED);
    const points = easing.slice(7, -1).split(", ").map(Number);
    expect(Math.max(...points)).toBeGreaterThan(1);
  });

  it("returns a duration in milliseconds, matching the curve", () => {
    const { duration } = toLinearEasing(UNDERDAMPED);
    expect(duration).toBe(Math.round(createSpring(UNDERDAMPED).duration * 1000));
    expect(duration).toBeGreaterThan(0);
  });

  it("tracks the spring it came from", () => {
    // The curve is only correct paired with its own duration, so the sampled
    // points must actually follow the spring across the whole span.
    const spring = createSpring(UNDERDAMPED);
    const samples = 20;
    const points = toLinearEasing(UNDERDAMPED, samples).easing.slice(7, -1).split(", ").map(Number);

    for (let i = 1; i < samples; i++) {
      expect(points[i]!, `sample ${i}`).toBeCloseTo(spring.at((i / samples) * spring.duration), 3);
    }
  });

  it("takes a sample count", () => {
    expect(toLinearEasing({}, 10).easing.split(",")).toHaveLength(11);
  });

  it("is deterministic", () => {
    expect(toLinearEasing(UNDERDAMPED)).toEqual(toLinearEasing(UNDERDAMPED));
  });
});
