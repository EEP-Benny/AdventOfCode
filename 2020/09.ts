import { getInputArray } from "../utils";

export function isSumOfNumbers(sum: number, numbers: number[]) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (i !== j && numbers[i] + numbers[j] === sum) {
        return true;
      }
    }
  }
  return false;
}

export function findNumberThatIsNotASum(numbers: number[], lookbehind: number) {
  for (let i = lookbehind; i < numbers.length; i++) {
    if (!isSumOfNumbers(numbers[i], numbers.slice(i - lookbehind, i))) {
      return numbers[i];
    }
  }
}

export function findContiguousRangeThatSumsTo(sum: number, numbers: number[]) {
  for (let i = 0; i < numbers.length; i++) {
    let currentSum = 0;
    let j = i;
    while (currentSum < sum) {
      currentSum += numbers[j];
      j++;
    }
    if (currentSum === sum) {
      return numbers.slice(i, j);
    }
  }
}

function getNumbers() {
  return getInputArray({ day: 9, year: 2020, separator: "\n" }).map((v) => +v);
}

export function solution1() {
  return findNumberThatIsNotASum(getNumbers(), 25);
}

export function solution2() {
  const numbers = getNumbers();
  const targetSum = findNumberThatIsNotASum(numbers, 25);
  const range = findContiguousRangeThatSumsTo(targetSum, numbers);
  const sortedRange = range.sort((a, b) => a - b);
  return sortedRange[0] + sortedRange[sortedRange.length - 1];
}
