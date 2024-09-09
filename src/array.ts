import { array } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { Debug } from './utils/debug';

const arr = [1, 2, 3, 4, 5];

const add = (a: number) => (b: number) => a + b;
const add1 = add(1);
const isEven = (n: number) => n % 2 === 0;
const sum = (acc: number, cur: number) => acc + cur;

const sum1 = arr
  .map(add1)
  .filter(isEven)
  .reduce(sum, 0);

const sum2 = pipe(
  arr,
  array.map(add1),
  array.filter(isEven),
  array.reduce(0, sum),
);

Debug.assert(sum1, 12);
Debug.assert(sum1, sum2);

/**
 * Array.prototype.map, filter, reduce 가 아닌
 * fp-ts의 array.map, filter, reduce를 사용하는 이유
 * 
 * - Array.prototype.map, filter, reduce는 반드시 Array만을 다룰 수 있음
 * - fp-ts의 array.map, filter, reduce는 ArrayLike를 다룰 수 있음
 */