export type Nil = null | undefined;
export type Maybe<T> = T | Nil;
export function isNil<T>(subject: Maybe<T>): subject is Nil {
  return subject === null || subject === undefined;
}
