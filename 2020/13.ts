import { getInputArray } from "../utils";

export function parseLineNumbers(str: string) {
  return str
    .split(",")
    .map((v) => +v)
    .filter((v) => !isNaN(v));
}

export function findNextDepartureOfLine(baseTime: number, lineNumber: number) {
  return baseTime + lineNumber - (baseTime % lineNumber);
}
export function findNextDeparture(baseTime: number, lineNumbers: number[]) {
  const nextDepartures = lineNumbers.map((lineNumber) =>
    findNextDepartureOfLine(baseTime, lineNumber)
  );
  const minIndex = nextDepartures.reduce(
    (iMin, x, i, arr) => (x < arr[iMin] ? i : iMin),
    0
  );
  return [lineNumbers[minIndex], nextDepartures[minIndex] - baseTime];
}

export function getCommonMultiple(numbers: bigint[]) {
  return numbers.reduce((a, b) => a * b, BigInt(1));
}
export function getMultiplicativeInverse(a: bigint, b: bigint) {
  let b0 = b;
  let x0 = BigInt(0);
  let x1 = BigInt(1);
  if (b === BigInt(1)) return BigInt(1);
  while (a > 1) {
    let q = a / b;
    [a, b] = [b, a % b];
    [x0, x1] = [x1 - q * x0, x0];
  }
  if (x1 < 0) {
    x1 += b0;
  }
  return x1;
}

export function chineseRemainder(n: bigint[], a: bigint[]) {
  // adapted from https://rosettacode.org/wiki/Chinese_remainder_theorem#Python_3.6
  let sum = BigInt(0);
  const prod = getCommonMultiple(n);
  for (let i = 0; i < n.length; i++) {
    const a_i = a[i];
    const n_i = n[i];
    const p = prod / n_i;
    sum += a_i * getMultiplicativeInverse(p, n_i) * p;
  }
  return ((sum % prod) + prod) % prod;
}

export function findEarliestConsecutiveDepartures(lineNumberStr: string) {
  const constraints = lineNumberStr
    .split(",")
    .map((v, i) => ({ interval: +v, offset: i }))
    .filter((x) => !isNaN(x.interval));

  const solution = chineseRemainder(
    constraints.map((c) => BigInt(c.interval)),
    constraints.map((c) => BigInt(-c.offset)) // somehow, the given examples only work if we count backwards
  );
  return solution;
}

export function solution1() {
  const input = getInputArray({ day: 13, year: 2020, separator: "\n" });
  const baseTime = +input[0];
  const lineNumbers = parseLineNumbers(input[1]);
  const [nextLineNumber, waitTime] = findNextDeparture(baseTime, lineNumbers);
  return nextLineNumber * waitTime;
}

export function solution2() {
  const input = getInputArray({ day: 13, year: 2020, separator: "\n" });
  return findEarliestConsecutiveDepartures(input[1]);
}
