import { countTreesOnSlope, isTreeAt } from "./03";

test("isTreeAt", () => {
  const field = ["..#", "#.."];
  expect(isTreeAt(field, 0, 0)).toBe(false);
  expect(isTreeAt(field, 2, 0)).toBe(true);
  expect(isTreeAt(field, 5, 0)).toBe(true);
  expect(isTreeAt(field, 0, 1)).toBe(true);
  expect(isTreeAt(field, 3, 1)).toBe(true);
  expect(isTreeAt(field, 4, 1)).toBe(false);
});

test("countTreesOnSlope", () => {
  const field = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`.split("\n");

  expect(countTreesOnSlope(field, 1)).toBe(2);
  expect(countTreesOnSlope(field, 3)).toBe(7);
  expect(countTreesOnSlope(field, 5)).toBe(3);
  expect(countTreesOnSlope(field, 7)).toBe(4);
  expect(countTreesOnSlope(field, 0.5)).toBe(2);
});
