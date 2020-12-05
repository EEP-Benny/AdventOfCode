import { getInputArray } from "../utils";

export function findSumOfTwo(numbers: number[]): [number, number] {
  const sortedNumbers = numbers.sort((a, b) => a - b);
  let low = 0;
  let high = sortedNumbers.length - 1;
  while (low < high) {
    const sum = sortedNumbers[low] + sortedNumbers[high];
    if (sum === 2020) {
      return [sortedNumbers[low], sortedNumbers[high]];
    } else if (sum < 2020) {
      low++;
    } else {
      high--;
    }
  }
  return [0, 0];
}

export function findSumOfThree(numbers: number[]): [number, number, number] {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const k = numbers.indexOf(2020 - numbers[i] - numbers[j], j + 1);
      if (k > -1) {
        return [numbers[i], numbers[j], numbers[k]];
      }
    }
  }
  return [0, 0, 0];
}

export function solution1() {
  const inputArray = getInputArray({ day: 1, year: 2020, separator: "\n" });
  const numbers = inputArray.map((x) => parseInt(x, 10));
  const [x1, x2] = findSumOfTwo(numbers);
  return x1 * x2;
}

export function solution2() {
  const inputArray = getInputArray({ day: 1, year: 2020, separator: "\n" });
  const numbers = inputArray.map((x) => parseInt(x, 10));
  const [x1, x2, x3] = findSumOfThree(numbers);
  return x1 * x2 * x3;
}
