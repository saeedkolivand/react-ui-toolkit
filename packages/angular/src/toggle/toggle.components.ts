import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  viewChild,
} from "@angular/core";
import type { Orientation, Size } from "@crosskit-ui/core";
import { ckAriaAttr, ckDataAttr } from "@crosskit-ui/zag-angular";

let uid = 0;

@Component({
  selector: "ck-checkbox",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      data-scope="checkbox"
      data-part="root"
      [attr.data-disabled]="attr(disabled())"
      [attr.data-invalid]="attr(invalid())"
      [attr.for]="inputId()"
    >
      <input
        #control
        [id]="inputId()"
        type="checkbox"
        data-part="control"
        [attr.data-size]="size()"
        [disabled]="disabled()"
        [attr.aria-invalid]="aria(invalid())"
        [checked]="checked()"
        (change)="checked.set($any($event.target).checked)"
      />
      @if (label()) {
        <span data-part="label">{{ label() }}</span>
      }
    </label>
  `,
})
export class CkCheckbox {
  readonly size = input<Size>("md");
  readonly label = input<string>();
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly checked = model(false);
  readonly id = input<string>();

  private readonly control = viewChild<ElementRef<HTMLInputElement>>("control");
  private readonly instanceId = `ck-checkbox-${++uid}`;
  protected readonly inputId = computed(() => this.id() ?? this.instanceId);
  protected readonly attr = ckDataAttr;
  protected readonly aria = ckAriaAttr;

  constructor() {
    // `indeterminate` is a DOM property with no HTML attribute, so it cannot be
    // set through a template binding.
    effect(() => {
      const el = this.control()?.nativeElement;
      if (el) el.indeterminate = this.indeterminate();
    });
  }
}

/**
 * One real checkbox, one change event. v0 combined a wrapper onClick that
 * synthesised a fake event with an inner onChange, so a single interaction
 * could fire twice with different payload shapes.
 */
@Component({
  selector: "ck-switch",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      data-scope="switch"
      data-part="root"
      [attr.data-disabled]="attr(disabled())"
      [attr.for]="inputId()"
    >
      <input
        [id]="inputId()"
        type="checkbox"
        role="switch"
        data-part="hidden-input"
        [disabled]="disabled()"
        [checked]="checked()"
        (change)="checked.set($any($event.target).checked)"
      />
      <span data-part="control" [attr.data-size]="size()">
        <span data-part="thumb"></span>
      </span>
      @if (label()) {
        <span data-part="label">{{ label() }}</span>
      }
    </label>
  `,
})
export class CkSwitch {
  readonly size = input<Size>("md");
  readonly label = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly checked = model(false);
  readonly id = input<string>();

  private readonly instanceId = `ck-switch-${++uid}`;
  protected readonly inputId = computed(() => this.id() ?? this.instanceId);
  protected readonly attr = ckDataAttr;
}

@Component({
  selector: "ck-radio",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label
      data-scope="radio"
      data-part="root"
      [attr.data-disabled]="attr(disabled())"
      [attr.data-invalid]="attr(invalid())"
      [attr.for]="inputId()"
    >
      <input
        [id]="inputId()"
        type="radio"
        data-part="control"
        [attr.data-size]="size()"
        [disabled]="disabled()"
        [attr.name]="name()"
        [value]="value()"
        [checked]="isChecked()"
        (change)="selected.set(value())"
      />
      @if (label()) {
        <span data-part="label">{{ label() }}</span>
      }
    </label>
  `,
})
export class CkRadio {
  readonly size = input<Size>("md");
  readonly label = input<string>();
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string>();
  readonly value = input<string>();
  readonly checked = input(false, { transform: booleanAttribute });
  readonly id = input<string>();
  readonly selected = model<string | undefined>(undefined);

  /**
   * `selected` wins when it is bound, otherwise the standalone `checked` input.
   *
   * The template used to render `checked()` alone, so `[(selected)]` wrote the
   * value OUT on change and was never read back IN — a controlled radio group
   * could not display its own value. The parity matrix caught it: React showed
   * a checked radio where Angular showed none.
   */
  protected readonly isChecked = computed(() =>
    this.selected() !== undefined ? this.selected() === this.value() : this.checked()
  );

  private readonly instanceId = `ck-radio-${++uid}`;
  protected readonly inputId = computed(() => this.id() ?? this.instanceId);
  protected readonly attr = ckDataAttr;
  protected readonly aria = ckAriaAttr;
}

/**
 * A grouping wrapper, not a controller: native radios sharing a `name` already
 * handle selection and arrow-key navigation. This supplies the group semantics
 * screen readers need, which v0 never provided.
 */
@Component({
  selector: "ck-radio-group",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: "radiogroup",
    "[attr.aria-label]": "label() ?? null",
    "data-scope": "radio-group",
    "data-part": "root",
    "[attr.data-orientation]": "orientation()",
    "[attr.data-invalid]": "attr(invalid())",
    "[attr.aria-invalid]": "aria(invalid())",
  },
  template: `<ng-content />`,
})
export class CkRadioGroup {
  readonly orientation = input<Orientation>("horizontal");
  readonly label = input<string>();
  /**
   * Marks the whole group invalid. `aria-invalid` is NOT supported on
   * `role="radio"`; it belongs on the radiogroup. Only svelte-check flagged
   * that, so the wrong placement shipped in all four adapters — `data-invalid`
   * on the individual radio stays, for styling.
   */
  readonly invalid = input(false, { transform: booleanAttribute });
  protected readonly attr = ckDataAttr;
  protected readonly aria = ckAriaAttr;
}
