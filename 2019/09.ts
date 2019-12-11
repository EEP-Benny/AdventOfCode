import { getInputArray } from '../utils';
import { IntcodeComputer } from './intcode';

function getProgram() {
    return getInputArray({ day: 9, separator: ',' }).map(s => parseInt(s, 10));
}
export function solution1() {
    const comp = new IntcodeComputer(getProgram(), [1]);
    comp.runUntilEnd();
    return comp.lastOutputs[0];
}

export function solution2() {
    return new IntcodeComputer(getProgram(), [2]).runUntilNextOutput();
}