import { getInput } from '../utils';

interface Position { x: number, y: number; }
export function getAsteroids(input: string): Position[] {
    const asteroids: Position[] = [];
    input.split("\n").forEach((line, y) => {
        line.split("").forEach((char, x) => {
            if (char === "#") {
                asteroids.push({ x, y });
            }
        });
    });
    return asteroids;
};

function angleBetween(pos1: Position, pos2: Position) {
    return Math.atan2(pos2.x - pos1.x, pos2.y - pos1.y);
}
export function numVisibleFrom(pos: Position, all: Position[]): number {
    const angles = new Set();
    all.forEach(({ x, y }) => {
        if (x !== pos.x || y !== pos.y) {
            angles.add(angleBetween(pos, { x, y }));
        }
    });
    return angles.size;
}

export function findBestSpot(asteroids: Position[]): [Position, number] {
    let bestPos: Position;
    let bestCount = 0;
    asteroids.forEach(pos => {
        const count = numVisibleFrom(pos, asteroids);
        if (count > bestCount) {
            bestPos = pos;
            bestCount = count;
        }
    });
    return [bestPos, bestCount];
}

export function vaporizeInOrder(asteroids: Position[], laserPos: Position) {
    const distanceToLaser = (pos: Position) => (Math.abs(pos.x - laserPos.x) + Math.abs(pos.y - laserPos.y));
    const angleToAsteroids = new Map<number, Position[]>();
    asteroids.forEach(asteroidPos => {
        if (asteroidPos !== laserPos) {
            const angle = angleBetween(laserPos, asteroidPos);
            if (angleToAsteroids.has(angle)) {
                angleToAsteroids.get(angle).push(asteroidPos);
            } else {
                angleToAsteroids.set(angle, [asteroidPos]);
            }
        }
    });
    angleToAsteroids.forEach(positions => {
        positions.sort((pos1, pos2) => distanceToLaser(pos2) - distanceToLaser(pos1));
    });
    const sortedAngles = Array.from(angleToAsteroids.keys()).sort((a, b) => b - a);
    const vaporizedAsteroids = [];
    let somethingWasVaporized = true;
    while (somethingWasVaporized) {
        somethingWasVaporized = false;
        for (let i = 0; i < sortedAngles.length; i++) {
            const nextAsteroid = angleToAsteroids.get(sortedAngles[i]).pop();
            if (nextAsteroid) {
                vaporizedAsteroids.push(nextAsteroid);
                somethingWasVaporized = true;
            }
        }
    }
    return vaporizedAsteroids;
}

export function solution1() {
    const map = getInput(10);
    const [, count] = findBestSpot(getAsteroids(map));
    return count;
}

export function solution2() {
    const asteroids = getAsteroids(getInput(10));
    const [laserPos] = findBestSpot(asteroids);
    const orderedAsteroids = vaporizeInOrder(asteroids, laserPos);
    const asteroid200 = orderedAsteroids[199];
    return asteroid200.x * 100 + asteroid200.y;

}