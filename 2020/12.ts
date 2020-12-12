import { dir } from "console";
import { getInputArray } from "../utils";

export function angleToCoordinates(angle: number): [number, number] {
  angle = ((angle % 360) + 360) % 360; // modulo instead of remainder, enforces positive angle

  switch (angle) {
    case 0:
      return [1, 0];
    case 90:
      return [0, 1];
    case 180:
      return [-1, 0];
    case 270:
      return [0, -1];
    default:
      throw `Angle ${angle}° is outside the 90° grid`;
  }
}

export enum Action {
  North = "N",
  South = "S",
  East = "E",
  West = "W",
  Left = "L",
  Right = "R",
  Forward = "F",
}
export function parseInstruction(str: string): [Action, number] {
  const match = str.match(/^([NSEWLRF])(\d+)$/);
  const action = match[1] as Action;
  const value = +match[2];
  return [action, value];
}

export function getManhattanDistance([x, y]: [number, number]) {
  return Math.abs(x) + Math.abs(y);
}

export class PositionComputer {
  angle = 0;
  position: [number, number] = [0, 0];

  performInstruction(instructionStr: string) {
    const [action, value] = parseInstruction(instructionStr);
    switch (action) {
      case Action.North:
        this.position[1] -= value;
        break;
      case Action.South:
        this.position[1] += value;
        break;
      case Action.East:
        this.position[0] += value;
        break;
      case Action.West:
        this.position[0] -= value;
        break;
      case Action.Left:
        this.angle -= value;
        break;
      case Action.Right:
        this.angle += value;
        break;
      case Action.Forward:
        {
          const direction = angleToCoordinates(this.angle);
          this.position[0] += direction[0] * value;
          this.position[1] += direction[1] * value;
        }
        break;
      default:
        throw `Unsupported action ${action}`;
    }
  }
}
export class WaypointComputer {
  waypoint: [number, number] = [10, -1];
  position: [number, number] = [0, 0];

  rotateWaypoint(angle: number) {
    const a = angleToCoordinates(-angle);
    const b = angleToCoordinates(90 - angle);
    this.waypoint = [
      this.waypoint[0] * a[0] + this.waypoint[1] * a[1],
      this.waypoint[0] * b[0] + this.waypoint[1] * b[1],
    ];
  }

  performInstruction(instructionStr: string) {
    const [action, value] = parseInstruction(instructionStr);
    switch (action) {
      case Action.North:
        this.waypoint[1] -= value;
        break;
      case Action.South:
        this.waypoint[1] += value;
        break;
      case Action.East:
        this.waypoint[0] += value;
        break;
      case Action.West:
        this.waypoint[0] -= value;
        break;
      case Action.Left:
        this.rotateWaypoint(-value);
        break;
      case Action.Right:
        this.rotateWaypoint(value);
        break;
      case Action.Forward:
        this.position[0] += this.waypoint[0] * value;
        this.position[1] += this.waypoint[1] * value;
        break;
      default:
        throw `Unsupported action ${action}`;
    }
  }
}

export function solution1() {
  const instructions = getInputArray({ day: 12, year: 2020, separator: "\n" });
  const positionComputer = new PositionComputer();
  instructions.forEach((instruction) =>
    positionComputer.performInstruction(instruction)
  );
  return getManhattanDistance(positionComputer.position);
}

export function solution2() {
  const instructions = getInputArray({ day: 12, year: 2020, separator: "\n" });
  const waypointComputer = new WaypointComputer();
  instructions.forEach((instruction) =>
    waypointComputer.performInstruction(instruction)
  );
  return getManhattanDistance(waypointComputer.position);
}
