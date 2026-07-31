import { Component } from "@angular/core";
import {
  CkAccordion,
  CkAlert,
  CkAvatar,
  CkBadge,
  CkButton,
  CkCard,
  CkCheckbox,
  CkCol,
  CkDivider,
  CkIcon,
  CkInput,
  CkPanel,
  CkProgress,
  CkRadio,
  CkRadioGroup,
  CkRow,
  CkSelect,
  CkSpinner,
  CkSwitch,
  CkTable,
  CkTabs,
  CkTag,
  CkTextarea,
} from "@crosskit-ui/angular";
import { FIXTURE } from "./fixture";

/**
 * Same page as the other three playgrounds. The parity spec screenshots each
 * and asserts the images match between frameworks; same CSS plus same markup
 * means the same pixels, so a difference is a markup divergence.
 */
@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CkAccordion,
    CkAlert,
    CkAvatar,
    CkBadge,
    CkButton,
    CkCard,
    CkCheckbox,
    CkCol,
    CkDivider,
    CkIcon,
    CkInput,
    CkPanel,
    CkProgress,
    CkRadio,
    CkRadioGroup,
    CkRow,
    CkSelect,
    CkSpinner,
    CkSwitch,
    CkTable,
    CkTabs,
    CkTag,
    CkTextarea,
  ],
  template: `
    <section class="parity-section" data-fixture="button">
      <h2>Button</h2>
      <div class="parity-row">
        @for (variant of fixture.buttonVariants; track variant) {
          <button ckButton [variant]="variant">{{ variant }}</button>
        }
      </div>
      <div class="parity-row">
        @for (size of fixture.sizes; track size) {
          <button ckButton [size]="size" icon="check">{{ size }}</button>
        }
        <button ckButton loading>loading</button>
        <button ckButton disabled>disabled</button>
      </div>
    </section>

    <section class="parity-section" data-fixture="icon">
      <h2>Icon &amp; Spinner</h2>
      <div class="parity-row">
        @for (name of fixture.icons; track name) {
          <svg ckIcon [name]="name"></svg>
        }
        <ck-spinner />
        <ck-spinner size="lg" />
      </div>
    </section>

    <section class="parity-section" data-fixture="badge">
      <h2>Badge &amp; Tag</h2>
      <div class="parity-row">
        @for (variant of fixture.badgeVariants; track variant) {
          <span ckBadge [variant]="variant">{{ variant }}</span>
        }
      </div>
      <div class="parity-row">
        @for (color of fixture.tagColors; track color) {
          <ck-tag [color]="color">{{ color }}</ck-tag>
        }
      </div>
    </section>

    <section class="parity-section" data-fixture="alert">
      <h2>Alert</h2>
      @for (variant of fixture.alertVariants; track variant) {
        <ck-alert [variant]="variant" [title]="variant">{{ fixture.text }}</ck-alert>
      }
    </section>

    <section class="parity-section" data-fixture="card">
      <h2>Card &amp; Divider</h2>
      <div class="parity-grid">
        <ck-card variant="default">{{ fixture.text }}</ck-card>
        <ck-card variant="primary">{{ fixture.text }}</ck-card>
      </div>
      <ck-divider label="or" />
    </section>

    <section class="parity-section" data-fixture="field">
      <h2>Input &amp; Textarea</h2>
      <div class="parity-grid">
        <ck-input label="Email" [placeholder]="fixture.email" helperText="Never shared." />
        <ck-input label="Broken" [placeholder]="fixture.email" invalid errorMessage="Required" />
        <ck-textarea label="Notes" [placeholder]="fixture.text" />
        <ck-select label="Country" [items]="fixture.countries" defaultValue="ng" />
      </div>
    </section>

    <section class="parity-section" data-fixture="toggle">
      <h2>Toggles</h2>
      <div class="parity-row">
        <ck-checkbox label="Unchecked" />
        <ck-checkbox label="Checked" [checked]="true" />
        <ck-checkbox label="Invalid" invalid />
        <ck-switch label="Off" />
        <ck-switch label="On" [checked]="true" />
      </div>
      <ck-radio-group label="Size">
        @for (size of fixture.sizes; track size) {
          <ck-radio name="parity-size" [value]="size" [label]="size" [selected]="'md'" />
        }
      </ck-radio-group>
    </section>

    <section class="parity-section" data-fixture="display">
      <h2>Avatar &amp; Progress</h2>
      <div class="parity-row">
        <ck-avatar alt="Ada Lovelace" />
        <ck-avatar alt="Grace Hopper" size="lg" status="online" />
        <ck-avatar alt="Alan Turing" squared bordered />
      </div>
      <ck-progress [value]="fixture.progress" label="Uploading" showValue />
    </section>

    <section class="parity-section" data-fixture="layout">
      <h2>Layout</h2>
      <ck-row [spacing]="4">
        <ck-col [span]="8"><ck-card variant="default">span 8</ck-card></ck-col>
        <ck-col [span]="4"><ck-card variant="default">span 4</ck-card></ck-col>
      </ck-row>
    </section>

    <section class="parity-section" data-fixture="tabs">
      <h2>Tabs</h2>
      <ck-tabs [items]="fixture.tabs" [defaultValue]="fixture.tabs[0].id">
        @for (tab of fixture.tabs; track tab.id) {
          <ng-template [ckPanel]="tab.id">{{ fixture.text }}</ng-template>
        }
      </ck-tabs>
    </section>

    <section class="parity-section" data-fixture="accordion">
      <h2>Accordion</h2>
      <ck-accordion [items]="fixture.accordion" [defaultValue]="[fixture.accordion[0].id]">
        @for (item of fixture.accordion; track item.id) {
          <ng-template [ckPanel]="item.id">{{ fixture.text }}</ng-template>
        }
      </ck-accordion>
    </section>

    <section class="parity-section" data-fixture="table">
      <h2>Table</h2>
      <ck-table [data]="fixture.people" [columns]="fixture.columns" [pageSize]="3" />
    </section>
  `,
})
export class ParityComponent {
  protected readonly fixture = FIXTURE;
}
