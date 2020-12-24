import {
  getCoordinateFromDirections,
  HexagonalFloor,
  parseDirections,
} from "./24";

const largerExample = [
  "sesenwnenenewseeswwswswwnenewsewsw",
  "neeenesenwnwwswnenewnwwsewnenwseswesw",
  "seswneswswsenwwnwse",
  "nwnwneseeswswnenewneswwnewseswneseene",
  "swweswneswnenwsewnwneneseenw",
  "eesenwseswswnenwswnwnwsewwnwsene",
  "sewnenenenesenwsewnenwwwse",
  "wenwwweseeeweswwwnwwe",
  "wsweesenenewnwwnwsenewsenwwsesesenwne",
  "neeswseenwwswnwswswnw",
  "nenwswwsewswnenenewsenwsenwnesesenew",
  "enewnwewneswsewnwswenweswnenwsenwsw",
  "sweneswneswneneenwnewenewwneswswnese",
  "swwesenesewenwneswnwwneseswwne",
  "enesenwswwswneneswsenwnewswseenwsese",
  "wnwnesenesenenwwnenwsewesewsesesew",
  "nenewswnwewswnenesenwnesewesw",
  "eneswnwswnwsenenwnwnwwseeswneewsenese",
  "neswnwewnwnwseenwseesewsenwsweewe",
  "wseweeenwnesenwwwswnew",
];

test("parseDirections", () => {
  expect(parseDirections("esew")).toEqual(["e", "se", "w"]);
  expect(parseDirections("nwwswee")).toEqual(["nw", "w", "sw", "e", "e"]);
});

test("getCoordinateFromDirections", () => {
  expect(getCoordinateFromDirections(parseDirections("esew"))).toEqual([0, -1]);
  expect(getCoordinateFromDirections(parseDirections("nwwswee"))).toEqual([
    0,
    0,
  ]);
});

test("HexagonalFloor", () => {
  const floor = new HexagonalFloor();
  expect(floor.countBlackTiles()).toEqual(0);
  floor.executeInstructions(largerExample);
  expect(floor.countBlackTiles()).toEqual(10);
});

test("Hexagonal game of life", () => {
  const floor = new HexagonalFloor();
  floor.executeInstructions(largerExample);
  expect(floor.countBlackTiles()).toEqual(10);
  floor.simulateOneDay();
  expect(floor.currentDay).toEqual(1);
  expect(floor.countBlackTiles()).toEqual(15);
  floor.simulateUntilDay(2);
  expect(floor.countBlackTiles()).toEqual(12);
  floor.simulateUntilDay(3);
  expect(floor.countBlackTiles()).toEqual(25);
  floor.simulateUntilDay(4);
  expect(floor.countBlackTiles()).toEqual(14);
  floor.simulateUntilDay(5);
  expect(floor.countBlackTiles()).toEqual(23);
  floor.simulateUntilDay(10);
  expect(floor.countBlackTiles()).toEqual(37);
  floor.simulateUntilDay(100);
  expect(floor.countBlackTiles()).toEqual(2208);
});
