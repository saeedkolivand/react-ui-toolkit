import { defineConfig } from "astro/config";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://crosskit.iamsaeed.dev",
  // "/" because the site is served from a custom domain, not a github.io subpath.
  base: process.env.DOCS_BASE || "/",
  outDir: "./dist",
  integrations: [react()],
  devToolbar: { enabled: false },
});
