import { cinfo, cwarn } from "./Log";
import { isNil } from "./Maybe";

/**
 * Provides type-safe means to iterate over the entries
 * in a partially filled structure with typed keys.
 *
 * @param subject Some object.
 * @returns An array of key-value tuples.
 */
export function objectEntries<TKeys extends string, TValues>(
  subject: Partial<Record<TKeys, TValues>>
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
  consumer: (subjectKey: TValues, sourceKey: TValues | undefined) => unknown
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
  consumer: (subjectKey: TValues, sourceKey: TValues | undefined) => unknown
): Partial<Record<TKeys, TValues>> {
  if (isNil(source)) {
    cwarn("No source data was provided.");
    return subject;
  }

  for (const [key, value] of objectEntries(subject)) {
    if (key in source === false) {
      cinfo(`Entry '${key}' is missing in source. Using default value.`);
    }
    consumer(value, source[key]);
  }

  for (const [key] of objectEntries(source)) {
    if (key in subject === false) {
      cwarn(
        `Entry '${key}' was found in source, but it is not expected by the subject schema. This entry will be ignored.`
      );
    }
  }
  return subject;
}
