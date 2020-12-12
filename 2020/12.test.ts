import {
  angleToCoordinates,
  getManhattanDistance,
  parseInstruction,
  PositionComputer,
  WaypointComputer,
} from "./12";

test("angleToCoordinates", () => {
  expect(angleToCoordinates(0)).toEqual([1, 0]);
  expect(angleToCoordinates(90)).toEqual([0, 1]);
  expect(angleToCoordinates(180)).toEqual([-1, 0]);
  expect(angleToCoordinates(-90)).toEqual([0, -1]);
  expect(() => angleToCoordinates(45)).toThrow();
});

test("parseInstruction", () => {
  expect(parseInstruction("F10")).toEqual(["F", 10]);
  expect(parseInstruction("N3")).toEqual(["N", 3]);
  expect(parseInstruction("L180")).toEqual(["L", 180]);
});

test("PositionComputer", () => {
  const positionComputer = new PositionComputer();
  expect(positionComputer.angle).toEqual(0);
  expect(positionComputer.position).toEqual([0, 0]);
  positionComputer.performInstruction("F10");
  expect(positionComputer.position).toEqual([10, 0]);
  positionComputer.performInstruction("N3");
  expect(positionComputer.position).toEqual([10, -3]);
  positionComputer.performInstruction("F7");
  expect(positionComputer.position).toEqual([17, -3]);
  positionComputer.performInstruction("R90");
  expect(positionComputer.angle).toEqual(90);
  expect(positionComputer.position).toEqual([17, -3]);
  positionComputer.performInstruction("F11");
  expect(positionComputer.position).toEqual([17, 8]);

  expect(getManhattanDistance(positionComputer.position)).toEqual(25);
});
test("WaypointComputer", () => {
  const waypointComputer = new WaypointComputer();
  expect(waypointComputer.waypoint).toEqual([10, -1]);
  waypointComputer.performInstruction("F10");
  expect(waypointComputer.position).toEqual([100, -10]);
  waypointComputer.performInstruction("N3");
  expect(waypointComputer.waypoint).toEqual([10, -4]);
  waypointComputer.performInstruction("F7");
  expect(waypointComputer.position).toEqual([170, -38]);
  waypointComputer.performInstruction("R90");
  expect(waypointComputer.waypoint).toEqual([4, 10]);
  waypointComputer.performInstruction("F11");
  expect(waypointComputer.position).toEqual([214, 72]);

  expect(getManhattanDistance(waypointComputer.position)).toEqual(286);
});
