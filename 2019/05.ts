import { getProgram } from '../utils';

export function isImmediateMode(i: number, opcodeValue: number) {
    return Math.floor((opcodeValue / Math.pow(10, i + 1)) % 10) == 1;
}
export function run(memory: number[], inputFn = () => 1, outputFn = console.log) {
    let instructionPointer = 0;
    while (true) {
        const opcodeValue = memory[instructionPointer];
        const opcode = opcodeValue % 100;
        const param = (i: number) => memory[instructionPointer + i];
        const value = (i: number) => isImmediateMode(i, opcodeValue) ? param(i) : memory[param(i)];
        switch (opcode) {
            case 1: // addition
                memory[param(3)] = value(1) + value(2);
                instructionPointer += 4;
                break;
            case 2: // multiplication
                memory[param(3)] = value(1) * value(2);
                instructionPointer += 4;
                break;
            case 3: // input
                memory[param(1)] = inputFn();
                instructionPointer += 2;
                break;
            case 4: // output
                outputFn(value(1));
                instructionPointer += 2;
                break;
            case 5: // jump-if-true
                if (value(1) !== 0) {
                    instructionPointer = value(2);
                } else {
                    instructionPointer += 3;
                }
                break;
            case 6: // jump-if-false
                if (value(1) === 0) {
                    instructionPointer = value(2);
                } else {
                    instructionPointer += 3;
                }
                break;
            case 7: // less than
                memory[param(3)] = (value(1) < value(2)) ? 1 : 0;
                instructionPointer += 4;
                break;
            case 8: // equals
                memory[param(3)] = (value(1) === value(2)) ? 1 : 0;
                instructionPointer += 4;
                break;
            case 99: // termination
                instructionPointer += 1;
                return memory;
            default:
                throw `unknown opcode ${opcode} at position ${instructionPointer}`;
        }
    }
}

export function outputFromInput(program: number[], input: number) {
    try {
        let lastOutput: number;
        const inputFn = () => input;
        const outputFn = (x: number) => { lastOutput = x; };
        run(program, inputFn, outputFn);
        return lastOutput;
    } catch (error) {
        console.error(error);
    }
}

export function solution1() {
    return outputFromInput(getProgram({ day: 5 }), 1);
}

export function solution2() {
    return outputFromInput(getProgram({ day: 5 }), 5);
}