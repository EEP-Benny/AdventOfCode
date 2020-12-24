import { getInputArray } from "../utils";

export type Coordinate = [number, number];
export enum Direction {
  East = "e",
  SouthEast = "se",
  SouthWest = "sw",
  West = "w",
  NorthWest = "nw",
  NorthEast = "ne",
}

const coordinateToString = ([x, y]: Coordinate) => `${x}|${y}`;

export function moveCoordinate(
  [x, y]: Coordinate,
  direction: Direction
): Coordinate {
  const isEvenRow = y % 2 === 0;
  switch (direction) {
    case Direction.East:
      return [x + 1, y];
    case Direction.West:
      return [x - 1, y];
    case Direction.SouthEast:
      return [x + (isEvenRow ? 0 : 1), y - 1];
    case Direction.SouthWest:
      return [x - (isEvenRow ? 1 : 0), y - 1];
    case Direction.NorthEast:
      return [x + (isEvenRow ? 0 : 1), y + 1];
    case Direction.NorthWest:
      return [x - (isEvenRow ? 1 : 0), y + 1];
  }
}

export function getCoordinateFromDirections(
  directions: Direction[]
): Coordinate {
  let coordinate: Coordinate = [0, 0];
  for (const direction of directions) {
    coordinate = moveCoordinate(coordinate, direction);
  }
  return coordinate;
}

export function parseDirections(str: string): Direction[] {
  return str
    .replace(/[ew]/g, "$& ")
    .trim()
    .split(" ")
    .map((d) => {
      if (Object.values(Direction).includes(d as Direction))
        return d as Direction;
      throw `Invalid direction ${d}`;
    });
}

export class HexagonalFloor {
  tileIsBlackMap = new Map<string, boolean>();

  flipTile(coordinate: Coordinate) {
    const stringCoordinate = coordinateToString(coordinate);
    this.tileIsBlackMap.set(
      stringCoordinate,
      !this.tileIsBlackMap.get(stringCoordinate)
    );
  }

  countBlackTiles(): number {
    let count = 0;
    this.tileIsBlackMap.forEach((isBlack) => {
      if (isBlack) count++;
    });
    return count;
  }

  executeInstructions(instructions: string[]) {
    for (const instruction of instructions) {
      this.flipTile(getCoordinateFromDirections(parseDirections(instruction)));
    }
  }
}

export function solution1() {
  const instructions = getInputArray({
    day: 24,
    year: 2020,
    separator: "\n",
  });
  const floor = new HexagonalFloor();
  floor.executeInstructions(instructions);
  return floor.countBlackTiles();
}
