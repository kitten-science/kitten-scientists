export declare const deepMergeLeft: (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
) => Record<string, unknown>;
/**
 * Provides type-safe means to iterate over the entries
 * in a partially filled structure with typed keys.
 *
 * @param subject Some object.
 * @returns An array of key-value tuples.
 */
export declare function objectEntries<TKeys extends string, TValues>(
  subject: Partial<Record<TKeys, TValues>>,
): Array<[TKeys, TValues]>;
/**
 * Given a `subject` object schema, consume all known values from the
 * `source` into the schema object.
 *
 * @param subject An object that should consume values from the source.
 * @param source An object that is similar to the `subject` from which to copy values.
 * @param consumer A function that receives each `subject` and `source` value pair.
 * @returns The `subject` after processing.
 */
export declare function consumeEntries<TKeys extends string, TValues>(
  subject: Partial<Record<TKeys, TValues>>,
  source: Partial<Record<TKeys, TValues>> | undefined,
  consumer: (subjectKey: TValues, sourceKey: TValues | undefined) => unknown,
): Partial<Record<TKeys, TValues>>;
/**
 * Given a `subject` object schema, consume all known values from the
 * `source` into the schema object.
 *
 * Additionally, log a message when the `source` was missing a value expected
 * by the `subject` schema and log a warning when the `source` supplied a
 * value that was not expected by the `subject` schema.
 *
 * @param subject An object that should consume values from the source.
 * @param source An object that is similar to the `subject` from which to copy values.
 * @param consumer A function that receives each `subject` and `source` value pair.
 * @returns The `subject` after processing.
 */
export declare function consumeEntriesPedantic<TKeys extends string, TValues>(
  subject: Partial<Record<TKeys, TValues>>,
  source: Partial<Record<TKeys, TValues>> | undefined,
  consumer: (subjectKey: TValues, sourceKey: TValues | undefined) => unknown,
): Partial<Record<TKeys, TValues>>;
/**
 * Unique wraps an object to prevent accidental sharing of references by
 * returning cloned versions instead.
 */
export declare class Unique<T> {
  private _elem;
  constructor(elem: T);
  unwrap(): T;
  replace(elem: T): void;
  toJSON(): T;
}
//# sourceMappingURL=Entries.d.ts.map
