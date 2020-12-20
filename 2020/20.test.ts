import {
  getBorderIds,
  JigsawPuzzle,
  Orientation,
  pixelsToIntegers,
  stitchRecord,
  transformAndCropPixels,
  transformBorderIds,
  transformPixels,
} from "./20";

const exampleTile = `
..........
.#..#.....
....##..#.
.###.#....
.#.##.###.
.#...#.##.
.#.#.#..#.
..#....#..
###...#.#.
#.......##
`.trim();

const exampleTiles = `
Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...
`
  .trim()
  .split("\n\n");

test("pixelsToIntegers", () => {
  expect(pixelsToIntegers("..........".split(""))).toEqual([0, 0]);
  expect(pixelsToIntegers(".........#".split(""))).toEqual([1, 512]);
});

test("getBorderIds", () => {
  expect(getBorderIds(exampleTile)).toEqual([0, 0, 1, 512, 769, 515, 768, 3]);
});

test("transformBorderIds", () => {
  const borderIds = "ab,ba,bc,cb,cd,dc,da,ad".split(",");
  expect(transformBorderIds(borderIds, Orientation.top)).toEqual(
    "ab,ba,bc,cb,cd,dc,da,ad".split(",")
  );
  expect(transformBorderIds(borderIds, Orientation.topFlipped)).toEqual(
    "ba,ab,ad,da,dc,cd,cb,bc".split(",")
  );
  expect(transformBorderIds(borderIds, Orientation.right)).toEqual(
    "da,ad,ab,ba,bc,cb,cd,dc".split(",")
  );
  expect(transformBorderIds(borderIds, Orientation.rightFlipped)).toEqual(
    "cb,bc,ba,ab,ad,da,dc,cd".split(",")
  );
});

test("transformAndCropPixels", () => {
  const testTransform = (orientation: Orientation) =>
    transformAndCropPixels(["....", ".ab.", ".dc.", "...."], orientation);
  expect(testTransform(Orientation.top)).toEqual(["ab", "dc"]);
  expect(testTransform(Orientation.topFlipped)).toEqual(["ba", "cd"]);
  expect(testTransform(Orientation.right)).toEqual(["da", "cb"]);
  expect(testTransform(Orientation.rightFlipped)).toEqual(["cb", "da"]);
  expect(testTransform(Orientation.bottom)).toEqual(["cd", "ba"]);
  expect(testTransform(Orientation.bottomFlipped)).toEqual(["dc", "ab"]);
  expect(testTransform(Orientation.left)).toEqual(["bc", "ad"]);
  expect(testTransform(Orientation.leftFlipped)).toEqual(["ad", "bc"]);
  expect(
    transformAndCropPixels(
      [
        "#.#.#####.",
        ".#..######",
        "..#.......",
        "######....",
        "####.#..#.",
        ".#...#.##.",
        "#.#####.##",
        "..#.###...",
        "..#.......",
        "..#.###...",
      ],
      Orientation.top
    )
  ).toEqual([
    "#..#####",
    ".#......",
    "#####...",
    "###.#..#",
    "#...#.##",
    ".#####.#",
    ".#.###..",
    ".#......",
  ]);
  expect(
    transformAndCropPixels(
      [
        "..##.#..#.",
        "##..#.....",
        "#...##..#.",
        "####.#...#",
        "##.##.###.",
        "##...#.###",
        ".#.#.#..##",
        "..#....#..",
        "###...#.#.",
        "..###..###",
      ],
      Orientation.bottomFlipped
    )
  ).toEqual([
    "##...#.#",
    ".#....#.",
    "#.#.#..#",
    "#...#.##",
    "#.##.###",
    "###.#...",
    "...##..#",
    "#..#....",
  ]);
});

test("JigsawPuzzle.matchesPerTileId", () => {
  const puzzle = new JigsawPuzzle(exampleTiles);
  expect(puzzle.matchesPerTileId).toEqual(
    new Map([
      ["2311", 6],
      ["1951", 4],
      ["1171", 4],
      ["1427", 8],
      ["1489", 6],
      ["2473", 6],
      ["2971", 4],
      ["2729", 6],
      ["3079", 4],
    ])
  );
});

test("JigsawPuzzle.getCornerTileIds", () => {
  const puzzle = new JigsawPuzzle(exampleTiles);
  expect(puzzle.getCornerTileIds()).toEqual(["3079", "1951", "1171", "2971"]);
});

