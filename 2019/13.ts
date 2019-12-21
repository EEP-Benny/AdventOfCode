import { getProgram } from '../utils';
import { IntcodeComputer } from './intcode';
import { Map2D } from './map2d';

enum Tile {
    Empty = 0,
    Wall = 1,
    Block = 2,
    Paddle = 3,
    Ball = 4,
}
export function solution1() {
    const comp = new IntcodeComputer(getProgram({ day: 13 }));
    const map = new Map2D<Tile>();

    while (!comp.hasHalted()) {
        const x = comp.runUntilNextOutput();
        const y = comp.runUntilNextOutput();
        const tile: Tile = comp.runUntilNextOutput();
        map.set(x, y, tile);
    }
    let blockCount = 0;
    map.forEach(tile => {
        if (tile === Tile.Block) {
            blockCount++;
        }
    });
    return blockCount;
}

const markers = new Map<Tile, string>([
    [Tile.Empty, ' '],
    [Tile.Wall, '█'],
    [Tile.Block, 'X'],
    [Tile.Paddle, '-'],
    [Tile.Ball, 'O'],
]);
function printCurrentState(map: Map2D<Tile>, score: number) {
    if (false) {
        console.clear();
        console.log(map.getPrintableMap(markers));
        console.log(`Score: ${score}`);
    }
}

export function solution2() {
    const program = getProgram({ day: 13 });
    program[0] = 2; // fake insert coin
    const comp = new IntcodeComputer(program);
    const map = new Map2D<Tile>();
    let scoreDisplay: number;
    let paddleX: number;
    let ballX: number;

    comp.inputFn = () => {
        printCurrentState(map, scoreDisplay);
        if (paddleX < ballX) return 1;
        else if (paddleX > ballX) return -1;
        else return 0;
    };

    while (!comp.hasHalted()) {
        const x = comp.runUntilNextOutput();
        const y = comp.runUntilNextOutput();
        const output = comp.runUntilNextOutput();
        if (x == -1 && y == 0) {
            scoreDisplay = output;
        } else {
            map.set(x, y, output);
            if (output === Tile.Ball) { ballX = x; }
            if (output === Tile.Paddle) { paddleX = x; }
        }
    }
    printCurrentState(map, scoreDisplay);
    return scoreDisplay;
}