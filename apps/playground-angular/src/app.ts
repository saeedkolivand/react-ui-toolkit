import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { CkModal } from "@crosskit-ui/angular";
import { ZagSpread } from "@crosskit-ui/zag-angular";

/**
 * The harness the zag-angular behaviour suite drives. Every id here is asserted
 * by `e2e/dialog.spec.ts`, so they are part of the contract, not decoration.
 */
@Component({
  selector: "app-root",
  standalone: true,
  imports: [CkModal, ZagSpread],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main>
      <!-- The trigger carries the machine's own trigger props, which is what
           lets zag restore focus to it on close. -->
      <button [zagSpread]="modal.triggerProps()">Open dialog</button>

      <p>
        Parent sees: <span id="parent-state">{{ open() ? "OPEN" : "CLOSED" }}</span>
      </p>

      <button id="toggle-esc" (click)="closeOnEscape.set(!closeOnEscape())">
        closeOnEscape: {{ closeOnEscape() }}
      </button>
      <button id="toggle-outside" (click)="closeOnOutside.set(!closeOnOutside())">
        closeOnInteractOutside: {{ closeOnOutside() }}
      </button>

      <ck-modal
        #modal
        [(open)]="open"
        title="Spike dialog"
        description="Driven by @zag-js/dialog through the Angular binding."
        [closeOnEscape]="closeOnEscape()"
        [closeOnInteractOutside]="closeOnOutside()"
      >
        <button id="first-focusable">First</button>
        <button id="last-focusable">Last</button>
      </ck-modal>
    </main>
  `,
})
export class App {
  readonly open = signal(false);
  readonly closeOnEscape = signal(true);
  readonly closeOnOutside = signal(true);
}
