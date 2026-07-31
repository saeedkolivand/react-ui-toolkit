import { describe, expect, it } from "vitest";
import { createCollection, type CollectionItem } from "./collection";
import { createTypeahead, navigate, type KeyDescription } from "./navigation";

const items: CollectionItem[] = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana", disabled: true },
  { value: "c", label: "Cherry" },
  { value: "d", label: "Date" },
];

const collection = createCollection(items);

describe("collection", () => {
  it("skips disabled items when stepping", () => {
    expect(collection.next("a")?.value).toBe("c");
    expect(collection.previous("c")?.value).toBe("a");
  });

  it("treats no selection as before the first item", () => {
    // "next from nothing" is the first item, not the second.
    expect(collection.next(null)?.value).toBe("a");
    expect(collection.previous(null)?.value).toBe("d");
  });

  it("treats an unknown value as no selection", () => {
    expect(collection.next("nope")?.value).toBe("a");
  });

  it("wraps by default and stops at the ends when told not to", () => {
    expect(collection.next("d")?.value).toBe("a");
    expect(collection.previous("a")?.value).toBe("d");
    expect(collection.next("d", { loop: false })).toBeUndefined();
    expect(collection.previous("a", { loop: false })).toBeUndefined();
  });

  it("never returns a disabled item from first or last", () => {
    const edged = createCollection([
      { value: "x", label: "X", disabled: true },
      { value: "y", label: "Y" },
      { value: "z", label: "Z", disabled: true },
    ]);
    expect(edged.first()?.value).toBe("y");
    expect(edged.last()?.value).toBe("y");
  });

  it("terminates when every item is disabled", () => {
    // The bounded walk matters here: an "advance until enabled" loop spins.
    const none = createCollection([
      { value: "x", label: "X", disabled: true },
      { value: "y", label: "Y", disabled: true },
    ]);
    expect(none.next("x")).toBeUndefined();
    expect(none.previous("y")).toBeUndefined();
    expect(none.first()).toBeUndefined();
  });

  it("handles an empty collection", () => {
    const empty = createCollection([]);
    expect(empty.next(null)).toBeUndefined();
    expect(empty.first()).toBeUndefined();
    expect(empty.search("a")).toBeUndefined();
  });

  describe("search", () => {
    it("matches a label prefix, case insensitively", () => {
      expect(collection.search("ch")?.value).toBe("c");
      expect(collection.search("CH")?.value).toBe("c");
    });

    it("skips disabled matches", () => {
      expect(collection.search("ba")).toBeUndefined();
    });

    it("starts past the current item and wraps, so repeats cycle", () => {
      const fruit = createCollection([
        { value: "1", label: "Cherry" },
        { value: "2", label: "Cranberry" },
        { value: "3", label: "Coconut" },
      ]);
      expect(fruit.search("c", "1")?.value).toBe("2");
      expect(fruit.search("c", "2")?.value).toBe("3");
      expect(fruit.search("c", "3")?.value).toBe("1");
    });

    it("returns nothing for an empty query", () => {
      expect(collection.search("")).toBeUndefined();
    });
  });
});

