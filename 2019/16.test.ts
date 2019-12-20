import { patternAt, FFTsingleNumber, FFTsinglePhase, constructPattern, FFTmultiPhase, stringToResult, stringToLongResult } from './16';

test("patternAt", () => {
    const pattern1 = [1, 2];
    expect(patternAt(pattern1, 0)).toBe(1);
    expect(patternAt(pattern1, 1)).toBe(2);
    expect(patternAt(pattern1, 2)).toBe(1);
    expect(patternAt(pattern1, 3)).toBe(2);
    expect(patternAt(pattern1, 4)).toBe(1);

    const pattern2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect(patternAt(pattern2, 0)).toBe(0);
    expect(patternAt(pattern2, 10)).toBe(0);
    expect(patternAt(pattern2, 125)).toBe(5);
});

test("constructPattern", () => {
    expect(constructPattern(1)).toEqual([0, 1, 0, -1]);
    expect(constructPattern(3)).toEqual([0, 0, 0, 1, 1, 1, 0, 0, 0, -1, -1, -1]);
});
test("FFTsingleNumber", () => {
    expect(FFTsingleNumber([9, 8, 7, 6, 5], [3, 1, 2, 3, 1, 2])).toBe(2);
});

test("FFTsinglePhase", () => {
    expect(FFTsinglePhase([1, 2, 3, 4, 5, 6, 7, 8])).toEqual([4, 8, 2, 2, 6, 1, 5, 8]);
    expect(FFTsinglePhase([4, 8, 2, 2, 6, 1, 5, 8])).toEqual([3, 4, 0, 4, 0, 4, 3, 8]);
    expect(FFTsinglePhase([3, 4, 0, 4, 0, 4, 3, 8])).toEqual([0, 3, 4, 1, 5, 5, 1, 8]);
    expect(FFTsinglePhase([0, 3, 4, 1, 5, 5, 1, 8])).toEqual([0, 1, 0, 2, 9, 4, 9, 8]);
});

test("FFTmultiPhase", () => {
    expect(FFTmultiPhase([1, 2, 3, 4, 5, 6, 7, 8], 4)).toEqual([0, 1, 0, 2, 9, 4, 9, 8]);
});

test("stringToResult", () => {
    expect(stringToResult("80871224585914546619083218645595")).toBe("24176176");
    expect(stringToResult("19617804207202209144916044189917")).toBe("73745418");
    expect(stringToResult("69317163492948606335995924319873")).toBe("52432133");
});

test("stringToLongResult", () => {
    expect(stringToLongResult("03036732577212944063491565474664")).toBe("84462026");
    expect(stringToLongResult("02935109699940807407585447034323")).toBe("78725270");
    expect(stringToLongResult("03081770884921959731165446850517")).toBe("53553731");

});