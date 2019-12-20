import { getInput } from '../utils';

export function patternAt(pattern: number[], position: number): number {
    return pattern[position % pattern.length];
}

export function constructPattern(position: number): number[] {
    const arr: number[] = [];
    for (let i = 0; i < position; i++) { arr.push(0); }
    for (let i = 0; i < position; i++) { arr.push(1); }
    for (let i = 0; i < position; i++) { arr.push(0); }
    for (let i = 0; i < position; i++) { arr.push(-1); }
    return arr;
}

export function FFTsingleNumber(list: number[], pattern: number[]): number {
    let sum = 0;
    list.forEach((value, index) => {
        sum += value * patternAt(pattern, index + 1);
    });
    return Math.abs(sum % 10);
}

export function FFTsinglePhase(input: number[]): number[] {
    return input.map((_, index) => {
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
    // full FFT takes way to long, but if we are only interested in the values from the back, we can simplify it:
    // the FFT matrix for the second half contains only ones in the upper right triangle, and zeros in the lower left triangle
    // this means: just incrementally sum up the values
    // we just need to compute values after the desired output (values before that don't affect the result)
    const offset = parseInt(inputStr.substring(0, 7), 10);
    const input = inputStr.trim().repeat(repeats).substr(offset).split("").map(x => parseInt(x, 10));
    for (let phase = 0; phase < phaseCount; phase++) {
        for (let index = input.length - 2; index >= 0; index--) {
            input[index] = Math.abs((input[index] + input[index + 1]) % 10);
        }
    }
    return input.slice(0, 8).join("");
}

export function solution1() {
    return stringToResult(getInput(16));
}

export function solution2() {
    return stringToLongResult(getInput(16));
}
