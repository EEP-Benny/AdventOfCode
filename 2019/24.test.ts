import { stringToMap, step, mapToString, firstRepeatingLayout, biodiversityRating } from './24';

const start = `\
....#
#..#.
#..##
..#..
#....`;
const min1 = `\
#..#.
####.
###.#
##.##
.##..`;
const min2 = `\
#####
....#
....#
...#.
#.###`;
const min3 = `\
#....
####.
...##
#.##.
.##.#`;
const min4 = `\
####.
....#
##..#
.....
##...`;
const repeated = `\
.....
.....
.....
#....
.#...`;

test("timestep", () => {
    const mapStart = stringToMap(start);
    const mapMin1 = step(mapStart);
    expect(mapToString(mapMin1)).toBe(min1);
    const mapMin2 = step(mapMin1);
    expect(mapToString(mapMin2)).toBe(min2);
    const mapMin3 = step(mapMin2);
    expect(mapToString(mapMin3)).toBe(min3);
    const mapMin4 = step(mapMin3);
    expect(mapToString(mapMin4)).toBe(min4);
});

test("first repeating layout", () => {
    expect(firstRepeatingLayout(start)).toBe(repeated);
});
test("biodiversity rating", () => {
    expect(biodiversityRating(firstRepeatingLayout(start))).toBe(2129920);
});