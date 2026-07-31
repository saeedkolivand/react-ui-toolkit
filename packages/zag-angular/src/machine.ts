// Angular-signals port of @zag-js/svelte/dist/machine.svelte.js.
//
// Everything between `debug` and `send` is copied unchanged — it is plain TS with
// no framework surface. Only four things are substituted:
//   $derived.by / $derived  ->  computed()
//   bindable (svelte)       ->  bindable (signals)
//   onMount                 ->  afterNextRender   (browser-only, DOM exists)
//   onDestroy               ->  DestroyRef.onDestroy
//
// MUST be called in an injection context (i.e. a field initializer), never ngOnInit.
import { afterNextRender, computed, DestroyRef, inject, Injector } from '@angular/core';
import {
  createScope,
  findTransition,
  getExitEnterStates,
  hasTag,
  INIT_STATE,
  MachineStatus,
  matchesState,
  resolveStateValue,
} from '@zag-js/core';
import { callAll, compact, ensure, isFunction, isString, toArray, warn } from '@zag-js/utils';
import { bindable } from './bindable';
import { useRefs } from './refs';
import { track } from './track';

function access<T>(userProps: T | (() => T)): T {
  if (isFunction(userProps)) return (userProps as () => T)();
  return userProps as T;
}

export function useMachine(machine: any, userProps: any = {}): any {
  const injector = inject(Injector);
  const destroyRef = inject(DestroyRef);

  const scopeSignal = computed(() => {
    const { id, ids, getRootNode } = access(userProps) ?? ({} as any);
    return createScope({ id, ids, getRootNode });
  });

  const debug = (...args: any[]) => {
    if (machine.debug) console.log(...args);
  };

  const propsSignal = computed(
    () =>
      machine.props?.({ props: compact(access(userProps)), scope: scopeSignal() }) ??
      access(userProps),
  );
  const prop = (key: string) => (propsSignal() as any)[key];

  const context = machine.context?.({
    prop,
    bindable: (p: any) => bindable(p, injector),
    get scope() {
      return scopeSignal();
    },
    flush,
    getContext() {
      return ctx;
    },
    getComputed() {
      return computedFn;
    },
    getRefs() {
      return refs;
    },
    getEvent() {
      return getEvent();
    },
  });

  const ctx = {
    get(key: string) {
      return context?.[key].get();
    },
    set(key: string, value: any) {
      context?.[key].set(value);
    },
    initial(key: string) {
      return context?.[key].initial;
    },
    hash(key: string) {
      const current = context?.[key].get();
      return context?.[key].hash(current);
    },
  };

  let effects = new Map<string, VoidFunction>();
  let transitionRef: { current: any } = { current: null };
  let previousEventRef: { current: any } = { current: null };
  let eventRef: { current: any } = { current: { type: '' } };

  const getEvent = () => ({
    ...eventRef.current,
    current: () => eventRef.current,
    previous: () => previousEventRef.current,
  });

  const getState = () => ({
    ...state,
    hasTag: (tag: string) => hasTag(machine, state.get(), tag),
    matches: (...values: any[]) => values.some((v) => matchesState(state.get(), v)),
  });

  const refs = useRefs(machine.refs?.({ prop, context: ctx }) ?? {});

  const getParams = (): any => ({
    state: getState(),
    context: ctx,
    event: getEvent(),
    prop,
    send,
    action,
    guard,
    track: (deps: any, fn: any) => track(deps, fn, injector),
    refs,
    computed: computedFn,
    flush,
    scope: scopeSignal(),
    choose,
  });

  const action = (keys: any) => {
    const strs = isFunction(keys) ? keys(getParams()) : keys;
    if (!strs) return;
    const fns = strs.map((s: string) => {
      const fn = machine.implementations?.actions?.[s];
      if (!fn) warn(`[zag-js] No implementation found for action "${JSON.stringify(s)}"`);
      return fn;
    });
    for (const fn of fns) fn?.(getParams());
  };

  const guard = (str: any) => {
    if (isFunction(str)) return str(getParams());
    const fn = machine.implementations?.guards?.[str];
    if (!fn) warn(`[zag-js] No implementation found for guard "${JSON.stringify(str)}"`);
    return fn?.(getParams());
  };

  const effect = (keys: any) => {
    const strs = isFunction(keys) ? keys(getParams()) : keys;
    if (!strs) return;
    const fns = strs.map((s: string) => {
      const fn = machine.implementations?.effects?.[s];
      if (!fn) warn(`[zag-js] No implementation found for effect "${JSON.stringify(s)}"`);
      return fn;
    });
    const cleanups: any[] = [];
    for (const fn of fns) {
      const cleanup = fn?.(getParams());
      if (cleanup) cleanups.push(cleanup);
    }
    return () => cleanups.forEach((fn) => fn?.());
  };

  const choose = (transitions: any) =>
    toArray(transitions).find((t: any) => {
      let result = !t.guard;
      if (isString(t.guard)) result = !!guard(t.guard);
      else if (isFunction(t.guard)) result = t.guard(getParams());
      return result;
    });

  const computedFn = (key: string) => {
    ensure(machine.computed, () => `[zag-js] No computed object found on machine`);
    const fn = machine.computed[key];
    return fn({
      context: ctx,
      event: getEvent(),
      prop,
      refs,
      scope: scopeSignal(),
      computed: computedFn,
    });
  };

  const state = bindable<any>(
    () => ({
      defaultValue: resolveStateValue(machine, machine.initialState({ prop })),
      onChange(nextState: any, prevState: any) {
        const { exiting, entering } = getExitEnterStates(
          machine,
          prevState,
          nextState,
          transitionRef.current?.reenter,
        );
        exiting.forEach((item: any) => {
          const exitEffects = effects.get(item.path);
          exitEffects?.();
          effects.delete(item.path);
        });
        exiting.forEach((item: any) => action(item.state?.exit));
        action(transitionRef.current?.actions);
        entering.forEach((item: any) => {
          const cleanup = effect(item.state?.effects);
          if (cleanup) {
            const existing = effects.get(item.path);
            effects.set(item.path, existing ? callAll(existing, cleanup) : cleanup);
          }
        });
        if (prevState === INIT_STATE) {
          action(machine.entry);
          const cleanup = effect(machine.effects);
          if (cleanup) {
            const existing = effects.get(INIT_STATE);
            effects.set(INIT_STATE, existing ? callAll(existing, cleanup) : cleanup);
          }
        }
        entering.forEach((item: any) => action(item.state?.entry));
      },
    }),
    injector,
  );

  let status = MachineStatus.NotStarted;

  // afterNextRender, not the constructor: machine entry effects touch real DOM
  // (focus trap, scroll lock, popper measurement). It also never runs on the
  // server, which gives us React's browser-only useSafeLayoutEffect semantics.
  afterNextRender(
    () => {
      const started = status === MachineStatus.Started;
      status = MachineStatus.Started;
      debug(started ? 'rehydrating...' : 'initializing...');
      state.invoke(state.initial, INIT_STATE);
    },
    { injector },
  );

  destroyRef.onDestroy(() => {
    if (status !== MachineStatus.Started) return;
    debug('unmounting...');
    status = MachineStatus.Stopped;
    effects.forEach((fn) => fn?.());
    effects = new Map();
    transitionRef.current = null;
    action(machine.exit);
  });

  // Re-entrancy guard. bindable.set() flushes change detection so the DOM is
  // committed before zag's rAF-deferred effects resolve their elements — but
  // that flush runs Angular effects, and one of those is `track`, which can
  // call send() again *in the middle of the current transition*. Processing a
  // nested event before the outer one has registered its state effects leaves
  // the machine with listeners from the wrong state (observed as a dialog that
  // opens but no longer responds to Escape). Queue instead, and drain after.
  let sending = false;
  const sendQueue: any[] = [];

  const send = (event: any) => {
    if (status !== MachineStatus.Started) return;
    if (sending) {
      sendQueue.push(event);
      return;
    }
    sending = true;
    try {
      sendImpl(event);
    } finally {
      sending = false;
      while (sendQueue.length) sendImpl(sendQueue.shift());
    }
  };

  const sendImpl = (event: any) => {
    previousEventRef.current = eventRef.current;
    eventRef.current = event;

    const currentState = state.get();
    const { transitions, source } = findTransition(machine, currentState, event.type);
    const transition = choose(transitions);
    if (!transition) return;

    transitionRef.current = transition;
    const target = resolveStateValue(machine, transition.target ?? currentState, source);
    debug('transition', event.type, transition.target || currentState, `(${transition.actions})`);

    const changed = target !== currentState;
    if (changed) state.set(target);
    else if (transition.reenter) state.invoke(currentState, currentState);
    else action(transition.actions);
  };

  machine.watch?.(getParams());

  return {
    get state() {
      return getState();
    },
    send,
    context: ctx,
    prop,
    get scope() {
      return scopeSignal();
    },
    refs,
    computed: computedFn,
    get event() {
      return getEvent();
    },
    getStatus: () => status,
  };
}

// Svelte uses flushSync here. Angular has no synchronous DOM flush; in a zoneless
// app a signal write already schedules change detection, so a microtask is enough
// to let the machine read post-commit DOM.
// NOTE: machines that use `sync: true` to measure the DOM immediately (combobox /
// select typeahead) are the ones to re-verify — see spike criterion 13.
function flush(fn: VoidFunction) {
  queueMicrotask(() => fn());
}
