import { getInputArray } from '../utils';
import { IntcodeComputer } from './intcode';

export function getPermutations<T>(inputArr: T[]): T[][] {
    // from https://stackoverflow.com/a/20871714
    let result: T[][] = [];
    const permute = (arr: T[], m: T[] = []) => {
        if (arr.length === 0) {
            result.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next))
            }
        }
    }
    permute(inputArr)
    return result;
}

export function runAmplifierSequence(program: number[], phaseSettings: number[]) {
    const computers = phaseSettings.map(phaseSetting => new IntcodeComputer(program, [phaseSetting]));
    let currentValue = 0;
    while (true) {
        for (let phase = 0; phase < computers.length; phase++) {
            const computer = computers[phase];
            computer.nextInputs.push(currentValue);
            const output = computer.runUntilNextOutput();
            if (output === null) { // computer halted
                return currentValue;
            }
            currentValue = output;
        }
    }
}

function findMaxForPhases(phaseSettings: number[]) {
    const program = getInputArray({ day: 7, separator: ',' }).map(s => parseInt(s, 10));
    const permutations = getPermutations(phaseSettings);
    const maxOutput = Math.max(
        ...permutations.map((permutation) => runAmplifierSequence(program, permutation))
    );
    return maxOutput;
}

export function solution1() {
    return findMaxForPhases([0, 1, 2, 3, 4]);
}

export function solution2() {
    return findMaxForPhases([5, 6, 7, 8, 9]);
}