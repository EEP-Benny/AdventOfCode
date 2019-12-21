import { getProgram } from '../utils';
import { IntcodeComputer } from './intcode';

const prog = getProgram({ day: 19 });
function isPulled(x: number, y: number) {
    const comp = new IntcodeComputer(prog, [x, y]);
    return comp.runUntilNextOutput() === 1;
}
export function solution1() {
    let affectedPoints = 0;
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            if (isPulled(x, y)) {
                affectedPoints++;
            }
        }
    }
    return affectedPoints;
}

export function solution2() {
    const sizeOfSanta = 100;
    let x = 0;
    let y = 0;
    while (x + y < 10000) {
        while (!isPulled(x, y + sizeOfSanta - 1)) { x++; }
        if (isPulled(x + sizeOfSanta - 1, y)) {
            return x * 10000 + y;
        }
        y++;
    }
}