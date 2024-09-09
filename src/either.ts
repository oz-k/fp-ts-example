import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Debug } from './utils/debug';

/**
 * Either: 에러 처리
 * 
 * - Left: 에러인 경우
 * - Right: 정상인 경우
 * 
 * Either<L, R>
 */

/**
 * 생성
 */
either.left(new Error('error'));
either.right(1);

/**
 * 값 체크
 */
pipe(
  either.right(1),
  either.isRight,
  Debug.assert(true),
);
pipe(
  either.left(new Error('error')),
  either.isRight,
  Debug.assert(false),
);

// Debug.log(
//   either.map<number, number>(
//     n => n + 1,
//   )(either.left(new Error('error')))
// );

/**
 * 값 추출
 * 
 * - getOrElse: Left인 경우 기본값 반환(기본값은 Right의 타입과 같아야함)
 * - getOrElseW: getOrElse와 동일하지만 반환 타입이 다를 수 있음(기본값: () => D, Right: R, 반환값: D | R)
 * - toUnion: 값을 그대로 반환(Either<L, R> -> L | R)
 * - match: Left, Right에 대해 각각 함수를 적용(Left: (l: L) => A, Right: (r: R) => A)
 * - matchW: match와 동일하지만 반환 타입이 다를 수 있음(Left: (l: L) => A, Right: (r: R) => B, 반환값: A | B)
 * - fold: match의 alias
 * - foldW: matchW의 alias
 */
pipe(
  either.right(1),
  either.getOrElse(() => 0),
  Debug.assert(1),
);
pipe(
  either.left(new Error('error message')),
  either.getOrElseW(err => err.message.length),
  Debug.assert(13),
);

either.toUnion(either.left(new Error('error')));

pipe(
  either.right(1) as either.Either<Error, number>,
  either.match(
    err => err.message,
    n => `${n + 1}`,
  ),
  Debug.assert('2'),
);
pipe(
  either.left(new Error('error message')) as either.Either<Error, number>,
  either.matchW(
    err => err.message,
    n => n + 1,
  ),
  Debug.assert('error message'),
);