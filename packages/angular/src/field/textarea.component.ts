import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import type { FieldVariant, Size } from "@crosskit-ui/core";
import { ckAriaAttr, ckDataAttr } from "@crosskit-ui/zag-angular";

let uid = 0;

@Component({
  selector: "ck-textarea",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "data-scope": "textarea",
    "data-part": "field",
    "[attr.data-variant]": "variant()",
    "[attr.data-invalid]": "attr(invalid())",
    "[attr.data-full-width]": "attr(fullWidth())",
  },
  template: `
    @if (label()) {
      <label data-part="label" [attr.for]="textareaId()">{{ label() }}</label>
    }
    <!-- Auto-resize is CSS; data-value feeds the invisible replica that sizes
         the grid cell. One DOM write on input, no measurement, no hooks. -->
    <div
      data-scope="textarea"
      data-part="control"
      [attr.data-auto-resize]="attr(autoResize())"
      [attr.data-value]="autoResize() ? value() : null"
    >
      <textarea
        [id]="textareaId()"
        data-scope="textarea"
        data-part="input"
        [attr.data-size]="size()"
        [disabled]="disabled()"
        [attr.aria-invalid]="aria(invalid())"
        [attr.aria-describedby]="describedBy()"
        [value]="value()"
        (input)="onInput($event)"
      ></textarea>
    </div>
    @if (errorMessage()) {
      <p [id]="textareaId() + '-error'" data-part="error-text">{{ errorMessage() }}</p>
    } @else if (helperText()) {
      <p [id]="textareaId() + '-helper'" data-part="helper-text">{{ helperText() }}</p>
    }
  `,
})
export class CkTextarea {
  readonly variant = input<FieldVariant>("default");
  readonly size = input<Size>("md");
  readonly label = input<string>();
  readonly helperText = input<string>();
  readonly errorMessage = input<string>();
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly autoResize = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly id = input<string>();
  readonly value = input("");

  private readonly instanceId = `ck-textarea-${++uid}`;
  protected readonly textareaId = computed(() => this.id() ?? this.instanceId);
  protected readonly describedBy = computed(() =>
    this.errorMessage()
      ? `${this.textareaId()}-error`
      : this.helperText()
        ? `${this.textareaId()}-helper`
        : null
  );

  protected readonly attr = ckDataAttr;
  protected readonly aria = ckAriaAttr;

  protected onInput(event: Event) {
    if (!this.autoResize()) return;
    const el = event.target as HTMLTextAreaElement;
    el.parentElement?.setAttribute("data-value", el.value);
  }
}
