/**
 * Provides type-safe means to iterate over the entries
 * in a partially filled structure with typed keys.
 * @param subject Some object.
 * @returns An array of key-value tuples.
 */
export function objectEntries<TKeys extends string, TValues>(
  subject: Partial<Record<TKeys, TValues>>
): Array<[TKeys, TValues]> {
  return Object.entries(subject) as Array<[TKeys, TValues]>;
}
