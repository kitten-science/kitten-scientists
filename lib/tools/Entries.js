import { isNil } from "@oliversalzburg/js-utils/data/nil.js";
import { cinfo, cwarn } from "./Log.js";
export const deepMergeLeft = (a, b) => {
  const subject = { ...a };
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
export function objectEntries(subject) {
  return Object.entries(subject);
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
export function consumeEntries(subject, source, consumer) {
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
export function consumeEntriesPedantic(subject, source, consumer) {
  if (isNil(source)) {
    cwarn("No source data was provided.");
    return subject;
  }
  for (const [key, value] of objectEntries(subject)) {
    if (!(key in source)) {
      cinfo(`Entry '${key}' is missing in source. Using default value.`);
    }
    consumer(value, source[key]);
  }
  for (const [key] of objectEntries(source)) {
    if (!(key in subject)) {
      cwarn(
        `Entry '${key}' was found in source, but it is not expected by the subject schema. This entry will be ignored.`,
      );
    }
  }
  return subject;
}
/**
 * Unique wraps an object to prevent accidental sharing of references by
 * returning cloned versions instead.
 */
export class Unique {
  _elem;
  constructor(elem) {
    this._elem = structuredClone(elem);
  }
  unwrap() {
    return structuredClone(this._elem);
  }
  replace(elem) {
    this._elem = structuredClone(elem);
  }
  toJSON() {
    return this.unwrap();
  }
}
//# sourceMappingURL=Entries.js.map
