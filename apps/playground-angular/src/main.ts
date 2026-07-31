import "@angular/compiler";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import "@crosskit-ui/styles";
import { App } from "./app";

// Zoneless on purpose: the whole point of the binding is that it drives zag
// machines from signals, with zone.js absent from the bundle.
bootstrapApplication(App, {
  providers: [provideZonelessChangeDetection()],
}).catch(error => console.error(error));
