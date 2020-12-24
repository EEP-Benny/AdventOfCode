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
