import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";

// Vite + the Analog plugin rather than the Angular CLI: this app exists only to
// give the Playwright suite something real to drive, and the CLI's build graph
// would be far more machinery than that needs. The plugin is already in the
// repo's test toolchain for the same reason.
export default defineConfig({
  // The plugin looks for tsconfig.app.json by default; this app has one config.
  plugins: [angular({ tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)) })],
  server: { port: 4173 },
  preview: { port: 4173 },
});
