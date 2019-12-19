import { getInput } from '../utils';

export function patternAt(pattern: number[], position: number): number {
    return pattern[position % pattern.length];
}

const patternStore = [];
export function constructPattern(position: number): number[] {
    if (patternStore[position]) { return patternStore[position]; }
    const arr: number[] = [];
    for (let i = 0; i < position; i++) { arr.push(0); }
    for (let i = 0; i < position; i++) { arr.push(1); }
    for (let i = 0; i < position; i++) { arr.push(0); }
    for (let i = 0; i < position; i++) { arr.push(-1); }
    patternStore[position] = arr;
    return arr;

}

export function FFTsingleNumber(list: number[], pattern: number[]): number {
    let sum = 0;
    list.forEach((value, index) => {
        if (value != 0) {
            sum += value * patternAt(pattern, index + 1);
        }
    });
    return Math.abs(sum % 10);
}

export function FFTsinglePhase(input: number[]): number[] {
    return input.map((_, index) => {
        input.length > 1000 && console.log(index);
        return FFTsingleNumber(input, constructPattern(index + 1));
    });
}

export function FFTmultiPhase(input: number[], phaseCount: number): number[] {
    for (let i = 0; i < phaseCount; i++) {
        input = FFTsinglePhase(input);
    }
    return input;
}

export function stringToResult(inputStr: string, phaseCount = 100): string {
    const input = inputStr.trim().split("").map(x => parseInt(x, 10));
    const FFTResult = FFTmultiPhase(input, phaseCount);
    return FFTResult.slice(0, 8).join("");
}
export function stringToLongResult(inputStr: string, repeats = 10000, phaseCount = 100): string {
    const input = inputStr.trim().repeat(repeats).split("").map(x => parseInt(x, 10));
    const FFTResult = FFTmultiPhase(input, phaseCount);
    const offset = parseInt(inputStr.substring(0, 7), 10);
    return FFTResult.slice(offset, offset + 8).join("");
}

export function solution1() {
    return stringToResult(getInput(16));
}

export function solution2() {
    return "Takes way too long to compute";
    return stringToLongResult(getInput(16));
}
