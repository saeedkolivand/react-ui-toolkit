// Ported from @zag-js/svelte/dist/normalize-props.js.
// Same strategy: lowercase every key, keep SVG camelCase keys intact, and
// stringify style objects. Lowercasing means event handlers arrive as
// `onclick`/`onfocusout`, which ZagSpread detects by the `on` prefix.
import { createNormalizer } from '@zag-js/types';

const propMap: Record<string, string> = {
  className: 'class',
  defaultChecked: 'checked',
  defaultValue: 'value',
  htmlFor: 'for',
  onBlur: 'onfocusout',
  onChange: 'oninput',
  onFocus: 'onfocusin',
  onDoubleClick: 'ondblclick',
};

export function toStyleString(style: Record<string, any>): string {
  let string = '';
  for (let key in style) {
    const value = style[key];
    if (value === null || value === undefined) continue;
    if (!key.startsWith('--')) key = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    string += `${key}:${value};`;
  }
  return string;
}

const preserveKeys = new Set(
  'viewBox,className,preserveAspectRatio,fillRule,clipPath,clipRule,strokeWidth,strokeLinecap,strokeLinejoin,strokeDasharray,strokeDashoffset,strokeMiterlimit'.split(
    ',',
  ),
);

function toAngularProp(key: string) {
  if (key in propMap) return propMap[key];
  if (preserveKeys.has(key)) return key;
  return key.toLowerCase();
}

function toAngularPropValue(key: string, value: any) {
  if (key === 'style' && typeof value === 'object') return toStyleString(value);
  return value;
}

/**
 * Keys that must be set as DOM *properties*, not attributes, or the widget
 * silently misbehaves (e.g. `checked` as an attribute only sets the default).
 */
export const DOM_PROPERTY_KEYS = new Set([
  'value',
  'checked',
  'indeterminate',
  'selected',
  'muted',
  'srcobject',
]);

export const normalizeProps = createNormalizer<any>((props: Record<string, any>) => {
  const normalized: Record<string, any> = {};
  for (const key in props) {
    normalized[toAngularProp(key)] = toAngularPropValue(key, props[key]);
  }
  return normalized;
});