describe("navigate", () => {
  const key = (k: string, extra: Partial<KeyDescription> = {}): KeyDescription => ({
    key: k,
    ...extra,
  });

  it("moves with the vertical arrows by default", () => {
    expect(navigate(key("ArrowDown"), collection, "a")).toEqual({ value: "c", handled: true });
    expect(navigate(key("ArrowUp"), collection, "c")).toEqual({ value: "a", handled: true });
  });

  it("ignores horizontal arrows when vertical", () => {
    expect(navigate(key("ArrowRight"), collection, "a")).toEqual({ handled: false });
  });

  it("moves with horizontal arrows when horizontal", () => {
    const options = { orientation: "horizontal" as const };
    expect(navigate(key("ArrowRight"), collection, "a", options)).toMatchObject({ value: "c" });
    expect(navigate(key("ArrowDown"), collection, "a", options)).toEqual({ handled: false });
  });

  it("accepts both axes when orientation is both", () => {
    const options = { orientation: "both" as const };
    expect(navigate(key("ArrowRight"), collection, "a", options)).toMatchObject({ value: "c" });
    expect(navigate(key("ArrowDown"), collection, "a", options)).toMatchObject({ value: "c" });
  });

  it("mirrors the horizontal arrows under rtl", () => {
    const options = { orientation: "horizontal" as const, rtl: true };
    // ArrowRight moves toward the start of the list when text runs right to left.
    expect(navigate(key("ArrowRight"), collection, "c", options)).toMatchObject({ value: "a" });
    expect(navigate(key("ArrowLeft"), collection, "a", options)).toMatchObject({ value: "c" });
  });

  it("jumps to the ends with Home and End", () => {
    expect(navigate(key("Home"), collection, "c")).toMatchObject({ value: "a" });
    expect(navigate(key("End"), collection, "a")).toMatchObject({ value: "d" });
  });

  it("leaves modified keys to the browser", () => {
    // Ctrl+Home is "top of document", not "first item".
    for (const modifier of ["ctrlKey", "metaKey", "altKey"] as const) {
      expect(navigate(key("Home", { [modifier]: true }), collection, "c")).toEqual({
        handled: false,
      });
    }
  });

  it("reports handled even when the move produces nothing", () => {
    // Otherwise the key falls through to the page and scrolls it, which is the
    // visible symptom of an arrow key at the end of a non-looping list.
    const result = navigate(key("ArrowDown"), collection, "d", { loop: false });
    expect(result).toEqual({ handled: true });
  });

  it("does not consume unrelated keys", () => {
    expect(navigate(key("Enter"), collection, "a")).toEqual({ handled: false });
    expect(navigate(key("Tab"), collection, "a")).toEqual({ handled: false });
  });

  describe("typeahead", () => {
    const options = { typeahead: true };

    it("jumps to a matching label", () => {
      const buffer = createTypeahead();
      expect(navigate(key("c"), collection, "a", options, buffer)).toMatchObject({ value: "c" });
    });

    it("accumulates characters so a second letter narrows", () => {
      const buffer = createTypeahead();
      const fruit = createCollection([
        { value: "1", label: "Cherry" },
        { value: "2", label: "Coconut" },
      ]);
      expect(navigate(key("c"), fruit, null, options, buffer)).toMatchObject({ value: "1" });
      expect(navigate(key("o"), fruit, "1", options, buffer)).toMatchObject({ value: "2" });
    });

    it("cycles when the same letter repeats", () => {
      // Holding one key walks through the matches rather than sticking on the
      // first, which is what every native select does.
      const buffer = createTypeahead();
      const fruit = createCollection([
        { value: "1", label: "Cherry" },
        { value: "2", label: "Cranberry" },
        { value: "3", label: "Coconut" },
      ]);
      expect(navigate(key("c"), fruit, null, options, buffer)).toMatchObject({ value: "1" });
      expect(navigate(key("c"), fruit, "1", options, buffer)).toMatchObject({ value: "2" });
      expect(navigate(key("c"), fruit, "2", options, buffer)).toMatchObject({ value: "3" });
    });

    it("is off unless asked for", () => {
      const buffer = createTypeahead();
      expect(navigate(key("c"), collection, "a", {}, buffer)).toEqual({ handled: false });
    });

    it("leaves space alone, since it selects rather than searches", () => {
      const buffer = createTypeahead();
      expect(navigate(key(" "), collection, "a", options, buffer)).toEqual({ handled: false });
    });

    it("consumes a letter that matches nothing", () => {
      // Otherwise the key reaches the page underneath.
      const buffer = createTypeahead();
      expect(navigate(key("z"), collection, "a", options, buffer)).toEqual({ handled: true });
    });
  });
});

describe("createTypeahead", () => {
  it("accumulates then clears", () => {
    const buffer = createTypeahead();
    expect(buffer.push("a")).toBe("a");
    expect(buffer.push("b")).toBe("ab");
    buffer.clear();
    expect(buffer.query).toBe("");
  });
});
