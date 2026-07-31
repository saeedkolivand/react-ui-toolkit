import { describe, expect, it } from "vitest";
import { deletePath, formatPath, getPath, parsePath, setPath } from "./path";
import { isEmpty, validateRule, validateRules } from "./rules";

describe("parsePath", () => {
  it("splits dotted keys", () => {
    expect(parsePath("user.name")).toEqual(["user", "name"]);
  });

  it("turns bracket indices into numbers", () => {
    // Numbers, not strings, so `setPath` can tell an array from an object
    // without inspecting a value that does not exist yet.
    expect(parsePath("items[0].city")).toEqual(["items", 0, "city"]);
  });

  it("handles consecutive indices", () => {
    expect(parsePath("grid[1][2]")).toEqual(["grid", 1, 2]);
  });

  it("handles an empty path", () => {
    expect(parsePath("")).toEqual([]);
  });

  it("round-trips through formatPath", () => {
    for (const path of ["a", "a.b", "items[0]", "user.contacts[2].email", "grid[1][2]"]) {
      expect(formatPath(parsePath(path))).toBe(path);
    }
  });
});

describe("getPath", () => {
  const source = { user: { name: "Ada", contacts: [{ email: "a@b.c" }] } };

  it("reads nested values", () => {
    expect(getPath(source, "user.name")).toBe("Ada");
    expect(getPath(source, "user.contacts[0].email")).toBe("a@b.c");
  });

  it("returns undefined rather than throwing on a missing branch", () => {
    expect(getPath(source, "user.address.city")).toBeUndefined();
    expect(getPath(source, "user.contacts[9].email")).toBeUndefined();
    expect(getPath(undefined, "a.b")).toBeUndefined();
  });
});

describe("setPath", () => {
  it("sets a nested value", () => {
    expect(setPath({ user: { name: "Ada" } }, "user.name", "Grace")).toEqual({
      user: { name: "Grace" },
    });
  });

  it("does not mutate the source", () => {
    const source = { user: { name: "Ada" } };
    const next = setPath(source, "user.name", "Grace");
    expect(source.user.name).toBe("Ada");
    expect(next).not.toBe(source);
  });

  it("shares branches it did not touch", () => {
    // What lets a framework comparing by identity re-render only what changed.
    const source = { a: { keep: true }, b: { change: 1 } };
    const next = setPath(source, "b.change", 2);
    expect(next.a).toBe(source.a);
    expect(next.b).not.toBe(source.b);
  });

  it("creates missing objects along the way", () => {
    expect(setPath({}, "user.address.city", "London")).toEqual({
      user: { address: { city: "London" } },
    });
  });

  it("creates an array for a numeric segment, not an object", () => {
    // `{ "0": … }` looks right in a debugger and breaks the moment anything
    // maps over it.
    const result = setPath({}, "items[0].name", "x") as { items: unknown[] };
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items[0]).toEqual({ name: "x" });
  });

  it("copies arrays rather than sharing them", () => {
    const source = { items: [1, 2, 3] };
    const next = setPath(source, "items[1]", 9);
    expect(source.items).toEqual([1, 2, 3]);
    expect(next.items).toEqual([1, 9, 3]);
  });

  it("replaces the whole value for an empty path", () => {
    expect(setPath({ a: 1 }, "", { b: 2 })).toEqual({ b: 2 });
  });
});

describe("deletePath", () => {
  it("removes an object key", () => {
    expect(deletePath({ a: 1, b: 2 }, "b")).toEqual({ a: 1 });
  });

  it("splices arrays rather than leaving a hole", () => {
    // A hole keeps the length, so every later index shifts and a list field's
    // errors land on the wrong rows.
    const result = deletePath({ items: [1, 2, 3] }, "items[1]") as { items: number[] };
    expect(result.items).toEqual([1, 3]);
    expect(result.items).toHaveLength(2);
  });

  it("removes a nested key without mutating", () => {
    const source = { user: { name: "Ada", age: 36 } };
    expect(deletePath(source, "user.age")).toEqual({ user: { name: "Ada" } });
    expect(source.user.age).toBe(36);
  });

  it("is a no-op on a missing branch", () => {
    expect(() => deletePath({ a: 1 }, "b.c.d")).not.toThrow();
  });
});

describe("rules", () => {
  const context = { label: "Email", values: {} };

  it("treats blanks as empty but keeps 0 and false", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(null)).toBe(true);
    // These are values someone chose, not absent ones.
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(false)).toBe(false);
  });

  it("reports a required field", async () => {
    expect(await validateRule("", { required: true }, context)).toBe("Email is required");
  });

  it("skips other checks on an empty optional field", async () => {
    // Otherwise every optional field in a form errors before being touched.
    expect(await validateRule("", { min: 5, type: "email" }, context)).toBeUndefined();
  });

  it("checks types", async () => {
    expect(await validateRule("nope", { type: "email" }, context)).toBe(
      "Email must be a valid email"
    );
    expect(await validateRule("a@b.co", { type: "email" }, context)).toBeUndefined();
    expect(await validateRule(1.5, { type: "integer" }, context)).toBeDefined();
    expect(await validateRule("https://x.dev", { type: "url" }, context)).toBeUndefined();
  });

  it("reads min and max as length for strings and value for numbers", async () => {
    // One rule name for both is what keeps the API small.
    expect(await validateRule("ab", { min: 3 }, context)).toMatch(/at least 3 characters/);
    expect(await validateRule(2, { min: 3 }, context)).toMatch(/at least 3$/);
    expect(await validateRule([1], { min: 2 }, context)).toMatch(/at least 2 characters/);
  });

  it("checks exact length and pattern", async () => {
    expect(await validateRule("ab", { len: 3 }, context)).toMatch(/exactly 3/);
    expect(await validateRule("abc", { pattern: /^\d+$/ }, context)).toMatch(/expected format/);
  });

  it("uses a custom message over the template", async () => {
    expect(await validateRule("", { required: true, message: "Need it" }, context)).toBe("Need it");
  });

  it("substitutes the label into templates", async () => {
    expect(await validateRule("", { required: true }, { ...context, label: "Postcode" })).toBe(
      "Postcode is required"
    );
  });

  it("takes messages from an override table, for locales", async () => {
    const message = await validateRule(
      "",
      { required: true },
      {
        ...context,
        messages: { required: "{label} manquant" },
      }
    );
    expect(message).toBe("Email manquant");
  });

  it("runs an async validator, and passes the whole form to it", async () => {
    const rule = {
      validator: async (value: unknown, values: unknown) =>
        value === (values as { other: string }).other ? undefined : "must match",
    };
    expect(await validateRule("a", rule, { label: "X", values: { other: "a" } })).toBeUndefined();
    expect(await validateRule("a", rule, { label: "X", values: { other: "b" } })).toBe(
      "must match"
    );
  });

  it("runs a validator even on an empty value, so 'required unless' works", async () => {
    const rule = { validator: () => "always" };
    expect(await validateRule("", rule, context)).toBe("always");
  });

  it("skips a rule whose condition does not hold", async () => {
    const rule = { required: true, when: (values: unknown) => (values as { on: boolean }).on };
    expect(await validateRule("", rule, { label: "X", values: { on: false } })).toBeUndefined();
    expect(await validateRule("", rule, { label: "X", values: { on: true } })).toBeDefined();
  });

  it("stops at the first failing rule, so one field reports one error", async () => {
    const message = await validateRules("", [{ required: true }, { min: 5 }], context);
    expect(message).toBe("Email is required");
  });
});
