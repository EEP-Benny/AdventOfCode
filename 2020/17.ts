import { cartesianProduct, getInput } from "../utils";

export class Grid<T, C extends number[]> {
  grid = new Map<string, T>();
  minCoords: C | undefined[] = [];
  maxCoords: C | undefined[] = [];
  coordsToString = (coords: C) => coords.join(",");
  stringToCoords = (str: string): C => str.split(",").map((v) => +v) as C;

  set(coords: C, value: T) {
    coords.forEach((c, i) => {
      if (this.minCoords[i] === undefined || this.minCoords[i] > c)
        this.minCoords[i] = c;
      if (this.maxCoords[i] === undefined || this.maxCoords[i] < c)
        this.maxCoords[i] = c;
    });
    this.grid.set(this.coordsToString(coords), value);
  }
  get(coords: C): T {
    return this.grid.get(this.coordsToString(coords));
  }
  getCoordsInDimension(d: number, padding = 0): number[] {
    const start = this.minCoords[d] - padding;
    const end = this.maxCoords[d] + padding;
    return Array.from({ length: end - start + 1 }).map((_, idx) => start + idx);
  }
  foreach(f: (value: T, coords: C) => void, padding = 0) {
    const coordsInDim = Array.from({
      length: this.minCoords.length,
    }).map((_, d) => this.getCoordsInDimension(d, padding)) as C[];
    return cartesianProduct(...coordsInDim).forEach((coords) => {
      f(this.get(coords as C), coords as C);
    });
  }

  toString(mapper: (value: T) => string) {
    const coordsX = this.getCoordsInDimension(0);
    const coordsY = this.getCoordsInDimension(1);
    const coordsRest = Array.from({
      length: this.minCoords.length - 2,
    }).map((_, d) => this.getCoordsInDimension(d + 2));

    const formatRestCoords = (coords: number[]) =>
      coords
        .reverse()
        .map((c: number, d: number) => `${d == 0 ? "z" : "w"}=${c}`)
        .join(", ");

    return cartesianProduct(...coordsRest)
      .map(
        (rest) =>
          formatRestCoords(rest) +
          "\n" +
          coordsY
            .map((y) =>
              coordsX
                .map((x) => mapper(this.get([x, y, ...rest] as C)))
                .join("")
            )
            .join("\n")
      )
      .join("\n\n");
  }
}

export type CubeGrid<C extends number[]> = Grid<boolean, C>;
export type CubeGrid3d = CubeGrid<[number, number, number]>;
export type CubeGrid4d = CubeGrid<[number, number, number, number]>;

const ACTIVE = "#";
const INACTIVE = ".";
export const mapCellToString = (isActive: boolean) =>
  isActive ? ACTIVE : INACTIVE;

function plainStringToGrid<C extends number[]>(
  str: string,
  getCoords: (x: number, y: number) => C
): CubeGrid<C> {
  const grid: CubeGrid<C> = new Grid();
  str.split("\n").forEach((line, y) =>
    line.split("").forEach((char, x) => {
      grid.set(getCoords(x, y), char === ACTIVE);
    })
  );
  return grid;
}
export function plainStringToGrid3d(str: string): CubeGrid3d {
  return plainStringToGrid(str, (x, y) => [x, y, 0]);
}
export function plainStringToGrid4d(str: string): CubeGrid4d {
  return plainStringToGrid(str, (x, y) => [x, y, 0, 0]);
}
export const getNeighborCoords = <C extends number[]>(coords: C): C[] => {
  const diffs = [-1, 0, 1];
  return cartesianProduct(...coords.map((_) => diffs))
    .filter((neighborCoords) => neighborCoords.some((c) => c !== 0))
    .map((neighborCoords) => neighborCoords.map((c, i) => c + coords[i]) as C);
};
export function cubeWillBeActive<C extends number[]>(
  coords: C,
  grid: CubeGrid<C>
) {
  let sumOfActiveNeighbors = 0;
  for (const neighborCoords of getNeighborCoords(coords)) {
    if (grid.get(neighborCoords)) {
      sumOfActiveNeighbors++;
    }
    if (sumOfActiveNeighbors > 3) {
      break; //we only care whether it's 2, 3 or more
    }
  }
  if (grid.get(coords)) {
    return sumOfActiveNeighbors === 2 || sumOfActiveNeighbors === 3;
  } else {
    return sumOfActiveNeighbors === 3;
  }
}

export function simulateCycle<C extends number[]>(
  grid: CubeGrid<C>
): CubeGrid<C> {
  const newGrid: CubeGrid<C> = new Grid();
  const padding = 1;
  grid.foreach((_, coords) => {
    if (cubeWillBeActive(coords, grid)) {
      newGrid.set(coords, true);
    }
  }, padding);
  return newGrid;
}

export function simulateCycles<C extends number[]>(
  grid: CubeGrid<C>,
  numberOfCycles: number
): CubeGrid<C> {
  for (let index = 0; index < numberOfCycles; index++) {
    grid = simulateCycle(grid);
  }
  return grid;
}

export function countActiveCubes<C extends number[]>(grid: CubeGrid<C>) {
  let sumOfActiveCubes = 0;
  grid.foreach((isActive) => {
    if (isActive) sumOfActiveCubes++;
  });
  return sumOfActiveCubes;
}

export function solution1() {
  const input = getInput(17, 2020).trim();
  const initialGrid = plainStringToGrid3d(input);
  const gridAfterCycle6 = simulateCycles(initialGrid, 6);
  return countActiveCubes(gridAfterCycle6);
}
export function solution2() {
  const input = getInput(17, 2020).trim();
  const initialGrid = plainStringToGrid4d(input);
  const gridAfterCycle6 = simulateCycles(initialGrid, 6);
  return countActiveCubes(gridAfterCycle6);
}
