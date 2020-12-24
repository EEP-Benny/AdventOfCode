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
const stringToCoordinate = (str: string): Coordinate => [
  +str.split("|")[0],
  +str.split("|")[1],
];

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
  coordinatesOfBlackTiles = new Set<string>();
  currentDay = 0;

  flipTile(coordinate: Coordinate) {
    const stringCoordinate = coordinateToString(coordinate);
    if (this.coordinatesOfBlackTiles.has(stringCoordinate)) {
      this.coordinatesOfBlackTiles.delete(stringCoordinate);
    } else {
      this.coordinatesOfBlackTiles.add(stringCoordinate);
    }
  }

  //   countOfBlackNeighbors(coordinate: Coordinate) {
  //     let count = 0;
  //     for (const direction of Object.values(Direction)) {
  //       if (
  //         this.coordinatesOfBlackTiles.has(
  //           coordinateToString(moveCoordinate(coordinate, direction))
  //         )
  //       ) {
  //         count++;
  //       }
  //     }
  //   }

  countBlackTiles(): number {
    return this.coordinatesOfBlackTiles.size;
  }

  executeInstructions(instructions: string[]) {
    for (const instruction of instructions) {
      this.flipTile(getCoordinateFromDirections(parseDirections(instruction)));
    }
  }

  simulateOneDay() {
    const oldFloor = this.coordinatesOfBlackTiles;
    this.coordinatesOfBlackTiles = new Set();

    const surroundingTilesToConsider = new Set<string>();
    oldFloor.forEach((stringCoordinateOfBlackTile) => {
      const coordinateOfBlackTile = stringToCoordinate(
        stringCoordinateOfBlackTile
      );

      let countOfBlackNeighbors = 0;
      for (const direction of Object.values(Direction)) {
        const stringCoordinate = coordinateToString(
          moveCoordinate(coordinateOfBlackTile, direction)
        );
        if (oldFloor.has(stringCoordinate)) {
          countOfBlackNeighbors++;
        } else {
          surroundingTilesToConsider.add(stringCoordinate);
        }
      }

      if (countOfBlackNeighbors === 1 || countOfBlackNeighbors === 2) {
        // this tile remains black
        this.coordinatesOfBlackTiles.add(stringCoordinateOfBlackTile);
      }
    });
    surroundingTilesToConsider.forEach((stringCoordinateOfWhiteTile) => {
      const coordinateOfWhiteTile = stringToCoordinate(
        stringCoordinateOfWhiteTile
      );
      let countOfBlackNeighbors = 0;
      for (const direction of Object.values(Direction)) {
        const stringCoordinate = coordinateToString(
          moveCoordinate(coordinateOfWhiteTile, direction)
        );
        if (oldFloor.has(stringCoordinate)) {
          countOfBlackNeighbors++;
        }
      }
      if (countOfBlackNeighbors === 2) {
        // this tile is flipped to black
        this.coordinatesOfBlackTiles.add(stringCoordinateOfWhiteTile);
      }
    });

    this.currentDay++;
  }

  simulateUntilDay(desiredDay: number) {
    if (this.currentDay > desiredDay) {
      throw "I can't travel back in time";
    }
    while (this.currentDay < desiredDay) {
      this.simulateOneDay();
    }
  }
}

function getFloor() {
  const instructions = getInputArray({
    day: 24,
    year: 2020,
    separator: "\n",
  });
  const floor = new HexagonalFloor();
  floor.executeInstructions(instructions);
  return floor;
}

export function solution1() {
  const floor = getFloor();
  return floor.countBlackTiles();
}
export function solution2() {
  const floor = getFloor();
  floor.simulateUntilDay(100);
  return floor.countBlackTiles();
}
