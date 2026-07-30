import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  platform: "browser",
  clean: true,
  sourcemap: true,
  treeshake: true,
  // "use client" banners MUST survive bundling. Bundlers strip top-level
  // directives by default, and the failure is silent until it reaches a
  // consumer's Next.js App Router build. Asserted in build-assertions.test.ts.
  outputOptions: {
    preserveModules: false,
    banner: undefined,
  },
});
