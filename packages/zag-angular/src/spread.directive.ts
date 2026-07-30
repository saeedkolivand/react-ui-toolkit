// The piece with no counterpart in the React/Vue/Svelte adapters: those spread
// prop-getter output through JSX/template syntax. Angular has no runtime spread,
// so this applies the flat dict by hand.
//
// The stale-attribute removal is NOT optional: `data-state`, `aria-expanded` and
// `data-highlighted` toggling IS the CSS system. An add-only spread leaves
// data-state="open" stuck forever and every exit animation breaks.
import { Directive, ElementRef, DestroyRef, effect, inject, input, Renderer2 } from "@angular/core";
import { DOM_PROPERTY_KEYS } from "./normalize-props";

@Directive({ selector: "[zagSpread]", standalone: true })
export class ZagSpread {
  readonly zagSpread = input.required<Record<string, any>>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private applied = new Set<string>();
  private listeners: VoidFunction[] = [];

  constructor() {
    effect(() => this.apply(this.zagSpread() ?? {}));
    inject(DestroyRef).onDestroy(() => this.dropListeners());
  }

  private dropListeners() {
    this.listeners.forEach(off => off());
    this.listeners = [];
  }

  private apply(next: Record<string, any>) {
    this.dropListeners();
    const node = this.el.nativeElement;
    const nextKeys = new Set<string>();

    for (const key in next) {
      const value = next[key];

      // normalize-props lowercases everything, so handlers arrive as `onclick`.
      if (key.startsWith("on") && typeof value === "function") {
        this.listeners.push(this.renderer.listen(node, key.slice(2), value));
        continue;
      }
      if (value === undefined) continue;

      if (key === "style" && typeof value === "string") {
        // normalize-props already stringified it
        node.setAttribute("style", value);
        nextKeys.add("style");
        continue;
      }

      nextKeys.add(key);

      if (DOM_PROPERTY_KEYS.has(key)) {
        this.renderer.setProperty(node, key, value);
        continue;
      }
      if (value === null || value === false) {
        this.renderer.removeAttribute(node, key);
        continue;
      }
      this.renderer.setAttribute(node, key, value === true ? "" : String(value));
    }

    // remove attributes that vanished since the previous render
    for (const key of this.applied) {
      if (!nextKeys.has(key)) this.renderer.removeAttribute(node, key);
    }
    this.applied = nextKeys;
  }
}
