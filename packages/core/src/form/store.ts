/**
 * The form store: values, errors, touched state, validation and submission.
 *
 * Framework-free, so one implementation of "when does this field validate" and
 * "which fields re-validate when this one changes" serves four adapters. Those
 * two questions are where form libraries diverge from each other, and where
 * four hand-written implementations would diverge from each other too.
 */

import { deletePath, getPath, setPath } from "./path";
import { validateRules, type Rule, type RuleMessages } from "./rules";

export type ValidateTrigger = "change" | "blur" | "submit";

export interface FieldConfig {
  /** Used in messages. Defaults to the field name. */
  label?: string;
  rules?: Rule[];
  /** When this field validates. Defaults to the form's setting. */
  validateTrigger?: ValidateTrigger | ValidateTrigger[];
  /**
   * Other field paths whose change should re-validate this one — a password
   * confirmation, a date range's end.
   */
  dependencies?: string[];
}

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  /** Fields with an async validator in flight. */
  validating: Record<string, boolean>;
  submitting: boolean;
  /** How many times submission has been attempted, successfully or not. */
  submitCount: number;
}

export interface FormOptions<T> {
  initialValues: T;
  fields?: Record<string, FieldConfig>;
  validateTrigger?: ValidateTrigger | ValidateTrigger[];
  messages?: Partial<RuleMessages>;
  onSubmit?: (values: T) => void | Promise<void>;
  onStateChange?: (state: FormState<T>) => void;
}

export interface FormStore<T> {
  getState(): FormState<T>;
  subscribe(listener: () => void): () => void;

  getFieldValue(path: string): unknown;
  setFieldValue(path: string, value: unknown): void;
  setFieldsValue(values: Partial<T>): void;
  getFieldError(path: string): string | undefined;
  setFieldError(path: string, message: string | undefined): void;

  /** Marks a field touched and runs its blur-triggered validation. */
  blur(path: string): void;
  register(path: string, config: FieldConfig): () => void;

  validateField(path: string): Promise<string | undefined>;
  /** Validates every registered field. Resolves to whether the form is valid. */
  validateFields(paths?: string[]): Promise<boolean>;
  submit(): Promise<boolean>;
  reset(values?: T): void;

  /** Appends to a list field and returns the new index. */
  listAppend(path: string, value: unknown): number;
  listRemove(path: string, index: number): void;
  listMove(path: string, from: number, to: number): void;
}

/**
 * Re-keys the entries of a per-field map when a list's indices move.
 *
 * Errors and touched state are keyed by path, so any change to a list's order
 * or length has to move them with the values. `next` returns the row's new
 * index, or `null` for a row that is going away.
 */
function remapListKeys<V>(
  source: Record<string, V>,
  path: string,
  next: (index: number) => number | null
): Record<string, V> {
  const target: Record<string, V> = {};
  for (const [key, value] of Object.entries(source)) {
    if (!key.startsWith(`${path}[`)) {
      target[key] = value;
      continue;
    }
    const match = /^\[(\d+)\](.*)$/.exec(key.slice(path.length));
    if (!match) {
      target[key] = value;
      continue;
    }
    const moved = next(Number(match[1]));
    if (moved === null) continue;
    target[`${path}[${moved}]${match[2]}`] = value;
  }
  return target;
}

const asTriggers = (trigger: ValidateTrigger | ValidateTrigger[] | undefined): ValidateTrigger[] =>
  trigger === undefined ? [] : Array.isArray(trigger) ? trigger : [trigger];

