import { getInputArray } from "../utils";

export function isTreeAt(field: string[], posX: number, posY: number) {
  const row = field[posY];
  return row[posX % row.length] === "#";
}

export function countTreesOnSlope(field: string[], slope: number) {
  let treeCount = 0;
  for (let posY = 0; posY < field.length; posY++) {
    const posX = posY * slope;
    if (posX % 1 === 0 && isTreeAt(field, posX, posY)) {
      treeCount++;
    }
  }
  return treeCount;
}

export function solution1() {
  const field = getInputArray({ day: 3, year: 2020, separator: "\n" });
  return countTreesOnSlope(field, 3);
}
export function solution2() {
  const field = getInputArray({ day: 3, year: 2020, separator: "\n" });
  return (
    countTreesOnSlope(field, 1) *
    countTreesOnSlope(field, 3) *
    countTreesOnSlope(field, 5) *
    countTreesOnSlope(field, 7) *
    countTreesOnSlope(field, 0.5)
  );
}
