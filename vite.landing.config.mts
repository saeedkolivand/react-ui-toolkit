import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Landing page. Deployed at the GitHub Pages root; Storybook lives at /storybook/.
// .mts + import.meta.dirname (not __dirname) so this loads under Vite's native
// config loader, which becomes the default in a future major.
export default defineConfig({
  root: "landing",
  base: process.env.LANDING_BASE || "/react-ui-toolkit/",
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "./src") },
  },
  build: {
    outDir: "../landing-dist",
    emptyOutDir: true,
  },
});
