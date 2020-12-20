import { getInputArray } from "../utils";

export function pixelsToIntegers(pixelArray: string[]) {
  const binaryArray = pixelArray.map((pixel) => (pixel === "#" ? "1" : "0"));
  const int1 = parseInt(binaryArray.join(""), 2);
  const int2 = parseInt(binaryArray.reverse().join(""), 2);
  return [int1, int2];
}

export function getBorderIds(pixels: string) {
  const lines = pixels.split("\n");
  const borderPixelsTop = [];
  const borderPixelsRight = [];
  const borderPixelsBottom = [];
  const borderPixelsLeft = [];
  const last = lines.length - 1;
  for (let i = 0; i <= last; i++) {
    borderPixelsTop.push(lines[0][i]);
    borderPixelsRight.push(lines[i][last]);
    borderPixelsBottom.push(lines[last][last - i]);
    borderPixelsLeft.push(lines[last - i][0]);
  }
  return [
    ...pixelsToIntegers(borderPixelsTop),
    ...pixelsToIntegers(borderPixelsRight),
    ...pixelsToIntegers(borderPixelsBottom),
    ...pixelsToIntegers(borderPixelsLeft),
  ];
}

export function transformBorderIds<T>(
  borderIds: T[],
  orientation: Orientation
) {
  const copiedBorderIds = [...borderIds];
  if (orientation % 2 === 0) {
    return copiedBorderIds.concat(copiedBorderIds.splice(0, 8 - orientation));
  } else {
    copiedBorderIds.reverse();
    return copiedBorderIds.concat(copiedBorderIds.splice(0, 7 - orientation));
  }
}

type BorderMap = Map<number, Set<string>>;

export enum Orientation {
  top = 0,
  topFlipped = 1,
  right = 2,
  rightFlipped = 3,
  bottom = 4,
  bottomFlipped = 5,
  left = 6,
  leftFlipped = 7,
}

type StitchRecord = {
  tileId: string;
  orientation: Orientation;
};
export function stitchRecord(
  tileId: string,
  orientation = Orientation.top
): StitchRecord {
  return { tileId, orientation };
}
export class JigsawPuzzle {
  borderIdToTileIdsMap: BorderMap = new Map();
  tileIdToBorderIdsMap = new Map<string, number[]>();
  matchesPerTileId = new Map<string, number>();

  constructor(tiles: string[]) {
    for (const tile of tiles) {
      const matches = tile.match(/^Tile (\d+):\n(.*)$/s); // s flag: Allows . to match newline characters
      const [, tileId, pixels] = matches;
      const borderIds = getBorderIds(pixels);
      this.tileIdToBorderIdsMap.set(tileId, borderIds);
      for (const borderId of borderIds) {
        const set = this.borderIdToTileIdsMap.get(borderId) ?? new Set();
        set.add(tileId);
        this.borderIdToTileIdsMap.set(borderId, set);
      }
    }

    this.borderIdToTileIdsMap.forEach((setOfTileIds) => {
      const matchCount = setOfTileIds.size - 1; // don't count the "self-match"
      setOfTileIds.forEach((tileId) => {
        const matchTotal =
          (this.matchesPerTileId.get(tileId) ?? 0) + matchCount;
        this.matchesPerTileId.set(tileId, matchTotal);
      });
    });
  }

  getCornerTileIds(): string[] {
    const cornerTileIds = [];
    this.matchesPerTileId.forEach((matchCount, tileId) => {
      if (matchCount === 4) {
        cornerTileIds.push(tileId);
      }
    });
    return cornerTileIds;
  }

  getNeighbor(
    stitchRecord: StitchRecord,
    direction: Orientation
  ): StitchRecord {
    const borderIds = transformBorderIds(
      this.tileIdToBorderIdsMap.get(stitchRecord.tileId),
      stitchRecord.orientation
    );

    const borderId = borderIds[direction];
    if (!borderId) {
      console.error({ direction, borderIds, borderId });
    }
    const tileId = Array.from(
      this.borderIdToTileIdsMap.get(borderId).values()
    ).find((tileId) => tileId !== stitchRecord.tileId);
    if (!tileId) {
      return undefined;
    }
    const directionToLookAt = (direction + 5) % 8;
    for (let orientation = 0; orientation < 8; orientation++) {
      if (
        transformBorderIds(this.tileIdToBorderIdsMap.get(tileId), orientation)[
          directionToLookAt
        ] === borderId
      ) {
        return { tileId, orientation };
      }
    }
    throw "Didn't find anything suitable, this shouldn't happen";
  }

  getTopNeighbor = (stitchRecord: StitchRecord) =>
    this.getNeighbor(stitchRecord, Orientation.top);
  getRightNeighbor = (stitchRecord: StitchRecord) =>
    this.getNeighbor(stitchRecord, Orientation.right);
  getBottomNeighbor = (stitchRecord: StitchRecord) =>
    this.getNeighbor(stitchRecord, Orientation.bottom);
  getLeftNeighbor = (stitchRecord: StitchRecord) =>
    this.getNeighbor(stitchRecord, Orientation.left);

  getTopLeftTile() {
    let topLeftTile: StitchRecord = undefined;
    this.matchesPerTileId.forEach((matches, tileId) => {
      if (!topLeftTile && matches === 4) {
        for (const orientation of [0, 2, 4, 6] as const) {
          topLeftTile = stitchRecord(tileId, orientation);
          if (
            this.getRightNeighbor(topLeftTile) &&
            this.getBottomNeighbor(topLeftTile)
          ) {
            break;
          }
        }
      }
    });
    return topLeftTile;
  }
  findTileArrangement() {
    const tileArrangement: StitchRecord[][] = [];
    let firstTileOfNextRow = this.getTopLeftTile();
    let nextTile: StitchRecord;
    do {
      let currentRow = [firstTileOfNextRow];
      while ((nextTile = this.getRightNeighbor(currentRow[0]))) {
        currentRow.unshift(nextTile);
      }
      currentRow.reverse();
      tileArrangement.push(currentRow);
      firstTileOfNextRow = this.getBottomNeighbor(currentRow[0]);
    } while (firstTileOfNextRow);
    return tileArrangement;
  }
}
export function solution1() {
  const tiles = getInputArray({ day: 20, year: 2020, separator: "\n\n" });
  const puzzle = new JigsawPuzzle(tiles);
  const cornerTileIds = puzzle.getCornerTileIds();
  return cornerTileIds.reduce((soFar, tileId) => soFar * +tileId, 1);
}
