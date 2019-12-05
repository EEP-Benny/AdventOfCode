import { singleStep, run } from './02'

test('single steps', () => {
    expect(singleStep([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]))
        .toEqual([1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    expect(singleStep([1, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50], 4))
        .toEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);
    expect(() => singleStep([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50], 8))
        .toThrow("halt");
})

test('program run', () => {
    expect(run([1, 9, 10, 3, 2, 3, 11, 0, 99, 30, 40, 50]))
        .toEqual([3500, 9, 10, 70, 2, 3, 11, 0, 99, 30, 40, 50]);

    expect(run([1, 0, 0, 0, 99])).toEqual([2, 0, 0, 0, 99]);
    expect(run([2, 3, 0, 3, 99])).toEqual([2, 3, 0, 6, 99]);
    expect(run([2, 4, 4, 5, 99, 0])).toEqual([2, 4, 4, 5, 99, 9801]);
    expect(run([1, 1, 1, 4, 99, 5, 6, 0, 99])).toEqual([30, 1, 1, 4, 2, 5, 6, 0, 99]);
})