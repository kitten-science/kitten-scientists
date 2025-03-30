export const cl = (...args: Array<unknown>) => ["👩‍🔬", ...args].join(" ");

/**
 * Print a debugging message to the console.
 *
 * @param {...any} args Arguments to pass to `console.debug`.
 */
export function cdebug(...args: Array<unknown>): void {
  console.debug("👩‍🔬", ...args);
}

/**
 * Print an informational message to the console.
 *
 * @param {...any} args Arguments to pass to `console.info`.
 */
export function cinfo(...args: Array<unknown>): void {
  console.info("👩‍🔬", ...args);
}

/**
 * Print a warning to the console.
 *
 * @param {...any} args Arguments to pass to `console.warn`.
 */
export function cwarn(...args: Array<unknown>): void {
  console.warn("👩‍🔬", ...args);
}

/**
 * Print an error to the console.
 *
 * @param {...any} args Arguments to pass to `console.error`.
 */
export function cerror(...args: Array<unknown>): void {
  console.error("👩‍🔬", ...args);
}
