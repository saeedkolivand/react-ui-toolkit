import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Landing page. Deployed at the GitHub Pages root; Storybook lives at /storybook/.
export default defineConfig({
  root: "landing",
  base: process.env.LANDING_BASE || "/react-ui-toolkit/",
  plugins: [react()],
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
  },
  build: {
    outDir: "../landing-dist",
    emptyOutDir: true,
  },
});
