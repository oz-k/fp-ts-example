import { array, task } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';
import { Debug } from './utils/debug';

/**
 * Task: 비동기 처리
 * 
 * Task<A> = () => Promise<A>
 * 
 * 주의: 한번 실행해야 Promise가 반환됨, 실행 전까지는 비동기 처리가 되지 않음
 */

const delay = (ms: number) => <T>(value: T): task.Task<T> => () => new Promise(resolve => setTimeout(() => resolve(value), ms));
const delaySec = delay(1000);

const square = (n: number) => n ** 2;

const increase = (n: number) => n + 1;
const toString = (n: number) => `${n}`;
const increaseToString = flow(increase, toString);
const increaseToStringTask = (n: number) => delaySec(increaseToString(n));

/**
 * map과 flatMap(chain)
 * 
 * map: T를 U로 변환, (f: (a: T) => U) => Task<U>
 * flatMap(chain): T를 Task<U>로 변환, (f: (a: T) => Task<U>) => Task<U>
*/
const fetchNumber = delaySec(5);

pipe(
  fetchNumber,
  task.map(square),
  task.map(Debug.assert(25)),
  task.flatMap(increaseToStringTask),
  task.map(Debug.assert('26')),
)().then(() => Debug.log('Task done'));

// array
const fetchNumbers = delaySec([1, 2, 3]);

pipe(
  fetchNumbers,
  task.map(array.map(square)),
  task.map(Debug.assert([1, 4, 9])),
  task.flatMap(n1 => pipe(
    fetchNumbers,
    task.map(n2 => n1.concat(n2)),
  )),
  task.map(Debug.assert([1, 4, 9, 1, 2, 3])),
  task.map(array.map(increaseToString)),
  task.map(Debug.assert(['2', '5', '10', '2', '3', '4'])),
  task.map(array.reduce('', (acc, cur) => acc + cur)),
  task.map(Debug.assert('2510234')),
)();


// pipe(
//   [fetchNumbers, 1],
//   delay(5000),
//   (([fetchNumbers, n]) => ([fetchNumbers, n + 1])),
// )