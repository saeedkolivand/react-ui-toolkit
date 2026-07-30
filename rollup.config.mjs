import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import autoprefixer from "autoprefixer";
import tailwindcss from "@tailwindcss/postcss";
import { readFileSync } from "fs";
import path from "path";

const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/*.stories.tsx", "**/*.test.tsx", "landing/**"],
        // ponytail: no declaration here — the second rollup pass below bundles
        // dist/index.d.ts via rollup-plugin-dts. Emitting dist/types/ too was dead output.
        declaration: false,
        rootDir: "./src",
        outDir: "./dist",
      }),
      postcss({
        plugins: [tailwindcss("./tailwind.config.mjs"), autoprefixer()],
        extract: path.resolve("dist/styles.css"),
        minimize: true,
        inject: false,
        extensions: [".css"],
        include: ["**/*.css"], // This will include your index.css
        modules: false,
        autoModules: false,
        writeDefinitions: false,
        sourceMap: true,
      }),
    ],
    // Every runtime dependency must be external, or it gets inlined into the bundle
    // *and* installed again from "dependencies" — consumers paid for framer-motion twice.
    external: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      ...Object.keys(packageJson.dependencies),
      ...Object.keys(packageJson.peerDependencies),
    ],
  },
  {
    input: "src/index.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
    external: [/\.css$/],
  },
];
