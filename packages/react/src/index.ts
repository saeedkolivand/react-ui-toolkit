// NEVER put "use client" in this barrel. With sideEffects:false + ESM the
// per-file directives tree-shake correctly, but a directive here would poison
// the entire library for React Server Components consumers.
export { Button, type ButtonProps } from "./button/button";
