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

  const runField = async (path: string): Promise<string | undefined> => {
    const config = fields.get(path);
    if (!config?.rules?.length) return undefined;

    const value = getPath(state.values, path);
    const hasAsync = config.rules.some(rule => rule.validator);
    if (hasAsync) patch({ validating: { ...state.validating, [path]: true } });

    const message = await validateRules(value, config.rules, {
      label: config.label ?? path,
      values: state.values,
      messages: options.messages,
    });

    const errors = message ? { ...state.errors, [path]: message } : without(state.errors, path);
    patch({
      errors,
      validating: hasAsync ? without(state.validating, path) : state.validating,
    });
    return message;
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
    },

    setFieldsValue(values) {
      let next = state.values;
      for (const [path, value] of Object.entries(values)) next = setPath(next, path, value);
      patch({ values: next });
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

      const valid = await store.validateFields();
      if (!valid) {
        patch({ submitting: false });
        return false;
      }

      try {
        await options.onSubmit?.(state.values);
        return true;
      } finally {
        // In `finally` so a throwing handler cannot leave the form permanently
        // submitting, with its buttons disabled and no way back.
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

      // Errors are keyed by path, so removing row 1 of 3 would leave row 2's
      // error sitting on what is now row 1. Re-index them with the values.
      const errors: Record<string, string> = {};
      const touched: Record<string, boolean> = {};
      const prefix = `${path}[`;
      const remap = <V>(source: Record<string, V>, target: Record<string, V>) => {
        for (const [key, value] of Object.entries(source)) {
          if (!key.startsWith(prefix)) {
            target[key] = value;
            continue;
          }
          const match = /^\[(\d+)\](.*)$/.exec(key.slice(path.length));
          if (!match) {
            target[key] = value;
            continue;
          }
          const at = Number(match[1]);
          if (at === index) continue;
          target[`${path}[${at > index ? at - 1 : at}]${match[2]}`] = value;
        }
      };
      remap(state.errors, errors);
      remap(state.touched, touched);

      patch({ values: deletePath(state.values, `${path}[${index}]`), errors, touched });
    },

    listMove(path, from, to) {
      const list = [...((getPath(state.values, path) as unknown[]) ?? [])];
      if (from < 0 || from >= list.length || to < 0 || to >= list.length) return;
      const [moved] = list.splice(from, 1);
      list.splice(to, 0, moved);
      patch({ values: setPath(state.values, path, list) });
    },
  };

  return store;
}
