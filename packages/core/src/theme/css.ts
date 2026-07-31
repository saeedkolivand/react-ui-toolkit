/**
 * Guards for the two places a theme value reaches raw CSS text.
 *
 * The compiler builds a stylesheet by string concatenation, so anything
 * interpolated into it can close the construct it sits in and start a new rule.
 * That is the same class of bug as `themeScript()` needing to escape
 * `</script>`, one layer down, and it becomes reachable the moment a theme name
 * or token value comes from anywhere but a source literal — a docs playground,
 * a saved user preference, a CMS field.
 */

/** Characters that would end a declaration or a rule block. */
const UNSAFE_VALUE = /[;{}]|<\//;

/**
 * Rejects a token value that would escape its declaration.
 *
 * Rejecting rather than escaping: there is no valid reason for a semicolon or
 * brace in a custom property value here, so silently rewriting one would hide a
 * mistake instead of reporting it.
 */
export function assertSafeValue(name: string, value: string): string {
  if (UNSAFE_VALUE.test(value)) {
    throw new Error(
      `Token "${name}" has an unsafe value: ${JSON.stringify(value)}. ` +
        "Values cannot contain ; { } or </ — they would end the declaration."
    );
  }
  return value;
}

/**
 * Escapes a string for use inside a double-quoted attribute selector.
 *
 * Escaping rather than rejecting here: a theme scope is an identifier the
 * caller chose, and quoting is well defined in CSS, so there is no reason to
 * restrict what it may contain.
 */
export const escapeAttributeValue = (value: string): string =>
  value.replace(/["\\]/g, m => `\\${m}`);
