import { deepStrictEqual } from 'assert';
import { console, io } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

export namespace Debug {
  export const log: <T>(v: T) => T = v => pipe(
    v,
    console.log,
    io.map(() => v),
  )();

  export function assert<T>(a: T): <U>(b: U) => U;
  export function assert<T, U>(a: T, b: U): U;
  export function assert<T, U>(...args: [T] | [T, U]): ((b: U) => U) | U {
    const equal = (b: U) => pipe(
      [args[0], b],
      ([a, b]) => deepStrictEqual(a, b),
      () => b,
    );
    
    return args.length === 1
      ? equal
      : equal(args[1]);
  }
}