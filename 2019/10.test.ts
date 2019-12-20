import { getAsteroids, numVisibleFrom, findBestSpot, vaporizeInOrder } from './10';

const map1 = `\
.#..#
.....
#####
....#
...##`;

const map2 = `\
......#.#.
#..#.#....
..#######.
.#.#.###..
.#..#.....
..#....#.#
#..#....#.
.##.#..###
##...#..#.
.#....####`;

const map3 = `\
#.#...#.#.
.###....#.
.#....#...
##.#.#.#.#
....#.#.#.
.##..###.#
..#...##..
..##....##
......#...
.####.###.`;

const map4 = `\
.#..#..###
####.###.#
....###.#.
..###.##.#
##.##.#.#.
....###..#
..#.#..#.#
#..#.#.###
.##...##.#
.....#.#..`;

const map5 = `\
.#..##.###...#######
##.############..##.
.#.######.########.#
.###.#######.####.#.
#####.##.#.##.###.##
..#####..#.#########
####################
#.####....###.#.#.##
##.#################
#####.##.###..####..
..######..##.#######
####.##.####...##..#
.#####..#.######.###
##...#.##########...
#.##########.#######
.####.#.###.###.#.##
....##.##.###..#####
.#.#.###########.###
#.#.#.#####.####.###
###.##.####.##.#..##`;

const map6 = `\
.#....#####...#..
##...##.#####..##
##...#...#.#####.
..#.....X...###..
..#.#.....#....##`;

test("numVisibleFrom", () => {
    const asteroids = getAsteroids(map1);
    expect(numVisibleFrom({ x: 1, y: 0 }, asteroids)).toBe(7);
    expect(numVisibleFrom({ x: 4, y: 0 }, asteroids)).toBe(7);
    expect(numVisibleFrom({ x: 0, y: 2 }, asteroids)).toBe(6);
    expect(numVisibleFrom({ x: 4, y: 2 }, asteroids)).toBe(5);
});

test("findBestSpot", () => {
    expect(findBestSpot(getAsteroids(map1))).toEqual([{ x: 3, y: 4 }, 8]);
    expect(findBestSpot(getAsteroids(map2))).toEqual([{ x: 5, y: 8 }, 33]);
    expect(findBestSpot(getAsteroids(map3))).toEqual([{ x: 1, y: 2 }, 35]);
    expect(findBestSpot(getAsteroids(map4))).toEqual([{ x: 6, y: 3 }, 41]);
    expect(findBestSpot(getAsteroids(map5))).toEqual([{ x: 11, y: 13 }, 210]);
});

test("vaporizeInOrder", () => {
    const asteroids6 = getAsteroids(map6);
    const orderedAsteroids6 = vaporizeInOrder(asteroids6, { x: 8, y: 3 });
    expect(orderedAsteroids6[0]).toEqual({ x: 8, y: 1 });
    expect(orderedAsteroids6[34]).toEqual({ x: 13, y: 3 });
    expect(orderedAsteroids6[35]).toEqual({ x: 14, y: 3 });

    const asteroids5 = getAsteroids(map5);
    const orderedAsteroids5 = vaporizeInOrder(asteroids5, { x: 11, y: 13 });
    expect(orderedAsteroids5[0]).toEqual({ x: 11, y: 12 });
    expect(orderedAsteroids5[1]).toEqual({ x: 12, y: 1 });
    expect(orderedAsteroids5[49]).toEqual({ x: 16, y: 9 });
    expect(orderedAsteroids5[199]).toEqual({ x: 8, y: 2 });
    expect(orderedAsteroids5[299]).toEqual({ x: 11, y: 1 });
});