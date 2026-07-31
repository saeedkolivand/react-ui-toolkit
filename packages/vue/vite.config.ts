import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: ["vue", /^@zag-js\//, /^@crosskit-ui\//],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
