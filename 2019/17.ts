import { Map2D } from './map2d';
import { getInputArray } from '../utils';
import { IntcodeComputer } from './intcode';

function getProgram() {
    return getInputArray({ day: 17, separator: ',' }).map(s => parseInt(s, 10));
}

export function convertToMap2D(gridAsString: string): Map2D<string> {
    const map = new Map2D<string>();
    const lines = gridAsString.trim().split("\n");
    lines.forEach((line, y) => {
        const chars = line.split("");
        chars.forEach((char, x) => {
            map.set(x, y, char);
        });
    });
    return map;
}

export function getIntersectionPoints(map: Map2D<string>) {
    const intersections = [];
    const isScaffold = (x, y) => map.get(x, y) === "#";
    map.forEach((_, x, y) => {
        if (
            isScaffold(x, y) &&
            isScaffold(x - 1, y) &&
            isScaffold(x + 1, y) &&
            isScaffold(x, y - 1) &&
            isScaffold(x, y + 1)
        ) {
            intersections.push([x, y]);
        }
    });
    return intersections;
}

export function alignmentParameter([x, y]: [number, number]): number {
    return x * y;
}

export function sumOfAlignmentParameters(gridAsString: string): number {
    const map = convertToMap2D(gridAsString);
    const intersections = getIntersectionPoints(map);
    const alignmentParameters = intersections.map(alignmentParameter);
    return alignmentParameters.reduce((a, b) => a + b);
}

export function solution1() {
    const comp = new IntcodeComputer(getProgram());
    comp.runUntilEnd();
    const output = comp.lastOutputs.reverse();
    const gridAsString = String.fromCharCode(...output);
    return sumOfAlignmentParameters(gridAsString)
}

function printLinewiseOutput(comp: IntcodeComputer) {
    while (!comp.hasHalted()) {
        comp.step();
        if (comp.lastOutputs[0] === "\n".charCodeAt(0)) {
            console.log(String.fromCharCode(...comp.lastOutputs.reverse()).trim());
            comp.lastOutputs = [];
        }
    }
}

export function stringToAsciiArray(string: string) {
    const asciiKeys = [];
    for (let i = 0; i < string.length; i++) {
        asciiKeys.push(string.charCodeAt(i));
    }
    return asciiKeys;
}

export function solution2() {
    // handcrafted
    const main = "A,B,A,C,B,C,B,C,A,C"
    const A = "R,12,L,10,R,12"
    const B = "L,8,R,10,R,6"
    const C = "R,12,L,10,R,10,L,8"
    const input = `${main}\n${A}\n${B}\n${C}\nn\n`

    const program = getProgram();
    program[0] = 2;
    const comp = new IntcodeComputer(program, stringToAsciiArray(input));
    comp.runUntilEnd();

    return comp.lastOutputs[0];
}