import {
  getBorderIds,
  getCornerTileIds,
  getMatchesPerTileId,
  pixelsToIntegers,
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
  expect(getBorderIds(exampleTile)).toEqual([0, 0, 1, 512, 515, 769, 3, 768]);
});

test("getMatchesPerTileId", () => {
  expect(getMatchesPerTileId(exampleTiles)).toEqual(
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

test("getCornerTileIds", () => {
  expect(getCornerTileIds(getMatchesPerTileId(exampleTiles))).toEqual([
    "3079",
    "1951",
    "1171",
    "2971",
  ]);
});