test("JigsawPuzzle.get*Neighbor", () => {
  const puzzle = new JigsawPuzzle(exampleTiles);
  const sr = stitchRecord("3079", Orientation.top);
  const sr90 = stitchRecord("3079", Orientation.right);
  const sr180 = stitchRecord("3079", Orientation.bottom);
  const srF = stitchRecord("3079", Orientation.topFlipped);

  expect(puzzle.getTopNeighbor(sr)).toEqual(undefined);
  expect(puzzle.getRightNeighbor(sr)).toEqual(undefined);
  expect(puzzle.getBottomNeighbor(sr)).toEqual(
    stitchRecord("2473", Orientation.rightFlipped)
  );
  expect(puzzle.getLeftNeighbor(sr)).toEqual(
    stitchRecord("2311", Orientation.bottomFlipped)
  );
  expect(puzzle.getTopNeighbor(sr90)).toEqual(
    stitchRecord("2311", Orientation.leftFlipped)
  );
  expect(puzzle.getRightNeighbor(sr90)).toEqual(undefined);
  expect(puzzle.getBottomNeighbor(sr90)).toEqual(undefined);
  expect(puzzle.getLeftNeighbor(sr90)).toEqual(
    stitchRecord("2473", Orientation.bottomFlipped)
  );
  expect(puzzle.getTopNeighbor(sr180)).toEqual(
    stitchRecord("2473", Orientation.leftFlipped)
  );
  expect(puzzle.getRightNeighbor(sr180)).toEqual(
    stitchRecord("2311", Orientation.topFlipped)
  );
  expect(puzzle.getBottomNeighbor(sr180)).toEqual(undefined);
  expect(puzzle.getLeftNeighbor(sr180)).toEqual(undefined);
  expect(puzzle.getTopNeighbor(srF)).toEqual(undefined);
  expect(puzzle.getRightNeighbor(srF)).toEqual(
    stitchRecord("2311", Orientation.bottom)
  );
  expect(puzzle.getBottomNeighbor(srF)).toEqual(
    stitchRecord("2473", Orientation.left)
  );
  expect(puzzle.getLeftNeighbor(srF)).toEqual(undefined);
});

test("JigsawPuzzle.getTopLeftTile", () => {
  const puzzle = new JigsawPuzzle(exampleTiles);
  expect(puzzle.getTopLeftTile()).toEqual(
    stitchRecord("3079", Orientation.left)
  );
});

test("JigsawPuzzle.findTileArrangement", () => {
  const stitchedTiles = new JigsawPuzzle(exampleTiles).findTileArrangement();
  expect(stitchedTiles[0][0]?.tileId).toBe("3079");
  expect(stitchedTiles[0][1]?.tileId).toBe("2473");
  expect(stitchedTiles[0][2]?.tileId).toBe("1171");
  expect(stitchedTiles[1][0]?.tileId).toBe("2311");
  expect(stitchedTiles[1][1]?.tileId).toBe("1427");
  expect(stitchedTiles[1][2]?.tileId).toBe("1489");
  expect(stitchedTiles[2][0]?.tileId).toBe("1951");
  expect(stitchedTiles[2][1]?.tileId).toBe("2729");
  expect(stitchedTiles[2][2]?.tileId).toBe("2971");
});

test("JigsawPuzzle.getStitchedImage", () => {
  expect(
    transformPixels(
      new JigsawPuzzle(exampleTiles).getStitchedImage(),
      Orientation.right
    )
  ).toEqual([
    ".#.#..#.##...#.##..#####",
    "###....#.#....#..#......",
    "##.##.###.#.#..######...",
    "###.#####...#.#####.#..#",
    "##.#....#.##.####...#.##",
    "...########.#....#####.#",
    "....#..#...##..#.#.###..",
    ".####...#..#.....#......",
    "#..#.##..#..###.#.##....",
    "#.####..#.####.#.#.###..",
    "###.#.#...#.######.#..##",
    "#.####....##..########.#",
    "##..##.#...#...#.#.#.#..",
    "...#..#..#.#.##..###.###",
    ".#.#....#.##.#...###.##.",
    "###.#...#..#.##.######..",
    ".#.#.###.##.##.#..#.##..",
    ".####.###.#...###.#..#.#",
    "..#.#..#..#.#.#.####.###",
    "#..####...#.#.#.###.###.",
    "#####..#####...###....##",
    "#.##..#..#...#..####...#",
    ".#.###..##..##..####.##.",
    "...###...##...#...#..###",
  ]);
});

test("JigsawPuzzle.countSeaMonsters", () => {
  expect(new JigsawPuzzle(exampleTiles).countSeaMonsters()).toBe(2);
});

test("JigsawPuzzle.getHabitatRoughness", () => {
  expect(new JigsawPuzzle(exampleTiles).getHabitatRoughness()).toBe(273);
});
