import { describe, expect, it, vi } from "vitest";
import { createFormStore } from "./store";

interface Values {
  email: string;
  password: string;
  confirm: string;
  contacts: Array<{ name: string }>;
}

const initialValues: Values = { email: "", password: "", confirm: "", contacts: [] };

const form = (overrides = {}) =>
  createFormStore<Values>({
    initialValues,
    fields: {
      email: { label: "Email", rules: [{ required: true, type: "email" }] },
      password: { label: "Password", rules: [{ required: true, min: 8 }] },
      confirm: {
        label: "Confirm",
        dependencies: ["password"],
        rules: [
          {
            validator: (value, values) =>
              value === (values as Values).password ? undefined : "must match",
          },
        ],
      },
    },
    ...overrides,
  });

describe("form store", () => {
  it("reads and writes nested values without mutating", () => {
    const store = form();
    store.setFieldValue("contacts[0].name", "Ada");
    expect(store.getFieldValue("contacts[0].name")).toBe("Ada");
    expect(initialValues.contacts).toEqual([]);
  });

  it("sets several fields at once", () => {
    const store = form();
    store.setFieldsValue({ email: "a@b.co", password: "secret123" });
    expect(store.getFieldValue("email")).toBe("a@b.co");
    expect(store.getFieldValue("password")).toBe("secret123");
  });

  describe("validation triggers", () => {
    it("does not validate on change by default", () => {
      // Validating every keystroke says an email is invalid while someone is
      // typing the first character of it.
      const store = form();
      store.setFieldValue("email", "no");
      expect(store.getFieldError("email")).toBeUndefined();
    });

    it("validates on blur", async () => {
      const store = form();
      store.setFieldValue("email", "no");
      store.blur("email");
      await vi.waitFor(() => expect(store.getFieldError("email")).toMatch(/valid email/));
    });

    it("validates on change when asked", async () => {
      const store = form({ validateTrigger: "change" });
      store.setFieldValue("email", "no");
      await vi.waitFor(() => expect(store.getFieldError("email")).toBeDefined());
    });

    it("lets a field override the form's trigger", async () => {
      const store = createFormStore<Values>({
        initialValues,
        validateTrigger: "submit",
        fields: {
          email: { rules: [{ required: true }], validateTrigger: "change" },
        },
      });
      store.setFieldValue("email", "");
      await vi.waitFor(() => expect(store.getFieldError("email")).toBeDefined());
    });

    it("clears a visible error as soon as the value becomes valid", async () => {
      // Even under a blur trigger: leaving a stale message under a corrected
      // field reads as the correction not registering.
      const store = form();
      store.setFieldValue("email", "no");
      store.blur("email");
      await vi.waitFor(() => expect(store.getFieldError("email")).toBeDefined());

      store.setFieldValue("email", "a@b.co");
      await vi.waitFor(() => expect(store.getFieldError("email")).toBeUndefined());
    });
  });

  describe("dependencies", () => {
    it("re-validates a touched dependent when its source changes", async () => {
      const store = form();
      store.setFieldValue("password", "secret123");
      store.setFieldValue("confirm", "secret123");
      store.blur("confirm");
      await vi.waitFor(() => expect(store.getFieldError("confirm")).toBeUndefined());

      store.setFieldValue("password", "different");
      await vi.waitFor(() => expect(store.getFieldError("confirm")).toBe("must match"));
    });

    it("leaves an untouched dependent alone", async () => {
      // Otherwise changing a password puts an error on a confirmation field
      // nobody has visited yet.
      const store = form();
      store.setFieldValue("password", "secret123");
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(store.getFieldError("confirm")).toBeUndefined();
    });
  });

  describe("submit", () => {
    it("validates everything and reports failure without calling the handler", async () => {
      const onSubmit = vi.fn();
      const store = form({ onSubmit });
      expect(await store.submit()).toBe(false);
      expect(onSubmit).not.toHaveBeenCalled();
      expect(store.getFieldError("email")).toBeDefined();
      expect(store.getFieldError("password")).toBeDefined();
    });

    it("surfaces every error at once, not one per attempt", async () => {
      const store = form();
      await store.submit();
      expect(Object.keys(store.getState().errors).sort()).toEqual(["email", "password"]);
    });

    it("marks every field touched, so errors on unvisited fields can show", async () => {
      const store = form();
      await store.submit();
      expect(store.getState().touched).toMatchObject({ email: true, password: true });
    });

    it("calls the handler with the values when valid", async () => {
      const onSubmit = vi.fn();
      const store = form({ onSubmit });
      store.setFieldsValue({ email: "a@b.co", password: "secret123", confirm: "secret123" });
      expect(await store.submit()).toBe(true);
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ email: "a@b.co" }));
    });

    it("counts attempts and clears submitting afterwards", async () => {
      const store = form();
      await store.submit();
      expect(store.getState().submitCount).toBe(1);
      expect(store.getState().submitting).toBe(false);
    });

    it("clears submitting even when the handler throws", async () => {
      // Otherwise a failed request leaves the form's buttons disabled forever.
      const store = form({
        onSubmit: () => {
          throw new Error("network");
        },
      });
      store.setFieldsValue({ email: "a@b.co", password: "secret123", confirm: "secret123" });
      await expect(store.submit()).rejects.toThrow("network");
      expect(store.getState().submitting).toBe(false);
    });
  });

  describe("errors", () => {
    it("accepts an externally set error, for a server rejection", () => {
      const store = form();
      store.setFieldError("email", "Already taken");
      expect(store.getFieldError("email")).toBe("Already taken");
      store.setFieldError("email", undefined);
      expect(store.getFieldError("email")).toBeUndefined();
    });

    it("drops an unregistered field's error", async () => {
      // A removed list row would otherwise keep the form invalid forever with
      // no visible cause.
      const store = form();
      const unregister = store.register("temp", { rules: [{ required: true }] });
      await store.validateFields(["temp"]);
      expect(store.getFieldError("temp")).toBeDefined();

      unregister();
      expect(store.getFieldError("temp")).toBeUndefined();
      expect(await store.validateFields()).toBe(false); // email/password still invalid
    });
  });

  describe("list fields", () => {
    it("appends and reports the new index", () => {
      const store = form();
      expect(store.listAppend("contacts", { name: "Ada" })).toBe(0);
      expect(store.listAppend("contacts", { name: "Grace" })).toBe(1);
      expect(store.getFieldValue("contacts")).toEqual([{ name: "Ada" }, { name: "Grace" }]);
    });

    it("removes a row", () => {
      const store = form();
      store.listAppend("contacts", { name: "Ada" });
      store.listAppend("contacts", { name: "Grace" });
      store.listRemove("contacts", 0);
      expect(store.getFieldValue("contacts")).toEqual([{ name: "Grace" }]);
    });

    it("re-indexes errors when a row is removed", () => {
      // Errors are keyed by path, so removing row 0 would otherwise leave
      // row 1's error sitting on what is now row 0.
      const store = form();
      store.listAppend("contacts", { name: "a" });
      store.listAppend("contacts", { name: "b" });
      store.listAppend("contacts", { name: "c" });
      store.setFieldError("contacts[1].name", "second");
      store.setFieldError("contacts[2].name", "third");

      store.listRemove("contacts", 1);

      expect(store.getFieldError("contacts[1].name")).toBe("third");
      expect(store.getFieldError("contacts[2].name")).toBeUndefined();
    });

    it("drops the removed row's own error", () => {
      const store = form();
      store.listAppend("contacts", { name: "a" });
      store.listAppend("contacts", { name: "b" });
      store.setFieldError("contacts[0].name", "first");
      store.listRemove("contacts", 0);
      expect(store.getFieldError("contacts[0].name")).toBeUndefined();
    });

    it("leaves unrelated errors alone", () => {
      const store = form();
      store.listAppend("contacts", { name: "a" });
      store.setFieldError("email", "bad");
      store.listRemove("contacts", 0);
      expect(store.getFieldError("email")).toBe("bad");
    });

    it("ignores an out-of-range index", () => {
      const store = form();
      store.listAppend("contacts", { name: "a" });
      store.listRemove("contacts", 9);
      expect(store.getFieldValue("contacts")).toHaveLength(1);
    });

    it("moves a row", () => {
      const store = form();
      store.listAppend("contacts", { name: "a" });
      store.listAppend("contacts", { name: "b" });
      store.listAppend("contacts", { name: "c" });
      store.listMove("contacts", 0, 2);
      expect(store.getFieldValue("contacts")).toEqual([
        { name: "b" },
        { name: "c" },
        { name: "a" },
      ]);
    });
  });

  describe("reset and subscription", () => {
    it("restores the initial values and clears everything else", async () => {
      const store = form();
      store.setFieldValue("email", "x");
      await store.submit();
      store.reset();

      expect(store.getState()).toMatchObject({
        values: initialValues,
        errors: {},
        touched: {},
        submitCount: 0,
      });
    });

    it("resets to explicit values when given them", () => {
      const store = form();
      store.reset({ ...initialValues, email: "seed@b.co" });
      expect(store.getFieldValue("email")).toBe("seed@b.co");
    });

    it("notifies subscribers and stops on unsubscribe", () => {
      const store = form();
      const listener = vi.fn();
      const unsubscribe = store.subscribe(listener);

      store.setFieldValue("email", "a");
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      store.setFieldValue("email", "b");
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  it("tracks async validation in flight", async () => {
    const store = createFormStore<Values>({
      initialValues,
      fields: {
        email: {
          rules: [{ validator: () => new Promise(resolve => setTimeout(() => resolve(), 5)) }],
        },
      },
    });
    const pending = store.validateField("email");
    expect(store.getState().validating.email).toBe(true);
    await pending;
    expect(store.getState().validating.email).toBeUndefined();
  });
});
