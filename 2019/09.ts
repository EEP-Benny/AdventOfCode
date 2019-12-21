import { getProgram } from '../utils';
import { IntcodeComputer } from './intcode';
export function solution1() {
    const comp = new IntcodeComputer(getProgram({ day: 9 }), [1]);
    comp.runUntilEnd();
    return comp.lastOutputs[0];
}

export function solution2() {
    return new IntcodeComputer(getProgram({ day: 9 }), [2]).runUntilNextOutput();
}