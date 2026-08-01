"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  dataAttr,
  hasContent,
  type FieldConfig,
  type Rule,
  type ValidateTrigger,
} from "@crosskit-ui/core";
import { useConfig } from "../config/config-provider";
import {
  FormContext,
  create,
  joinPath,
  useForm,
  useFormContext,
  useFormError,
  useFormFlag,
  useFormLive,
  useFormValue,
  type FormInstance,
  type NamePath,
} from "./use-form";

export type FormLayout = "horizontal" | "vertical" | "inline";

export interface FormProps<T extends object = Record<string, unknown>> extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  "onSubmit" | "children"
> {
  /** From `Form.useForm()`. Omit and the form owns its own instance. */
  form?: FormInstance<T>;
  initialValues?: T;
  /** Runs with the values once every field has passed. */
  onFinish?: (values: T) => void | Promise<void>;
  /** Runs instead, with the errors, when something has not. */
  onFinishFailed?: (errors: Record<string, string>) => void;
  layout?: FormLayout;
  /** When every field validates, unless a field says otherwise. */
  validateTrigger?: ValidateTrigger | ValidateTrigger[];
  /** Disables every bound control beneath it. */
  disabled?: boolean;
  /** Show the marker beside a required field's label. */
  requiredMark?: boolean;
  children?: ReactNode;
}

export function Form<T extends object = Record<string, unknown>>({
  form: provided,
  initialValues,
  onFinish,
  onFinishFailed,
  layout = "vertical",
  validateTrigger,
  disabled = false,
  requiredMark = true,
  className,
  children,
  ...rest
}: FormProps<T>) {
  const { locale } = useConfig();

  /**
   * The instance this form renders, created here unless one was handed in.
   *
   * A lazy initialiser rather than a `useMemo`: memo is a performance hint React
   * is allowed to discard, and a discarded form store loses every value in it.
   *
   * An instance from `useForm()` is created above this component and cannot see
   * `initialValues`, so it is seeded here — once, inside the initialiser, before
   * any child renders. From an effect the first paint would show empty fields
   * and then fill them in, which reads as the values having been lost.
   */
  const [fallback] = useState(() => {
    if (provided) {
      // Only the values it shows NOW. What `reset()` restores later is written
      // by `useFormLive` from an effect, which runs before anything can ask —
      // setting it here as well was measured to change nothing.
      if (initialValues) provided.reset(initialValues);
      return null;
    }
    return create<T>(initialValues ?? ({} as T));
  });
  const form = (provided ?? fallback) as FormInstance<T>;

  useFormLive(form, {
    onSubmit: onFinish,
    // The rule messages are templates in the locale pack, so a form's errors
    // translate with everything else rather than being the one English thing
    // left on a translated page.
    messages: locale.Form,
    validateTrigger,
    initialValues,
  });

  const submitting = useFormFlag(form, state => state.submitting);

  const context = useMemo(
    () => ({
      form: form as FormInstance<Record<string, unknown>>,
      prefix: "",
      disabled,
      layout,
      requiredMark,
      validateTrigger,
    }),
    [form, disabled, layout, requiredMark, validateTrigger]
  );

  return (
    <FormContext value={context}>
      <form
        data-scope="form"
        data-part="root"
        data-layout={layout}
        data-disabled={dataAttr(disabled)}
        data-submitting={dataAttr(submitting)}
        className={className}
        // `noValidate`, because the browser's own bubbles would fire before any
        // rule here runs and would say something different in a different
        // language. The rules are the contract; the browser's are not.
        noValidate
        onSubmit={event => {
          event.preventDefault();
          void form.submit().then(ok => {
            if (!ok) onFinishFailed?.(form.getState().errors);
          });
        }}
        onReset={event => {
          event.preventDefault();
          form.reset(initialValues);
        }}
        {...rest}
      >
        {children}
      </form>
    </FormContext>
  );
}

export interface FormItemProps {
  /** Omit for a row that only lays something out — no binding, no validation. */
  name?: NamePath;
  label?: ReactNode;
  rules?: Rule[];
  /** Other field paths whose change re-validates this one. */
  dependencies?: string[];
  /** The child prop that carries the value. `"checked"` for a checkbox. */
  valuePropName?: string;
  /** The child prop that reports a change. */
  trigger?: string;
  /** Turns the trigger's arguments into the stored value. */
  getValueFromEvent?: (...args: unknown[]) => unknown;
  validateTrigger?: ValidateTrigger | ValidateTrigger[];
  /** Replaces the message under the field. */
  help?: ReactNode;
  /** A hint under the field that is not an error. */
  extra?: ReactNode;
  /** Marks the label required without adding a rule. */
  required?: boolean;
  /** Bind the control and render nothing around it. */
  noStyle?: boolean;
  children?: ReactNode;
  className?: string;
}

