/**
 * Validation rules, and the messages they produce.
 *
 * Rules are data, not closures, so a form's validation can be serialised, sent
 * from a server, or generated — and the messages come from a template table
 * that a locale replaces wholesale. Hard-coding English inside each rule would
 * make translation a rewrite.
 */

export type RuleType = "string" | "number" | "boolean" | "array" | "email" | "url" | "integer";

export interface Rule {
  required?: boolean;
  type?: RuleType;
  /** Exact length for strings and arrays. */
  len?: number;
  /** Minimum: length for strings and arrays, value for numbers. */
  min?: number;
  max?: number;
  pattern?: RegExp;
  /** Return a message to fail, or nothing to pass. May be async. */
  validator?: (value: unknown, values: unknown) => string | void | Promise<string | void>;
  /** Overrides the templated message for whichever check fails. */
  message?: string;
  /** Skip this rule unless the predicate holds — dependent fields. */
  when?: (values: unknown) => boolean;
}

/** Message templates. `{label}`, `{min}`, `{max}`, `{len}` and `{type}` are substituted. */
export interface RuleMessages {
  required: string;
  type: string;
  len: string;
  min: string;
  max: string;
  minValue: string;
  maxValue: string;
  pattern: string;
}

export const defaultMessages: RuleMessages = {
  required: "{label} is required",
  type: "{label} must be a valid {type}",
  len: "{label} must be exactly {len} characters",
  min: "{label} must be at least {min} characters",
  max: "{label} must be at most {max} characters",
  minValue: "{label} must be at least {min}",
  maxValue: "{label} must be at most {max}",
  pattern: "{label} is not in the expected format",
};

const format = (template: string, values: Record<string, unknown>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    values[key] === undefined ? match : String(values[key])
  );

/** Blank for validation purposes. `0` and `false` are values, not blanks. */
export const isEmpty = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

// Deliberately loose. Strict address grammar rejects valid addresses, and the
// only real proof an address works is sending to it.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function checkType(value: unknown, type: RuleType): boolean {
  switch (type) {
    case "string":
      return typeof value === "string";
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "boolean":
      return typeof value === "boolean";
    case "array":
      return Array.isArray(value);
    case "email":
      return typeof value === "string" && EMAIL.test(value);
    case "url":
      try {
        new URL(String(value));
        return true;
      } catch {
        return false;
      }
  }
}

const sizeOf = (value: unknown): number | undefined =>
  typeof value === "string" || Array.isArray(value) ? value.length : undefined;

export interface ValidateContext {
  label: string;
  values: unknown;
  messages?: Partial<RuleMessages>;
}

/**
 * Runs one rule. Returns a message, or undefined if it passed.
 *
 * Every check except `required` skips a blank value: a field that is optional
 * and empty must not fail a `min` or a `type`, or every optional field in a
 * form reports an error before it has been touched.
 */
export async function validateRule(
  value: unknown,
  rule: Rule,
  context: ValidateContext
): Promise<string | undefined> {
  if (rule.when && !rule.when(context.values)) return undefined;

  const messages = { ...defaultMessages, ...context.messages };
  const say = (key: keyof RuleMessages, extra: Record<string, unknown> = {}) =>
    rule.message ?? format(messages[key], { label: context.label, ...extra });

  const empty = isEmpty(value);

  if (rule.required && empty) return say("required");
  // An empty optional field has nothing to check; the custom validator still
  // runs, because "required unless X" is a validator's job.
  if (empty && !rule.validator) return undefined;

  if (!empty) {
    if (rule.type && !checkType(value, rule.type)) return say("type", { type: rule.type });

    const size = sizeOf(value);
    if (rule.len !== undefined && size !== rule.len) return say("len", { len: rule.len });

    if (rule.min !== undefined) {
      // `min` means length for a string or array and value for a number, which
      // is what makes one rule usable for both without a separate name.
      if (size !== undefined && size < rule.min) return say("min", { min: rule.min });
      if (typeof value === "number" && value < rule.min) return say("minValue", { min: rule.min });
    }

    if (rule.max !== undefined) {
      if (size !== undefined && size > rule.max) return say("max", { max: rule.max });
      if (typeof value === "number" && value > rule.max) return say("maxValue", { max: rule.max });
    }

    if (rule.pattern && !rule.pattern.test(String(value))) return say("pattern");
  }

  if (rule.validator) {
    const result = await rule.validator(value, context.values);
    if (typeof result === "string" && result) return result;
  }

  return undefined;
}

/** Runs rules in order and stops at the first failure, so one field reports one error. */
export async function validateRules(
  value: unknown,
  rules: Rule[],
  context: ValidateContext
): Promise<string | undefined> {
  for (const rule of rules) {
    const message = await validateRule(value, rule, context);
    if (message) return message;
  }
  return undefined;
}
