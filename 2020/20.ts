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

function transformCoordinates(
  x: number,
  y: number,
  last: number,
  orientation: Orientation
) {
  switch (orientation) {
    case Orientation.top:
      return [x, y];
    case Orientation.topFlipped:
      return [last - x, y];
    case Orientation.right:
      return [y, last - x];
    case Orientation.rightFlipped:
      return [last - y, last - x];
    case Orientation.bottom:
      return [last - x, last - y];
    case Orientation.bottomFlipped:
      return [x, last - y];
    case Orientation.left:
      return [last - y, x];
    case Orientation.leftFlipped:
      return [y, x];
    default:
      return [0, 0];
  }
}
export function transformPixels(pixels: string[], orientation: Orientation) {
  const transformedPixels: string[] = [];
  const last = pixels.length - 1;
  for (let y = 0; y <= last; y++) {
    const line = [];
    for (let x = 0; x <= last; x++) {
      const [x2, y2] = transformCoordinates(x, y, last, orientation);
      line.push(pixels[y2][x2]);
    }
    transformedPixels.push(line.join(""));
  }
  return transformedPixels;
}
export function transformAndCropPixels(
  pixels: string[],
  orientation: Orientation
) {
  const croppedPixels = pixels
    .slice(1, pixels.length - 1)
    .map((line) => line.substring(1, line.length - 1));
  return transformPixels(croppedPixels, orientation);
}

export function makePatternDetector(patternLines: string[]) {
  const requiredPixels: [number, number][] = [];
  patternLines.forEach((patternLine, y) => {
    patternLine.split("").forEach((pixel, x) => {
      if (pixel !== " ") {
        requiredPixels.push([x, y]);
      }
    });
  });
  return function isMatchAtPosition(x: number, y: number, pixels: string[]) {
    for (const [dx, dy] of requiredPixels) {
      if (pixels[y + dy]?.[x + dx] !== "#") {
        return false;
      }
    }
    return true;
  };
}

export const seaMonsterPattern = [
  "                  # ",
  "#    ##    ##    ###",
  " #  #  #  #  #  #   ",
];
export const isSeaMonsterAtPosition = makePatternDetector(seaMonsterPattern);
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
  tileIdToPixelsMap = new Map<string, string[]>();
  matchesPerTileId = new Map<string, number>();

  constructor(tiles: string[]) {
    for (const tile of tiles) {
      const matches = tile.match(/^Tile (\d+):\n(.*)$/s); // s flag: Allows . to match newline characters
      const [, tileId, pixels] = matches;
      this.tileIdToPixelsMap.set(tileId, pixels.split("\n"));
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

  getStitchedImage(): string[] {
    const tileArrangement = this.findTileArrangement();
    const stitchedImage = [];
    for (const tileRow of tileArrangement) {
      let row: string[] = undefined;
      for (const tile of tileRow) {
        const pixelsOfTile = transformAndCropPixels(
          this.tileIdToPixelsMap.get(tile.tileId),
          tile.orientation
        );
        if (row === undefined) {
          row = pixelsOfTile;
        } else {
          pixelsOfTile.forEach((pixelLine, lineNumber) => {
            row[lineNumber] += pixelLine;
          });
        }
      }
      stitchedImage.push(...row);
    }
    return stitchedImage;
  }

  countSeaMonsters(): number {
    let maxSeaMonsters = 0;
    const stitchedImage = this.getStitchedImage();
    for (const orientation of [0, 1, 2, 3, 4, 5, 6, 7]) {
      let currentSeaMonsters = 0;
      const transformedImage = transformPixels(stitchedImage, orientation);
      for (let y = 0; y < transformedImage.length; y++) {
        for (let x = 0; x < transformedImage[y].length; x++) {
          if (isSeaMonsterAtPosition(x, y, transformedImage)) {
            currentSeaMonsters++;
          }
        }
      }
      if (currentSeaMonsters > maxSeaMonsters) {
        maxSeaMonsters = currentSeaMonsters;
      }
    }
    return maxSeaMonsters;
  }

  getHabitatRoughness() {
    const stitchedImage = this.getStitchedImage();
    const numberOfSeaMonsters = this.countSeaMonsters();
    const numberOfRoughPixels = stitchedImage.join("").match(/#/g).length;
    const numberOfPixelsPerSeaMonster = seaMonsterPattern.join("").match(/#/g)
      .length;
    return (
      numberOfRoughPixels - numberOfSeaMonsters * numberOfPixelsPerSeaMonster
    );
  }
}
export function solution1() {
  const tiles = getInputArray({ day: 20, year: 2020, separator: "\n\n" });
  const puzzle = new JigsawPuzzle(tiles);
  const cornerTileIds = puzzle.getCornerTileIds();
  return cornerTileIds.reduce((soFar, tileId) => soFar * +tileId, 1);
}

export function solution2() {
  const tiles = getInputArray({ day: 20, year: 2020, separator: "\n\n" });
  return new JigsawPuzzle(tiles).getHabitatRoughness();
}