export function createFormStore<T extends object>(options: FormOptions<T>): FormStore<T> {
  const fields = new Map<string, FieldConfig>(Object.entries(options.fields ?? {}));
  const listeners = new Set<() => void>();

  let state: FormState<T> = {
    values: options.initialValues,
    errors: {},
    touched: {},
    validating: {},
    submitting: false,
    submitCount: 0,
  };

  const emit = () => {
    for (const listener of listeners) listener();
    options.onStateChange?.(state);
  };

  const patch = (next: Partial<FormState<T>>) => {
    state = { ...state, ...next };
    emit();
  };

  /** Drops a key entirely rather than storing `undefined`, so `in` checks stay honest. */
  const without = <V>(record: Record<string, V>, key: string): Record<string, V> => {
    const { [key]: _removed, ...rest } = record;
    return rest;
  };

  const triggersFor = (path: string): ValidateTrigger[] => {
    const configured = asTriggers(fields.get(path)?.validateTrigger);
    if (configured.length > 0) return configured;
    const formLevel = asTriggers(options.validateTrigger);
    // Blur by default: validating on every keystroke tells someone their email
    // is invalid while they are still typing the first character of it.
    return formLevel.length > 0 ? formLevel : ["blur", "submit"];
  };

  /** Fields that declared a dependency on `path`. */
  const dependents = (path: string): string[] =>
    [...fields.entries()]
      .filter(([, config]) => config.dependencies?.includes(path))
      .map(([name]) => name);

  /**
   * What has to happen after any write, however it arrived.
   *
   * Shared by `setFieldValue` and `setFieldsValue` so the two cannot drift:
   * which of them an adapter reaches for must not change what the user sees.
   */
  const afterWrite = (path: string) => {
    if (triggersFor(path).includes("change")) void runField(path);
    // An error already on screen clears as soon as the value becomes valid,
    // even under a blur trigger — leaving a stale message under a corrected
    // field reads as the correction not having registered.
    else if (state.errors[path]) void runField(path);

    // A dependent only re-validates once it has been touched. Validating an
    // untouched confirmation field the moment the password changes puts an
    // error on a field nobody has visited.
    for (const dependent of dependents(path)) {
      if (state.touched[dependent]) void runField(dependent);
    }
  };

  const runField = async (path: string): Promise<string | undefined> => {
    const config = fields.get(path);
    if (!config?.rules?.length) return undefined;

    const value = getPath(state.values, path);
    const hasAsync = config.rules.some(rule => rule.validator);
    if (hasAsync) patch({ validating: { ...state.validating, [path]: true } });

    try {
      const message = await validateRules(value, config.rules, {
        label: config.label ?? path,
        values: state.values,
        messages: options.messages,
      });

      patch({
        errors: message ? { ...state.errors, [path]: message } : without(state.errors, path),
      });
      return message;
    } finally {
      // A validator that *rejects* rather than resolving a message -- an
      // offline "is this taken?" check is the ordinary way to produce one --
      // would otherwise leave this field spinning forever. The rejection still
      // propagates; only the flag is guaranteed to clear.
      if (hasAsync) patch({ validating: without(state.validating, path) });
    }
  };

  const store: FormStore<T> = {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    getFieldValue: path => getPath(state.values, path),

    setFieldValue(path, value) {
      patch({ values: setPath(state.values, path, value) });
      afterWrite(path);
    },

    setFieldsValue(values) {
      const paths = Object.keys(values);
      let next = state.values;
      for (const [path, value] of Object.entries(values)) next = setPath(next, path, value);
      // One patch for every value, so a bulk write is a single notification
      // rather than one per field.
      patch({ values: next });
      // Then the same per-path rules `setFieldValue` applies. Skipping them
      // meant a "fill from saved profile" button left a stale error under a
      // field it had just corrected -- the exact reading those rules exist to
      // prevent, reachable only through the other of two equivalent APIs.
      for (const path of paths) afterWrite(path);
    },

    getFieldError: path => state.errors[path],

    setFieldError(path, message) {
      // The seam for server-side errors: a submission rejected by an API maps
      // onto the same error surface as a local rule.
      patch({
        errors: message ? { ...state.errors, [path]: message } : without(state.errors, path),
      });
    },

    blur(path) {
      patch({ touched: { ...state.touched, [path]: true } });
      if (triggersFor(path).includes("blur")) void runField(path);
    },

    register(path, config) {
      fields.set(path, config);
      return () => {
        fields.delete(path);
        // A field that leaves the form takes its error with it, or a removed
        // list row keeps the form invalid forever with no visible cause.
        patch({ errors: without(state.errors, path), touched: without(state.touched, path) });
      };
    },

    validateField: runField,

    async validateFields(paths) {
      const targets = paths ?? [...fields.keys()];
      const messages = await Promise.all(targets.map(runField));
      // Everything is validated, not stopped at the first failure: a submit
      // should surface every problem at once rather than one per attempt.
      return messages.every(message => message === undefined);
    },

    async submit() {
      patch({ submitting: true, submitCount: state.submitCount + 1 });
      // Every field counts as touched on submit, so errors on fields never
      // visited are allowed to show.
      const touched = { ...state.touched };
      for (const path of fields.keys()) touched[path] = true;
      patch({ touched });

      try {
        // Validation is inside the `try`, not before it. A rejecting validator
        // reaches `submit` exactly as a throwing handler does, and leaving it
        // outside meant that path escaped the guard below -- the same permanent
        // lock-out, arriving from the other direction.
        if (!(await store.validateFields())) return false;
        await options.onSubmit?.(state.values);
        return true;
      } finally {
        // A throwing handler cannot leave the form permanently submitting, with
        // its buttons disabled and no way back.
        patch({ submitting: false });
      }
    },

    reset(values) {
      state = {
        values: values ?? options.initialValues,
        errors: {},
        touched: {},
        validating: {},
        submitting: false,
        submitCount: 0,
      };
      emit();
    },

    listAppend(path, value) {
      const list = (getPath(state.values, path) as unknown[]) ?? [];
      patch({ values: setPath(state.values, path, [...list, value]) });
      return list.length;
    },

    listRemove(path, index) {
      const list = (getPath(state.values, path) as unknown[]) ?? [];
      if (index < 0 || index >= list.length) return;

      patch({
        values: deletePath(state.values, `${path}[${index}]`),
        errors: remapListKeys(state.errors, path, at =>
          at === index ? null : at > index ? at - 1 : at
        ),
        touched: remapListKeys(state.touched, path, at =>
          at === index ? null : at > index ? at - 1 : at
        ),
      });
    },

    listMove(path, from, to) {
      const list = [...((getPath(state.values, path) as unknown[]) ?? [])];
      if (from < 0 || from >= list.length || to < 0 || to >= list.length) return;
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);

      // The same re-indexing `listRemove` does. Without it a reordered row
      // keeps its old key, so its error renders under whichever row took its
      // place -- and drag-to-reorder is the ordinary way to produce that.
      const shift = (at: number) => {
        if (at === from) return to;
        if (from < to) return at > from && at <= to ? at - 1 : at;
        return at >= to && at < from ? at + 1 : at;
      };

      patch({
        values: setPath(state.values, path, list),
        errors: remapListKeys(state.errors, path, shift),
        touched: remapListKeys(state.touched, path, shift),
      });
    },
  };

  return store;
}
