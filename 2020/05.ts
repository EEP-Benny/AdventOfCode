import { getInputArray } from "../utils";

export function getSeatId(str: string) {
  const binaryStr = str.replace(/[FL]/g, "0").replace(/[BR]/g, "1");
  return parseInt(binaryStr, 2);
}

export function findFreeSeat(sortedSeatIds: number[]) {
  for (let i = 1; i < sortedSeatIds.length; i++) {
    if (sortedSeatIds[i] - 2 === sortedSeatIds[i - 1]) {
      return sortedSeatIds[i] - 1;
    }
  }
  return NaN;
}

export function solution1() {
  const boardingPasses = getInputArray({ day: 5, year: 2020, separator: "\n" });
  return Math.max(...boardingPasses.map(getSeatId));
}

export function solution2() {
  const boardingPasses = getInputArray({ day: 5, year: 2020, separator: "\n" });
  const sortedSeatIds = boardingPasses.map(getSeatId).sort();
  return findFreeSeat(sortedSeatIds);
}
