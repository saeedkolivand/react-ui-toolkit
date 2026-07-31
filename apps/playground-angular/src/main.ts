import "@angular/compiler";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import "@crosskit-ui/styles";
import "./parity.css";
import { App } from "./app";
import { ParityComponent } from "./parity.component";

// Zoneless on purpose: the whole point of the binding is that it drives zag
// machines from signals, with zone.js absent from the bundle.
// Which root component, rather than a branch inside one: ?view=parity renders
// the cross-framework parity page, everything else the dialog harness that the
// zag-angular behaviour suite drives.
const parity = new URLSearchParams(location.search).get("view") === "parity";

bootstrapApplication(parity ? ParityComponent : App, {
  providers: [provideZonelessChangeDetection()],
}).catch(error => console.error(error));
