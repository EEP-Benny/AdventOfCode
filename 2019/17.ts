import { Map2D } from './map2d';
import { getProgram } from '../utils';
import { AsciiIntcodeComputer } from './intcodeascii';

export function convertToMap2D(lines: string[]): Map2D<string> {
    const map = new Map2D<string>();
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

export function sumOfAlignmentParameters(lines: string[]): number {
    const map = convertToMap2D(lines);
    const intersections = getIntersectionPoints(map);
    const alignmentParameters = intersections.map(alignmentParameter);
    return alignmentParameters.reduce((a, b) => a + b);
}

export function solution1() {
    const comp = new AsciiIntcodeComputer(getProgram({ day: 17 }));
    comp.runUntilEnd();
    return sumOfAlignmentParameters(comp.lastOutputLines);
}

export function solution2() {
    // handcrafted
    const main = "A,B,A,C,B,C,B,C,A,C";
    const A = "R,12,L,10,R,12";
    const B = "L,8,R,10,R,6";
    const C = "R,12,L,10,R,10,L,8";

    const program = getProgram({ day: 17 });
    program[0] = 2;
    const comp = new AsciiIntcodeComputer(program, [main, A, B, C, "n"]);
    comp.runUntilEnd();

    return comp.lastOutputs[0];
}