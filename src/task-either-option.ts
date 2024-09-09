import { either, option, task, taskEither, taskOption } from 'fp-ts';
import { Debug } from './utils/debug';
import { flow, pipe } from 'fp-ts/lib/function';

/**
 * TaskEither: 비동기이면서 에러가 발생할 수 있는 경우
 * TaskOption: 비동기이면서 값이 없을 수 있는 경우
 */

taskEither.tryCatch(
  () => Promise.resolve(1),
  (err) => (err as Error).message,
);
// ===
function tryCatchE<V, E>(f: () => Promise<V>, onReject: (err?: unknown) => E): taskEither.TaskEither<E, V> {
  return async () => {
    try {
      return either.right(await f());
    } catch (err) {
      return either.left(onReject(err));
    }
  }
}

taskOption.tryCatch(
  () => Promise.resolve(1),
);
// ===
function tryCatchO<V>(f: () => Promise<V>): taskOption.TaskOption<V> {
  return async () => {
    try {
      return option.some(await f());
    } catch (err) {
      return option.none;
    }
  }
}

pipe(
  taskOption.tryCatch<number>(
    flow(
      (): Promise<number> => Promise.resolve(1),
      (v) => new Promise<number>((resolve) => setTimeout(() => resolve(v), 1000)),
    ),
  ),
  taskOption.getOrElse(() => async () => 0),
  task.map(Debug.assert(1)),
)()

taskEither.tryCatch(
  () => Promise.resolve(1),
  (err) => (err as Error).message,
)()
  .then(v => {
    return either.getOrElse(() => 0)(v);
  })
  .then(Debug.assert(1));