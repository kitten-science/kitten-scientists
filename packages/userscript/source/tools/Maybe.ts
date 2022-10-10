export type Nil = null | undefined;
export type Maybe<T> = T | Nil;

/**
 * Describes a function that is a constructor for T.
 */
export type ConstructorOf<T = Record<string, unknown>> = new (...args: any[]) => T;

/**
 * Check if something is a concrete value of the given type.
 * Can be used as a typeguard.
 *
 * @param nilable The subject that could be nil.
 * @param InstanceType The type to check against.
 */
export function is<T>(nilable: Maybe<T>, InstanceType: ConstructorOf<T>): nilable is T {
  return !isNil(nilable) && nilable instanceof InstanceType;
}

/**
 * Check if something is Nil.
 * Can be used as a typeguard.
 *
 * @param subject The subject that could be nil.
 */
export function isNil<T>(subject: Maybe<T>): subject is Nil {
  return subject === null || subject === undefined;
}

export class UnexpectedNilError extends Error {
  constructor(message = "unexpected nil value") {
    super(message);
  }
}

/**
 * Ensure that the passed subject is not nil; throw otherwise.
 *
 * @param subject A subject that is possible nil.
 */
export function mustExist<T>(subject: Maybe<T>): T {
  if (isNil(subject)) {
    throw new UnexpectedNilError();
  }
  return subject;
}
