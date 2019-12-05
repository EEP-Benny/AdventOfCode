import { getInputArray } from '../utils';

export function singleStep(memory, instructionPointer = 0) {
    const opcode = memory[instructionPointer];
    const param1 = memory[instructionPointer + 1];
    const param2 = memory[instructionPointer + 2];
    const target = memory[instructionPointer + 3];
    switch (opcode) {
        case 1: // addition
            memory[target] = memory[param1] + memory[param2];
            break;
        case 2: // multiplication
            memory[target] = memory[param1] * memory[param2];
            break;
        case 99: // termination
            throw "halt";
        default:
            throw `unknown opcode: ${opcode}`;
    }
    return memory;
}

export function run(memory) {
    try {
        for (let ip = 0; ip < memory.length; ip += 4) {
            memory = singleStep(memory, ip);
        }
    } catch (error) {
        if (error !== 'halt') {
            throw error;
        }
    }
    return memory;
}

function outputWith(noun, verb) {
    const program = getInputArray({ day: 2, separator: ',' }).map(s => parseInt(s, 10));
    program[1] = noun;
    program[2] = verb;
    const result = run(program);
    return result[0];
}

export function solution1() {
    return outputWith(12, 2)
}

export function solution2() {
    for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            if (outputWith(noun, verb) == 19690720) {
                return 100 * noun + verb;
            }
        }
    }
}