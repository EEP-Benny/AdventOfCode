import {
  countAllOccupiedSeats,
  countVisibleOccupiedSeatsAround,
  gridToString,
  simulateStep,
  simulateUntilNothingChanges,
  stringToGrid,
  transformSeat,
  transformSeatNewRule,
} from "./11";

const gridStrings = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL

#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##

#.LL.L#.##
#LLLLLL.L#
L.L.L..L..
#LLL.LL.L#
#.LL.LL.LL
#.LLLL#.##
..L.L.....
#LLLLLLLL#
#.LLLLLL.L
#.#LLLL.##

#.##.L#.##
#L###LL.L#
L.#.#..#..
#L##.##.L#
#.##.LL.LL
#.###L#.##
..#.#.....
#L######L#
#.LL###L.L
#.#L###.##

#.#L.L#.##
#LLL#LL.L#
L.L.L..#..
#LLL.##.L#
#.LL.LL.LL
#.LL#L#.##
..L.L.....
#L#LLLL#L#
#.LLLLLL.L
#.#L#L#.##

#.#L.L#.##
#LLL#LL.L#
L.#.L..#..
#L##.##.L#
#.#L.LL.LL
#.#L#L#.##
..L.L.....
#L#L##L#L#
#.LLLLLL.L
#.#L#L#.##
`
  .trim()
  .split("\n\n");

const gridStringsNewRule = `
L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL

#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##

#.LL.LL.L#
#LLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLLL.L
#.LLLLL.L#

#.L#.##.L#
#L#####.LL
L.#.#..#..
##L#.##.##
#.##.#L.##
#.#####.#L
..#.#.....
LLL####LL#
#.L#####.L
#.L####.L#

#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##LL.LL.L#
L.LL.LL.L#
#.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLL#.L
#.L#LL#.L#

#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.#L.L#
#.L####.LL
..#.#.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#

#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.LL.L#
#.LLLL#.LL
..#.L.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#
`
  .trim()
  .split("\n\n");

test("simulateStep", () => {
  let grid = stringToGrid(gridStrings[0]);
  for (let round = 1; round < gridStrings.length; round++) {
    grid = simulateStep(grid, transformSeat);
    expect(gridToString(grid)).toEqual(gridStrings[round]);
  }
});

test("countAllOccupiedSeats", () => {
  const gridAfterRound5 = stringToGrid(gridStrings[5]);
  expect(countAllOccupiedSeats(gridAfterRound5)).toBe(37);
});

test("simulateUntilNothingChanges", () => {
  const initialGrid = stringToGrid(gridStrings[0]);
  const finalGrid = simulateUntilNothingChanges(initialGrid, transformSeat);
  expect(gridToString(finalGrid)).toEqual(gridStrings[5]);

  const initialGridNewRule = stringToGrid(gridStringsNewRule[0]);
  const finalGridNewRule = simulateUntilNothingChanges(
    initialGridNewRule,
    transformSeatNewRule
  );
  expect(gridToString(finalGridNewRule)).toEqual(gridStringsNewRule[6]);
});

test("countVisibleOccupiedSeatsAround", () => {
  const grid1 = stringToGrid(
    `
.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....`.trim()
  );
  expect(countVisibleOccupiedSeatsAround(grid1, 3, 4)).toBe(8);
  const grid2 = stringToGrid(
    `
.##.##.
#.#.#.#
##...##
...L...
##...##
#.#.#.#
.##.##.`.trim()
  );
  expect(countVisibleOccupiedSeatsAround(grid2, 3, 3)).toBe(0);
});
