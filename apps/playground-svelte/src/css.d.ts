// Side-effect imports carry no types. @crosskit-ui/styles is a stylesheet
// with no JS surface at all, which is exactly what publint expects of it.
declare module "*.css";
declare module "@crosskit-ui/styles";
