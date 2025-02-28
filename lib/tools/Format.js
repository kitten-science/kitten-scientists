/**
 * Returns the given string with the first letter in upper case.
 *
 * @param input The string to convert.
 */
export function ucfirst(input) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}
/**
 * Rounds the given number to two decimals.
 *
 * @param input The number to round.
 */
export function roundToTwo(input) {
  return Math.round(input * 100) / 100;
}
export function negativeOneToInfinity(value) {
  return value === -1 ? Number.POSITIVE_INFINITY : value;
}
//# sourceMappingURL=Format.js.map
