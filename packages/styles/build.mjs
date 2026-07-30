// Compiles the authored CSS with Tailwind v4 and ships the OUTPUT. Tailwind is a
// build-time dependency of this package only — consumers never install it.
import { mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = join(here, "node_modules", ".bin", "tailwindcss");
const dist = join(here, "dist");

/** The cascade-layer order our override story depends on (see src/index.css). */
const LAYER_ORDER = "@layer ck.reset, ck.tokens, ck.components, ck.overrides;";

const compile = (input, output) => {
  mkdirSync(dirname(output), { recursive: true });
  execFileSync(cli, ["-i", input, "-o", output, "--minify"], { stdio: "inherit", shell: true });

  // Tailwind drops a bare @layer statement that declares only order, so we
  // re-insert it. Without it, layer precedence falls back to first-appearance
  // order, which is not stable once a consumer's own layered CSS is in play.
  const css = readFileSync(output, "utf8");
  if (!css.includes("@layer ck.reset,")) {
    const banner = css.startsWith("/*") ? css.slice(0, css.indexOf("*/") + 2) : "";
    const body = css.slice(banner.length);
    writeFileSync(output, `${banner}\n${LAYER_ORDER}${body}`);
  }
};

mkdirSync(join(dist, "themes"), { recursive: true });

compile(join(here, "src/index.css"), join(dist, "index.css"));

// theme.css ships as SOURCE, not compiled. It is an opt-in bridge that the
// CONSUMER imports into their own Tailwind build: `@theme inline` only emits
// variables that generated utilities actually reference, so compiling it
// standalone (with nothing to scan) correctly produces an empty file.
copyFileSync(join(here, "src/theme.css"), join(dist, "theme.css"));
copyFileSync(join(here, "src/_variants.css"), join(dist, "_variants.css"));

for (const file of readdirSync(join(here, "src/themes"))) {
  if (file.startsWith("_") || !file.endsWith(".css")) continue;
  compile(join(here, "src/themes", file), join(dist, "themes", file));
}

console.log("@crosskit-ui/styles built");
