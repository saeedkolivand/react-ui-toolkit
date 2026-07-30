declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// TypeScript 6 errors on side-effect imports of untyped modules (TS2882),
// which is how src/index.ts pulls in the global stylesheet.
declare module "*.css";
