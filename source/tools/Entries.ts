import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { cl } from "./Log.js";

export const deepMergeLeft = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): Record<string, unknown> => {
  const subject: Record<string, unknown> = { ...a };
  for (const [key, value] of Object.entries(b)) {
    if (typeof value === "object") {
      subject[key] = deepMergeLeft(
        // @ts-expect-error This is just naughty business.
        key in a ? a[key] : {},
        b[key],
      );
      continue;
    }
    subject[key] = b[key] ?? a[key];
  }
  return subject;
};

/**
 * Provides type-safe means to iterate over the entries
 * in a partially filled structure with typed keys.
 *
 * @param subject Some object.
 * @returns An array of key-value tuples.
 */
export function objectEntries<TKeys extends string, TValues>(
  subject: Partial<Record<TKeys, TValues>>,
): Array<[TKeys, TValues]> {
  return Object.entries(subject) as Array<[TKeys, TValues]>;
}

/**
 * Given a `subject` object schema, consume all known values from the
 * `source` into the schema object.
 *
 * @param subject An object that should consume values from the source.
 * @param source An object that is similar to the `subject` from which to copy values.
 * @param consumer A function that receives each `subject` and `source` value pair.
 * @returns The `subject` after processing.
 */
export function consumeEntries<TKeys extends string, TValues>(
  subject: Partial<Record<TKeys, TValues>>,
  source: Partial<Record<TKeys, TValues>> | undefined,
  consumer: (subjectKey: TValues, sourceKey: TValues | undefined) => unknown,
): Partial<Record<TKeys, TValues>> {
  if (isNil(source)) {
    return subject;
  }

  for (const [key, value] of objectEntries(subject)) {
    consumer(value, source[key]);
  }
  return subject;
}

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
export function consumeEntriesPedantic<TKeys extends string, TValues>(
  subject: Partial<Record<TKeys, TValues>>,
  source: Partial<Record<TKeys, TValues>> | undefined,
  consumer: (subjectKey: TValues, sourceKey: TValues | undefined) => unknown,
): Partial<Record<TKeys, TValues>> {
  if (isNil(source)) {
    console.warn(...cl("No source data was provided."));
    return subject;
  }

  for (const [key, value] of objectEntries(subject)) {
    if (!(key in source)) {
      console.info(...cl(`Entry '${key}' is missing in source. Using default value.`));
    }
    consumer(value, source[key]);
  }

  for (const [key] of objectEntries(source)) {
    if (!(key in subject)) {
      console.warn(
        ...cl(
          `Entry '${key}' was found in source, but it is not expected by the subject schema. This entry will be ignored.`,
        ),
      );
    }
  }
  return subject;
}

/**
 * Unique wraps an object to prevent accidental sharing of references by
 * returning cloned versions instead.
 */
export class Unique<T> {
  private _elem: T;

  constructor(elem: T) {
    this._elem = structuredClone(elem);
  }

  unwrap() {
    return structuredClone(this._elem);
  }

  replace(elem: T) {
    this._elem = structuredClone(elem);
  }

  toJSON() {
    return this.unwrap();
  }
}
