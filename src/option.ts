import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Debug } from './utils/debug';

/**
 * Option: nullable 대체
 * 
 * - Some: 값이 있는 경우
 * - None: 값이 없는 경우
 */

/**
 * 생성
 * 
 * - fromNullable: null, undefined인 경우 None 반환
 * - of: 모든 값에 대해 Some 반환
 * - fromPredicate: 조건에 맞는 경우 Some 반환
 * - fromEither: Either 값에 대해 Left인 경우 None, Right인 경우 Some 반환
 * 
 * 일반적으로 fromNullable 사용
 */
// fromNullable
pipe(
  1,
  option.fromNullable,
  Debug.assert(option.some(1)),
);
pipe(
  null,
  option.fromNullable,
  Debug.assert(option.none),
);
// of
pipe(
  null,
  option.of,
  Debug.assert(option.some(null)),
);
// fromPredicate
pipe(
  1,
  option.fromPredicate(n => n > 0),
  Debug.assert(option.some(1)),
);
pipe(
  0,
  option.fromPredicate(n => n > 0),
  Debug.assert(option.none),
);

/**
 * 값 체크
 */
pipe(
  option.some(1),
  option.isSome,
  Debug.assert(true),
);
pipe(
  option.none,
  option.isNone,
  Debug.assert(true),
);

/**
 * 값 추출
 * 
 * - getOrElse: Some인 경우 값 반환, None인 경우 기본값 반환
 * - toNullable: Some인 경우 값 반환, None인 경우 null 반환
 * - toUndefined: Some인 경우 값 반환, None인 경우 undefined 반환
 * - match: Some인 경우 2번째 인자 함수가 적용된 값 반환, None인 경우 1번째 인자 함수의 반환값 반환
 */
// getOrElse
pipe(
  option.some(1),
  option.getOrElse(() => 0),
  Debug.assert(1),
);
pipe(
  option.none,
  option.getOrElse(() => 'default'),
  Debug.assert('default'),
);
// toNullable
pipe(
  option.some(1),
  option.toNullable,
  Debug.assert(1),
);
pipe(
  option.none,
  option.toNullable,
  Debug.assert(null),
);
// toUndefined
pipe(
  option.some(1),
  option.toUndefined,
  Debug.assert(1),
);
pipe(
  option.none,
  option.toUndefined,
  Debug.assert(undefined),
);
// match
pipe(
  option.some(1),
  option.match(() => 0, n => n + 1),
  Debug.assert(2),
);
pipe(
  option.none,
  option.match(() => 'default', n => `${n}!!`),
  Debug.assert('default'),
);

/** 
 * 값 변환
 * 
 * - map: Some인 경우에만 함수 적용
 * - flatMap(chain): Some인 경우에만 함수 적용, map과 달리 함수가 Option을 반환해야 함
 * - fold: Some인 경우 2번째 인자 함수가 적용된 값 반환, None인 경우 1번째 인자 함수의 반환값 반환
 */
// map
pipe(
  option.some(1),
  option.map(n => n + 1),
  Debug.assert(option.some(2)),
);
pipe(
  option.none as option.Option<string>,
  option.map(s => s.toUpperCase()),
  Debug.assert(option.none),
);
// flatMap(chain)
pipe(
  option.some(1),
  option.flatMap(n => option.some(n + 1)),
  Debug.assert(option.some(2)),
);
pipe(
  option.none as option.Option<string>,
  option.flatMap(s => option.some(s.toUpperCase())),
  Debug.assert(option.none),
);