import { convertToMap2D, getIntersectionPoints, alignmentParameter, sumOfAlignmentParameters } from './17';

const lines = `\
..#..........
..#..........
#######...###
#.#...#...#.#
#############
..#...#...#..
..#####...^..`.split("\n");

test("convertToMap2D", () => {
    const map = convertToMap2D(lines);
    expect(map.minX).toBe(0);
    expect(map.maxX).toBe(12);
    expect(map.minY).toBe(0);
    expect(map.maxY).toBe(6);
});

test("find intersections", () => {
    const intersections = getIntersectionPoints(convertToMap2D(lines));
    expect(intersections).toEqual([
        [2, 2],
        [2, 4],
        [6, 4],
        [10, 4],
    ]);
});

test("alignment parameters", () => {
    expect(alignmentParameter([2, 2])).toBe(4);
    expect(alignmentParameter([2, 4])).toBe(8);
    expect(alignmentParameter([6, 4])).toBe(24);
    expect(alignmentParameter([10, 4])).toBe(40);
});

test("sum of alignment parameters", () => {
    expect(sumOfAlignmentParameters(lines)).toBe(76);
});