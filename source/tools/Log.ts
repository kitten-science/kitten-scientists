import { is, type Maybe } from "@oliversalzburg/js-utils/data/nil.js";

export const cl = <T extends Array<unknown>>(...args: T): Array<string | T[number]> => [
  "👩‍🔬",
  ...args
    .filter(arg => arg !== "")
    .flatMap((maybeError: Maybe<Error> | unknown) => {
      if (is(maybeError, Error)) {
        const error = maybeError;
        return [error.name, error.message, error.stack];
      }
      return maybeError;
    }),
];
