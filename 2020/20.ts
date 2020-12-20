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
    borderPixelsBottom.push(lines[last][i]);
    borderPixelsLeft.push(lines[i][0]);
  }
  return [
    ...pixelsToIntegers(borderPixelsTop),
    ...pixelsToIntegers(borderPixelsRight),
    ...pixelsToIntegers(borderPixelsBottom),
    ...pixelsToIntegers(borderPixelsLeft),
  ];
}
type BorderMap = Map<number, Set<string>>;
export function getMatchesPerTileId(tiles: string[]) {
  const borderIdToTileIdsMap: BorderMap = new Map();
  for (const tile of tiles) {
    const matches = tile.match(/^Tile (\d+):\n(.*)$/s); // s flag: Allows . to match newline characters
    const [, tileId, pixels] = matches;
    for (const borderId of getBorderIds(pixels)) {
      const set = borderIdToTileIdsMap.get(borderId) ?? new Set();
      set.add(tileId);
      borderIdToTileIdsMap.set(borderId, set);
    }
  }

  const matchesPerTileId = new Map<string, number>();
  borderIdToTileIdsMap.forEach((setOfTileIds) => {
    const matchCount = setOfTileIds.size - 1; // don't count the "self-match"
    setOfTileIds.forEach((tileId) => {
      const matchTotal = (matchesPerTileId.get(tileId) ?? 0) + matchCount;
      matchesPerTileId.set(tileId, matchTotal);
    });
  });
  return matchesPerTileId;
}

export function getCornerTileIds(
  matchesPerTileId: Map<string, number>
): string[] {
  const cornerTileIds = [];
  matchesPerTileId.forEach((matchCount, tileId) => {
    if (matchCount === 4) {
      cornerTileIds.push(tileId);
    }
  });
  return cornerTileIds;
}

export function solution1() {
  const tiles = getInputArray({ day: 20, year: 2020, separator: "\n\n" });
  const matchesPerTileId = getMatchesPerTileId(tiles);
  const cornerTileIds = getCornerTileIds(matchesPerTileId);
  return cornerTileIds.reduce((soFar, tileId) => soFar * +tileId, 1);
}
