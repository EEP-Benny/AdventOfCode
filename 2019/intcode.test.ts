import { isImmediateMode, IntcodeComputer, } from './intcode';

test('determining immediate mode', () => {
    expect(isImmediateMode(1, 99)).toBe(false);
    expect(isImmediateMode(1, 100)).toBe(true);
    expect(isImmediateMode(2, 100)).toBe(false);
    expect(isImmediateMode(2, 1000)).toBe(true);
    expect(isImmediateMode(3, 1000)).toBe(false);
    expect(isImmediateMode(3, 10000)).toBe(true);
    expect(isImmediateMode(3, 11111)).toBe(true);
})

test('program run', () => {
    const comp1 = new IntcodeComputer([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]);
    comp1.runUntilEnd();
    expect(comp1.getMemory()).toEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);

    const comp2 = new IntcodeComputer([1, 0, 0, 0, 99]);
    comp2.runUntilEnd();
    expect(comp2.getMemory()).toEqual([2, 0, 0, 0, 99]);

    const comp3 = new IntcodeComputer([2, 3, 0, 3, 99]);
    comp3.runUntilEnd();
    expect(comp3.getMemory()).toEqual([2, 3, 0, 6, 99]);

    const comp4 = new IntcodeComputer([2, 4, 4, 5, 99, 0]);
    comp4.runUntilEnd();
    expect(comp4.getMemory()).toEqual([2, 4, 4, 5, 99, 9801]);

    const comp5 = new IntcodeComputer([1, 1, 1, 4, 99, 5, 6, 0, 99]);
    comp5.runUntilEnd();
    expect(comp5.getMemory()).toEqual([30, 1, 1, 4, 2, 5, 6, 0, 99]);
})

test('jump test', () => {
    const outputFromInput = (program: number[], input: number) => {
        const computer = new IntcodeComputer(program, [input]);
        computer.runUntilEnd();
        return computer.lastOutputs[0];
    }
    const programEqual8PosMode = [3, 9, 8, 9, 10, 9, 4, 9, 99, -1, 8];
    expect(outputFromInput(programEqual8PosMode, 7)).toBe(0);
    expect(outputFromInput(programEqual8PosMode, 8)).toBe(1);
    expect(outputFromInput(programEqual8PosMode, 9)).toBe(0);

    const programLessThan8PosMode = [3, 9, 7, 9, 10, 9, 4, 9, 99, -1, 8];
    expect(outputFromInput(programLessThan8PosMode, 6)).toBe(1);
    expect(outputFromInput(programLessThan8PosMode, 7)).toBe(1);
    expect(outputFromInput(programLessThan8PosMode, 8)).toBe(0);
    expect(outputFromInput(programLessThan8PosMode, 9)).toBe(0);

    const programEqual8ImmMode = [3, 3, 1108, -1, 8, 3, 4, 3, 99];
    expect(outputFromInput(programEqual8ImmMode, 8)).toBe(1);
    expect(outputFromInput(programEqual8ImmMode, 7)).toBe(0);
    expect(outputFromInput(programEqual8ImmMode, 9)).toBe(0);

    const programLessThan8ImmMode = [3, 3, 1107, -1, 8, 3, 4, 3, 99];
    expect(outputFromInput(programLessThan8ImmMode, 6)).toBe(1);
    expect(outputFromInput(programLessThan8ImmMode, 7)).toBe(1);
    expect(outputFromInput(programLessThan8ImmMode, 8)).toBe(0);
    expect(outputFromInput(programLessThan8ImmMode, 9)).toBe(0);

    const programNonZeroPosMode = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
    expect(outputFromInput(programNonZeroPosMode, -1)).toBe(1);
    expect(outputFromInput(programNonZeroPosMode, 0)).toBe(0);
    expect(outputFromInput(programNonZeroPosMode, 1)).toBe(1);

    const programNonZeroImmMode = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];
    expect(outputFromInput(programNonZeroImmMode, -1)).toBe(1);
    expect(outputFromInput(programNonZeroImmMode, 0)).toBe(0);
    expect(outputFromInput(programNonZeroImmMode, 1)).toBe(1);

    const programLarge = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31, 1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104, 999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
    expect(outputFromInput(programLarge, 6)).toBe(999);
    expect(outputFromInput(programLarge, 7)).toBe(999);
    expect(outputFromInput(programLarge, 8)).toBe(1000);
    expect(outputFromInput(programLarge, 9)).toBe(1001);
    expect(outputFromInput(programLarge, 10)).toBe(1001);
})
