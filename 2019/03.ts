import { getInputArray } from '../utils';

export function splitInstruction(instruction: string) {
    const dir = instruction[0];
    const count = parseInt(instruction.substr(1));
    return [dir, count];
}

export function manhattanDistance([x, y]) {
    return Math.abs(x) + Math.abs(y);
}

function iterateWire(wire: string, callback: (x: number, y: number, stepCount: number) => void) {
    let x = 0, y = 0, stepCount = 0;
    wire.split(",").forEach(instruction => {
        const [dir, count] = splitInstruction(instruction);
        for (let i = 0; i < count; i++) {
            switch (dir) {
                case "R": x++; break;
                case "L": x--; break;
                case "U": y++; break;
                case "D": y--; break;
            }
            stepCount++;
            callback(x, y, stepCount);
        }
    })
}
export function findCrossings(firstWire: string, secondWire: string) {
    const grid = {};
    const crossings = [];
    const key = (x: number, y: number) => `${x}-${y}`;

    iterateWire(firstWire, (x, y, stepCount1) => {
        grid[key(x, y)] = stepCount1;
    });
    iterateWire(secondWire, (x, y, stepCount2) => {
        const stepCount1 = grid[key(x, y)];
        if (stepCount1 > 0) {
            crossings.push([x, y, stepCount1 + stepCount2]);
        }
    })
    return crossings;
}

export function closestManhattanDistance(crossings: [number, number, number][]) {
    return Math.min(...crossings.map(([x, y, _]) => manhattanDistance([x, y])));
}
export function closestTimeDistance(crossings: [number, number, number][]) {
    return Math.min(...crossings.map(([_1, _2, steps]) => steps));
}
export function findClosestCrossing([firstWire, secondWire]: [string, string], distanceFn: (crossings: [number, number, number][]) => number) {
    return distanceFn(findCrossings(firstWire, secondWire));
}

function getWires(): [string, string] {
    const [firstWire, secondWire] = getInputArray({ day: 3, separator: '\n' });
    return [firstWire, secondWire];
}
export function solution1() {
    return findClosestCrossing(getWires(), closestManhattanDistance);
}
export function solution2() {
    return findClosestCrossing(getWires(), closestTimeDistance);
}