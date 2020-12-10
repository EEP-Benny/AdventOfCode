import { getInputArray } from "../utils";

export function getJoltageDifferences(joltages: number[]) {
  const sortedJoltages = joltages.sort((a, b) => a - b);
  const sortedJoltagesWithFinalAdapter = [
    ...sortedJoltages,
    sortedJoltages[sortedJoltages.length - 1] + 3,
  ];
  return sortedJoltagesWithFinalAdapter.map((v, i, a) => v - (a[i - 1] || 0));
}
const memoMap = new Map<number, number>();
export function getArrangementCountForConsecutiveOnes(consecutiveOnes: number) {
  if (memoMap.has(consecutiveOnes)) {
    return memoMap.get(consecutiveOnes);
  }
  if (consecutiveOnes < 0) {
    return 0;
  }
  if (consecutiveOnes === 0) {
    return 1;
  }
  const count =
    getArrangementCountForConsecutiveOnes(consecutiveOnes - 1) +
    getArrangementCountForConsecutiveOnes(consecutiveOnes - 2) +
    getArrangementCountForConsecutiveOnes(consecutiveOnes - 3);
  memoMap.set(consecutiveOnes, count);
  return count;
}
export function countPossibleArrangements(differences: number[]) {
  // If there are consecutive differences of 1, we can skip some adapters.
  // If there is a difference of 3, we have a "fixed point"
  let combinations = 1;
  let consecutiveOnes = 0;
  for (let i = 0; i < differences.length; i++) {
    if (differences[i] === 1) {
      consecutiveOnes++;
    } else {
      combinations *= getArrangementCountForConsecutiveOnes(consecutiveOnes);
      consecutiveOnes = 0;
    }
  }
  return combinations;
}

export function countDifferences(differences: number[]) {
  const diffMap = new Map<number, number>();
  differences.forEach((diff) => {
    const currentCount = diffMap.get(diff) ?? 0;
    diffMap.set(diff, currentCount + 1);
  });
  return diffMap;
}

function getJoltages() {
  return getInputArray({ day: 10, year: 2020, separator: "\n" }).map((v) => +v);
}
export function solution1() {
  const joltages = getJoltages();
  const differences = getJoltageDifferences(joltages);
  const diffMap = countDifferences(differences);
  return diffMap.get(1) * diffMap.get(3);
}

export function solution2() {
  const joltages = getJoltages();
  const differences = getJoltageDifferences(joltages);
  return countPossibleArrangements(differences);
}
