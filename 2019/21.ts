import { AsciiIntcodeComputer } from './intcodeascii';
import { getProgram } from '../utils';

export function solution1() {
    // jump = (!A || !B || !C) && D
    const instructions = [
        "NOT A J",
        "NOT B T",
        "OR T J",
        "NOT C T",
        "OR T J",
        "AND D J",
        "WALK"
    ];
    const comp = new AsciiIntcodeComputer(getProgram({ day: 21 }), instructions);
    comp.runUntilEnd();
    return comp.lastOutputs[0];
}

export function solution2() {
    // jump = (!A || !B || !C) && D && (H || (E && (I || F)))
    const instructions = [
        "NOT A J",
        "NOT B T",
        "OR T J",
        "NOT C T",
        "OR T J",
        "AND D J",
        "NOT I T",
        "NOT T T",
        "OR F T",
        "AND E T",
        "OR H T",
        "AND T J",
        "RUN"
    ];
    const comp = new AsciiIntcodeComputer(getProgram({ day: 21 }), instructions);
    comp.runUntilEnd();

    return comp.lastOutputs[0];
}