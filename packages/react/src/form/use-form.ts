"use client";

/**
 * The React shell over `core`'s form store.
 *
 * The store is plain TypeScript with no reactivity in it — values, errors,
 * touched state, rules, dependencies and list re-indexing all live there, so
 * four adapters cannot disagree about when a field validates. What is left here
 * is subscription and context, which is the part each framework does its own
 * way.
 */

import { createContext, use, useEffect, useState, useSyncExternalStore } from "react";
import {
  createFormStore,
  getPath,
  type FormOptions,
  type FormStore,
  type RuleMessages,
  type ValidateTrigger,
} from "@crosskit-ui/core";

/** What `useForm()` hands back. The store's own surface, unchanged. */
export type FormInstance<T extends object = Record<string, unknown>> = FormStore<T>;

/**
 * A field name, relative to whatever `Form.List` it sits in.
 *
 * The array form is what makes a list usable: `[field.name, "email"]` inside a
 * `Form.List name="users"` resolves to `users[0].email`, with the prefix coming
 * from context rather than from the caller pasting it in.
 */
export type NamePath = string | (string | number)[];

/**
 * `("users", [0, "email"])` → `"users[0].email"`.
 *
 * A number is always an index and a string is always a key, which is the same
 * distinction `parsePath` makes in the other direction — so a path built here
 * and read there cannot disagree about whether `items.0` is an array.
 */
export function joinPath(prefix: string, name: NamePath): string {
  let path = prefix;
  for (const part of Array.isArray(name) ? name : [name]) {
    if (typeof part === "number") path += `[${part}]`;
    else path = path ? `${path}.${part}` : part;
  }
  return path;
}

/**
 * Every store's own options object, kept so `<Form>` can write to it.
 *
 * `createFormStore` reads `onSubmit`, `messages`, `validateTrigger` and
 * `initialValues` out of its options at CALL time rather than at creation — so
 * writing to the same object is what lets all four be props of `<Form>` while
 * the instance comes from a `useForm()` call above it, which cannot see them.
 *
 * A `WeakMap` rather than a property on the instance: the public type is the
 * store's own surface and nothing here should widen it, and an entry cannot
 * outlive the form it belongs to.
 */
// Keyed and valued loosely on purpose: the map holds one entry per store and
// each is read back at the same type it went in under, which no single
// parameterisation of a shared map can express.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LIVE = new WeakMap<object, FormOptions<any>>();

/** The options object behind a store this module created. */
export function liveOptions<T extends object>(form: FormInstance<T>): FormOptions<T> | undefined {
  return LIVE.get(form) as FormOptions<T> | undefined;
}

export interface FormContextValue {
  form: FormInstance<never> | FormInstance<Record<string, unknown>>;
  /** Path prefix contributed by any enclosing `Form.List`. */
  prefix: string;
  disabled: boolean;
  layout: "horizontal" | "vertical" | "inline";
  requiredMark: boolean;
  validateTrigger?: ValidateTrigger | ValidateTrigger[];
}

export const FormContext = createContext<FormContextValue | null>(null);

/** Throws rather than no-oping: a `Form.Item` outside a `Form` binds to nothing. */
export function useFormContext(component: string): FormContextValue {
  const context = use(FormContext);
  if (!context) throw new Error(`<${component}> must be rendered inside a <Form>.`);
  return context;
}

/**
 * Creates a form instance.
 *
 * Returns a one-element array, matching the API this library mirrors. It reads
 * oddly and it is deliberate: a consumer pasting `const [form] = Form.useForm()`
 * has to get a form.
 */
export function useForm<T extends object = Record<string, unknown>>(): [FormInstance<T>] {
  // A lazy initialiser, so the store is built once and never on a re-render.
  // The tuple is held in state too, so the identity a consumer spreads or
  // compares is stable as well as the instance inside it.
  const [instance] = useState<[FormInstance<T>]>(() => [create<T>({} as T)]);
  return instance;
}

export function create<T extends object>(initialValues: T): FormInstance<T> {
  const options: FormOptions<T> = { initialValues };
  const form = createFormStore<T>(options);
  LIVE.set(form, options);
  return form;
}

/**
 * Keeps a store in step with the `<Form>` that renders it.
 *
 * In an effect rather than during render: writing to something outside React
 * while rendering is not safe under concurrent rendering, and nothing reads
 * these until a user does something, which is always after effects have run.
 */
export function useFormLive<T extends object>(
  form: FormInstance<T>,
  values: {
    onSubmit?: (values: T) => void | Promise<void>;
    messages?: Partial<RuleMessages>;
    validateTrigger?: ValidateTrigger | ValidateTrigger[];
    initialValues?: T;
  }
) {
  // No dependency array, so it runs after every render and closes over the
  // props as they are now. A ref updated during render would say the same thing
  // and break the rule that nothing outside React is written to while
  // rendering, which the compiler enforces rather than suggests.
  useEffect(() => {
    const options = liveOptions(form);
    if (!options) return;
    const { onSubmit, messages, validateTrigger, initialValues } = values;
    options.onSubmit = onSubmit;
    options.messages = messages;
    options.validateTrigger = validateTrigger;
    // `reset()` with no argument restores whatever this is, so it has to track
    // the prop. An instance from `useForm()` is created before `<Form>` renders
    // and starts out with an empty object — leaving this alone meant Reset
    // emptied every field on a form whose instance the consumer owned, which is
    // the arrangement the API documents.
    if (initialValues) options.initialValues = initialValues;
  });
}

/**
 * One subscription per value read, deliberately.
 *
 * `useSyncExternalStore` compares snapshots by identity, so a selector
 * returning a fresh `{ value, error }` object on every call re-renders forever.
 * Each of these returns a primitive or a reference the store itself keeps
 * stable — `setPath` rebuilds only the branches it touched, so an untouched
 * field's value is the same object it was before.
 */
export function useFormValue<T extends object>(form: FormInstance<T>, path: string): unknown {
  return useSyncExternalStore(
    form.subscribe,
    () => getPath(form.getState().values, path),
    () => undefined
  );
}

export function useFormError<T extends object>(
  form: FormInstance<T>,
  path: string
): string | undefined {
  return useSyncExternalStore(
    form.subscribe,
    () => form.getState().errors[path],
    () => undefined
  );
}

export function useFormFlag<T extends object>(
  form: FormInstance<T>,
  select: (state: ReturnType<FormInstance<T>["getState"]>) => boolean
): boolean {
  return useSyncExternalStore(
    form.subscribe,
    () => select(form.getState()),
    () => false
  );
}
