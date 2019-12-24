import { Map2D } from './map2d';
import { getInput } from '../utils';
export enum Tile {
    Empty = 0,
    Bug = 1,
}

export function stringToMap(str: string): Map2D<Tile> {
    const map = new Map2D<Tile>();
    const lines = str.trim().split("\n");
    lines.forEach((line, y) => {
        const chars = line.split("");
        chars.forEach((char, x) => {
            map.set(x, y, char === "#" ? Tile.Bug : Tile.Empty);
        });
    });
    return map;
}

export function mapToString(map: Map2D<Tile>): string {
    return map.getPrintableMap(new Map([[Tile.Empty, "."], [Tile.Bug, "#"]])).trim();
}

export function step(map: Map2D<Tile>): Map2D<Tile> {
    const newMap = new Map2D<Tile>();
    map.forEach((value, x, y) => {
        let bugsAround = 0;
        bugsAround += map.get(x - 1, y) || 0;
        bugsAround += map.get(x + 1, y) || 0;
        bugsAround += map.get(x, y - 1) || 0;
        bugsAround += map.get(x, y + 1) || 0;
        if (value === Tile.Bug && bugsAround !== 1) {
            newMap.set(x, y, Tile.Empty);
        } else if (value === Tile.Empty && bugsAround >= 1 && bugsAround <= 2) {
            newMap.set(x, y, Tile.Bug);
        } else {
            newMap.set(x, y, value);
        }
    });
    return newMap;
}

export function firstRepeatingLayout(str: string) {
    let map = stringToMap(str);
    const alreadySeenLayouts = new Set<string>();
    while (true) {
        const str = mapToString(map);
        if (alreadySeenLayouts.has(str)) {
            return str;
        } else {
            alreadySeenLayouts.add(str);
        }
        map = step(map);
    }
}

export function biodiversityRating(str: string): number {
    let rating = 0;
    for (let i = str.length - 1; i >= 0; i--) {
        const char = str.charAt(i);
        if (char === "#") {
            rating = (rating << 1) + 1;
        } else if (char === ".") {
            rating = rating << 1;
        }
    }
    return rating;
}

export function solution1() {
    const str = getInput(24);
    return biodiversityRating(firstRepeatingLayout(str));
}