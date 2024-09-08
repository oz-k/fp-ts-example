import { flow, pipe } from 'fp-ts/lib/function';
import { Debug } from './utils/debug';

const add = (a: number) => (b: number) => a + b;

const add2 = add(2);
const add3 = add(3);

/**
 * flow: 단일 인수 함수 연결
 * 
 * add5: (a: Parameters<typeof add2>[0]) => ReturnType<typeof add3>
 */
const add5 = flow(
  add2,
  add3
);

/**
 * pipe: 초기값 + flow
 */
pipe(
  3,
  add5,
  Debug.assert(8),
);
// ===
pipe(
  add5(3),
  Debug.assert(8),
);

/**
 * flow 사용 예시
 * 
 * 아래와 같이 익명 함수를 사용하지 않고싶을 때 사용 가능
 */
const toString = <T>(a: T, f: (a: T) => string) => f(a);

const add5ToStringP = toString(3, n => pipe(n, add5, String));
Debug.assert(add5ToStringP, '8');
// to
const add5ToStringF = toString(3, flow(add5, String));
Debug.assert(add5ToStringF, '8');