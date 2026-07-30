import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// Landing page. Deployed at the root of the custom domain crosskit.iamsaeed.dev;
// Storybook lives at /storybook/. The base is "/" rather than a repo-name path
// because the site is served from a custom domain, not a github.io subpath.
// .mts + import.meta.dirname (not __dirname) so this loads under Vite's native
// config loader, which becomes the default in a future major.
export default defineConfig({
  root: "landing",
  base: process.env.LANDING_BASE || "/",
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(import.meta.dirname, "./src") },
  },
  build: {
    outDir: "../landing-dist",
    emptyOutDir: true,
  },
});
