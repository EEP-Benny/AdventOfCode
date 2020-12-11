import { getInput } from "../utils";

export enum SeatState {
  Floor = ".",
  Empty = "L",
  Occupied = "#",
}
export type SeatGrid = SeatState[][];
export function stringToGrid(str: string): SeatGrid {
  return str.split("\n").map((row) => row.split("") as SeatState[]);
}
export function gridToString(grid: SeatGrid): string {
  return grid.map((row) => row.join("")).join("\n");
}

function getSeatState(
  grid: SeatGrid,
  x: number,
  y: number
): SeatState | undefined {
  return grid[y]?.[x];
}
const eightDirs = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
export function countOccupiedSeatsAround(grid, x, y) {
  return eightDirs.filter(
    ([dx, dy]) => getSeatState(grid, x + dx, y + dy) === SeatState.Occupied
  ).length;
}
export function countVisibleOccupiedSeatsAround(grid, x, y) {
  return eightDirs.filter(([dx, dy]) => {
    let distance = 1;
    let seatState;
    while (
      (seatState = getSeatState(grid, x + distance * dx, y + distance * dy)) ===
      SeatState.Floor
    ) {
      distance++;
    }
    return seatState === SeatState.Occupied;
  }).length;
}

function loopOverGrid(
  grid: SeatGrid,
  callbackFn: (seatState: SeatState, x: number, y: number) => void
) {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      callbackFn(grid[y][x], x, y);
    }
  }
}

export function transformSeat(grid: SeatGrid, x: number, y: number) {
  const seatState = grid[y][x];
  switch (seatState) {
    case SeatState.Floor:
      return SeatState.Floor;
    case SeatState.Empty:
      return countOccupiedSeatsAround(grid, x, y) === 0
        ? SeatState.Occupied
        : SeatState.Empty;
    case SeatState.Occupied:
      return countOccupiedSeatsAround(grid, x, y) >= 4
        ? SeatState.Empty
        : SeatState.Occupied;
  }
}
export function transformSeatNewRule(grid: SeatGrid, x: number, y: number) {
  const seatState = grid[y][x];
  switch (seatState) {
    case SeatState.Floor:
      return SeatState.Floor;
    case SeatState.Empty:
      return countVisibleOccupiedSeatsAround(grid, x, y) === 0
        ? SeatState.Occupied
        : SeatState.Empty;
    case SeatState.Occupied:
      return countVisibleOccupiedSeatsAround(grid, x, y) >= 5
        ? SeatState.Empty
        : SeatState.Occupied;
  }
}
type TransformSeatFn = typeof transformSeat;
export function simulateStep(
  gridBefore: SeatGrid,
  transformSeat: TransformSeatFn
): SeatGrid {
  const gridAfter: SeatGrid = [];
  loopOverGrid(gridBefore, (_, x, y) => {
    if (!gridAfter[y]) gridAfter[y] = [];
    gridAfter[y][x] = transformSeat(gridBefore, x, y);
  });
  return gridAfter;
}

export function simulateUntilNothingChanges(
  initialGrid: SeatGrid,
  transformSeat: TransformSeatFn
): SeatGrid {
  let lastGridString, newGridString;
  let grid = initialGrid;
  do {
    lastGridString = gridToString(grid);
    grid = simulateStep(grid, transformSeat);
    newGridString = gridToString(grid);
  } while (lastGridString !== newGridString);
  return grid;
}

export function countAllOccupiedSeats(grid: SeatGrid): number {
  let count = 0;
  loopOverGrid(grid, (seatState) => {
    if (seatState === SeatState.Occupied) {
      count++;
    }
  });
  return count;
}

export function solution1() {
  const initialGrid = stringToGrid(getInput(11, 2020));
  const finalGrid = simulateUntilNothingChanges(initialGrid, transformSeat);
  return countAllOccupiedSeats(finalGrid);
}

export function solution2() {
  const initialGrid = stringToGrid(getInput(11, 2020));
  const finalGrid = simulateUntilNothingChanges(
    initialGrid,
    transformSeatNewRule
  );
  return countAllOccupiedSeats(finalGrid);
}