export function FormItem({
  name,
  label,
  rules,
  dependencies,
  valuePropName = "value",
  trigger = "onChange",
  getValueFromEvent,
  validateTrigger,
  help,
  extra,
  required,
  noStyle = false,
  children,
  className,
}: FormItemProps) {
  const context = useFormContext("Form.Item");
  const form = context.form as FormInstance<Record<string, unknown>>;
  const path = name === undefined ? "" : joinPath(context.prefix, name);

  const autoId = useId();
  const controlId = `${autoId}-control`;
  const errorId = `${autoId}-error`;
  const extraId = `${autoId}-extra`;

  const value = useFormValue(form, path);
  const error = useFormError(form, path);

  /**
   * The registered config, kept in one object the store holds a reference to.
   *
   * Re-registering when it changes is not an option: `rules` is written inline
   * at the call site, so it is a new array every render — an effect keyed on it
   * would unregister and re-register on each one, and unregistering CLEARS the
   * field's error. A visible message would vanish on the next keystroke.
   *
   * So the object identity is stable and its contents are updated in place. The
   * store reads `rules` at validation time, which is always after this has run.
   */
  const configRef = useRef<FieldConfig>({});
  useEffect(() => {
    configRef.current.rules = rules;
    // A `label` may be any node; the messages need a string, and the path is
    // the only other thing that names this field.
    configRef.current.label = typeof label === "string" ? label : path;
    configRef.current.dependencies = dependencies;
    configRef.current.validateTrigger = validateTrigger;
  });
  useEffect(() => {
    if (!path) return;
    return form.register(path, configRef.current);
  }, [form, path]);

  const message = help === undefined ? error : help;
  const invalid = error !== undefined;
  const marked = required ?? rules?.some(rule => rule.required) ?? false;

  const child = isValidElement(children)
    ? (children as ReactElement<Record<string, unknown>>)
    : null;
  const childProps = (child?.props ?? {}) as Record<string, unknown>;

  /**
   * Everything describing this field, ours and the child's.
   *
   * Keyed on whether a MESSAGE is rendered rather than on whether there is an
   * error: a `help` string replaces the error text and renders in the same box
   * under the same id, so pointing at the id only when an error exists left the
   * box on screen with nothing referring to it — visible to a sighted reader
   * and silent to everyone else.
   *
   * The child's own value is kept rather than overwritten. `cloneElement`
   * writes an explicit `undefined` over an existing prop, so replacing this
   * would ERASE a child's `aria-describedby="hint"` on any field with no error
   * — the same swallow the trigger composition above exists to avoid.
   */
  const describedBy =
    [
      hasContent(message) ? errorId : undefined,
      hasContent(extra) ? extraId : undefined,
      childProps["aria-describedby"] as string | undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  /**
   * The trigger's arguments, as a value.
   *
   * An event-like first argument is unwrapped through the same prop name the
   * value goes back in under, which is what makes one default cover a text
   * input (`target.value`) and a checkbox (`target.checked`). Anything else is
   * already the value: our own controls report `onChange(next)` directly.
   */
  const resolve = (...args: unknown[]): unknown => {
    if (getValueFromEvent) return getValueFromEvent(...args);
    const first = args[0] as { target?: Record<string, unknown> } | null | undefined;
    if (first && typeof first === "object" && first.target) return first.target[valuePropName];
    return first;
  };

  const bound =
    child && path
      ? cloneElement(child, {
          // React switches a control between uncontrolled and controlled — and
          // says so, loudly — the moment the bound prop goes undefined, so an
          // unset field needs an empty value of the right SHAPE. A text field's
          // is `""` and a checkbox's is `false`; `""` in a `checked` is falsy
          // and looks right, and is the wrong type on every framework that
          // checks.
          [valuePropName]: value ?? (valuePropName === "checked" ? false : ""),
          [trigger]: (...args: unknown[]) => {
            form.setFieldValue(path, resolve(...args));
            // Composed, never replaced. A consumer's own handler on the control
            // is theirs; swallowing it is the failure mode that makes cloning
            // dangerous, and it is the one thing this has to get right.
            (childProps[trigger] as ((...a: unknown[]) => void) | undefined)?.(...args);
          },
          onBlur: (...args: unknown[]) => {
            form.blur(path);
            (childProps.onBlur as ((...a: unknown[]) => void) | undefined)?.(...args);
          },
          id: (childProps.id as string | undefined) ?? controlId,
          disabled: (childProps.disabled as boolean | undefined) ?? context.disabled,
          // The asterisk beside the label is decoration — a screen reader that
          // reads "asterisk Email" has told nobody the field is required. This
          // is what actually carries it.
          "aria-required": marked ? true : (childProps["aria-required"] as boolean | undefined),
          // `aria-invalid` is only meaningful when it is true, so it is omitted
          // rather than stated as false — and the child's own answer stands
          // when this form has no error of its own to report.
          "aria-invalid": invalid ? true : (childProps["aria-invalid"] as boolean | undefined),
          "aria-describedby": describedBy,
        })
      : children;

  if (noStyle) return <>{bound}</>;

  return (
    <div
      data-scope="form"
      data-part="item"
      data-invalid={dataAttr(invalid)}
      data-required={dataAttr(marked && context.requiredMark)}
      className={className}
    >
      {hasContent(label) && (
        <label
          data-scope="form"
          data-part="label"
          htmlFor={(childProps.id as string | undefined) ?? controlId}
        >
          {label}
        </label>
      )}
      <div data-scope="form" data-part="control">
        {bound}
        {/* `hasContent`, not `!= null`: `{touched && error}` is `false`, which a
            null check lets through and renders as an empty box holding its own
            margin under every valid field on the page. */}
        {hasContent(message) && (
          <div data-scope="form" data-part="error" id={errorId}>
            {message}
          </div>
        )}
        {hasContent(extra) && (
          <div data-scope="form" data-part="extra" id={extraId}>
            {extra}
          </div>
        )}
      </div>
    </div>
  );
}

export interface FormListField {
  /** Stable across insert and remove, so React keeps the right row's DOM. */
  key: string;
  /** The row's index, for `name={[field.name, "email"]}`. */
  name: number;
}

export interface FormListOperations {
  add: (value?: unknown) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
}

export interface FormListProps {
  name: NamePath;
  children: (fields: FormListField[], operations: FormListOperations) => ReactNode;
}

export function FormList({ name, children }: FormListProps) {
  const context = useFormContext("Form.List");
  const form = context.form as FormInstance<Record<string, unknown>>;
  const path = joinPath(context.prefix, name);
  const value = useFormValue(form, path);
  const rows = Array.isArray(value) ? value.length : 0;

  /**
   * Keys that survive a removal.
   *
   * Indices cannot be the key: removing row 1 of three shifts row 2 into index
   * 1, so React reuses the removed row's DOM for it — the caret, any scroll
   * position and any uncontrolled state inside stay behind on the wrong row.
   * A counter handed out per row keeps the identity that the index loses.
   *
   * State rather than a ref, and adjusted during render rather than from an
   * effect. A ref written to while rendering is the thing the compiler refuses
   * outright, and an effect is a render too late — a row appended this render
   * has to have its key in the markup this render, not the next one.
   *
   * Adjusting state during render is the documented way to do that: React
   * re-runs the component immediately, before anything is committed, so a
   * discarded render cannot leave a key half-allocated.
   */
  const [allocated, setAllocated] = useState<{ keys: string[]; next: number }>({
    keys: [],
    next: 0,
  });

  let keys = allocated.keys;
  if (keys.length < rows) {
    const grown = [...keys];
    let next = allocated.next;
    while (grown.length < rows) grown.push(`row-${next++}`);
    keys = grown;
    setAllocated({ keys: grown, next });
  }

  const fields: FormListField[] = Array.from({ length: rows }, (_, index) => ({
    key: keys[index]!,
    name: index,
  }));

  const operations: FormListOperations = {
    add(initial) {
      form.listAppend(path, initial);
    },
    remove(index) {
      // The key list moves with the values, or every row below the removed one
      // inherits the key of the row above it — which is the index behaviour
      // these keys exist to avoid.
      setAllocated(current => ({
        ...current,
        keys: current.keys.filter((_, at) => at !== index),
      }));
      form.listRemove(path, index);
    },
    move(from, to) {
      setAllocated(current => {
        const moved = [...current.keys];
        const [taken] = moved.splice(from, 1);
        if (taken !== undefined) moved.splice(to, 0, taken);
        return { ...current, keys: moved };
      });
      form.listMove(path, from, to);
    },
  };

  // The prefix is what makes `name={[field.name, "email"]}` resolve to
  // `users[0].email` — the rows are rendered by the caller, so there is nothing
  // for us to wrap and the path has to arrive through context.
  const nested = useMemo(() => ({ ...context, prefix: path }), [context, path]);

  return <FormContext value={nested}>{children(fields, operations)}</FormContext>;
}

Form.Item = FormItem;
Form.List = FormList;
// Reachable both ways, because both are in circulation: `Form.useForm()` is the
// documented spelling and the bare `useForm` is what a barrel import gives.
Form.useForm = useForm;
