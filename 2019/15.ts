import { IntcodeComputer } from './intcode';
import { getProgram } from '../utils';
import { Map2D } from './map2d';

enum Item {
    Wall = 0,
    Empty = 1,
    OxygenTank = 2,
}

enum Direction {
    North = 1,
    South = 2,
    West = 3,
    East = 4,
}

function updatePos(x: number, y: number, dir: Direction) {
    switch (dir) {
        case Direction.North: y--; break;
        case Direction.South: y++; break;
        case Direction.West: x--; break;
        case Direction.East: x++; break;
    }
    return [x, y];
}

function turnLeft(dir: Direction): Direction {
    switch (dir) {
        case Direction.North: return Direction.West;
        case Direction.South: return Direction.East;
        case Direction.West: return Direction.South;
        case Direction.East: return Direction.North;
    }
}
function turnRight(dir: Direction): Direction {
    switch (dir) {
        case Direction.North: return Direction.East;
        case Direction.South: return Direction.West;
        case Direction.West: return Direction.North;
        case Direction.East: return Direction.South;
    }
}
function setExplorationStatusAround(posX: number, posY: number, needsExploring: Map2D<boolean>) {
    if (needsExploring.get(posX + 1, posY) === undefined) needsExploring.set(posX + 1, posY, true);
    if (needsExploring.get(posX - 1, posY) === undefined) needsExploring.set(posX - 1, posY, true);
    if (needsExploring.get(posX, posY + 1) === undefined) needsExploring.set(posX, posY + 1, true);
    if (needsExploring.get(posX, posY - 1) === undefined) needsExploring.set(posX, posY - 1, true);
}
function somethingUnexplored(needsExploring: Map2D<boolean>) {
    let foundSomethingToExplore = false;
    needsExploring.forEach(bool => { foundSomethingToExplore = foundSomethingToExplore || bool; });
    return foundSomethingToExplore;
}

function exploreMap() {
    const comp = new IntcodeComputer(getProgram({ day: 15 }));
    const map = new Map2D<Item>();
    const needsExploring = new Map2D<boolean>();
    let posX = 0, posY = 0;
    let dir = Direction.East;
    map.set(posX, posY, Item.Empty);
    setExplorationStatusAround(posX, posY, needsExploring);
    for (let i = 1; i % 100 !== 0 || somethingUnexplored(needsExploring); i++) {
        comp.nextInputs = [dir];
        const output = comp.runUntilNextOutput();
        const [newX, newY] = updatePos(posX, posY, dir);
        map.set(newX, newY, output);
        needsExploring.set(newX, newY, false);
        if (output === Item.Wall) {
            dir = turnLeft(dir);
        } else {
            dir = turnRight(dir);
            posX = newX;
            posY = newY;
            setExplorationStatusAround(posX, posY, needsExploring);
        }

        if (i % 10000 == 0) {
            console.log(map.getPrintableMap((item, x, y) => {
                if (item == Item.OxygenTank) return "O";
                if (item == Item.Wall) return "█";
                if (x == posX && y == posY) return "X";
                return needsExploring.get(x, y) ? "?" : " ";
            }));
        }
    }
    return map;
}
function findOxygenTank(map: Map2D<Item>) {
    let pos: [number, number];
    map.forEach((item, x, y) => {
        if (item === Item.OxygenTank) {
            pos = [x, y];
        }
    });
    return pos;
}

function floodFillFrom(x: number, y: number, map: Map2D<Item>) {
    const distanceMap = new Map2D<number>();
    distanceMap.set(x, y, 0);
    let filledSomething = true;
    while (filledSomething) {
        filledSomething = false;
        distanceMap.forEach((distance, x, y) => {
            [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].forEach(([x, y]) => {
                if (distanceMap.get(x, y) === undefined && map.get(x, y) !== Item.Wall) {
                    distanceMap.set(x, y, distance + 1);
                    filledSomething = true;
                }
            });
        });
    }
    return distanceMap;
}

const map = exploreMap();
const [x, y] = findOxygenTank(map);
const distanceMap = floodFillFrom(x, y, map);

export function solution1() {
    return distanceMap.get(0, 0);
}
export function solution2() {
    let maxTime = 0;
    distanceMap.forEach(time => {
        if (time > maxTime) { maxTime = time; }
    });
    return maxTime;
}