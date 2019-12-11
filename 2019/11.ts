import { getInputArray } from '../utils';
import { IntcodeComputer } from './intcode';

function getProgram() {
    return getInputArray({ day: 11, separator: ',' }).map(s => parseInt(s, 10));
}

enum Color { Black = 0, White = 1, }
enum Direction { Up, Right, Down, Left }
const position = (x: number, y: number) => `${x},${y}`;
const posXY = (pos: string) => { const [x, y] = pos.split(','); return { x: parseInt(x), y: parseInt(y) }; }
function turnDirection(currentDirection: Direction, shouldturnLeft: boolean) {
    switch (currentDirection) {
        case Direction.Up:
            return shouldturnLeft ? Direction.Left : Direction.Right;
        case Direction.Right:
            return shouldturnLeft ? Direction.Up : Direction.Down;
        case Direction.Down:
            return shouldturnLeft ? Direction.Right : Direction.Left;
        case Direction.Left:
            return shouldturnLeft ? Direction.Down : Direction.Up;
    }
}
function stepForward(pos: string, dir: Direction) {
    const { x, y } = posXY(pos);
    switch (dir) {
        case Direction.Up:
            return position(x, y + 1);
        case Direction.Right:
            return position(x + 1, y);
        case Direction.Down:
            return position(x, y - 1);
        case Direction.Left:
            return position(x - 1, y);
    }
}
class EmergencyHullPaintingRobot {
    private comp: IntcodeComputer;
    private panelColors = new Map<string, Color>();
    public paintedPanels = new Set<string>();
    private currentPos = position(0, 0);
    private currentDirection = Direction.Up;
    constructor(program: number[], colorOfStartingPanel: Color) {
        this.comp = new IntcodeComputer(program);
        this.panelColors.set(this.currentPos, colorOfStartingPanel);
    }

    private getNextOutputs(currentColor: Color): [Color, boolean] {
        this.comp.nextInputs = [currentColor];
        const newColor = this.comp.runUntilNextOutput();
        if (newColor === null) {
            throw "finished";

        }
        const shouldturnLeft = this.comp.runUntilNextOutput() == 0
        return [newColor, shouldturnLeft];
    }
    private step() {
        const [newColor, shouldturnLeft] = this.getNextOutputs(this.panelColors.get(this.currentPos));
        this.panelColors.set(this.currentPos, newColor);
        this.paintedPanels.add(this.currentPos);
        this.currentDirection = turnDirection(this.currentDirection, shouldturnLeft);
        this.currentPos = stepForward(this.currentPos, this.currentDirection);
    }
    public runUntilEnd() {
        try {
            while (true) {
                this.step();
            }
        } catch (msg) {
            if (msg !== "finished") throw msg;
        }
    }

    public getPanelGrid() {
        const xCoordinates = [], yCoordinates = [];
        this.paintedPanels.forEach((pos) => {
            const { x, y } = posXY(pos);
            xCoordinates.push(x);
            yCoordinates.push(y);
        })
        const xMin = Math.min(...xCoordinates), xMax = Math.max(...xCoordinates);
        const yMin = Math.min(...yCoordinates), yMax = Math.max(...yCoordinates);
        const grid = [[]] as Color[][];
        for (let y = 0; y <= yMax - yMin; y++) {
            grid[y] = [];
            for (let x = 0; x <= xMax - xMin; x++) {
                grid[y][x] = this.panelColors.get(position(x + xMin, yMax - y)) || Color.Black;
            }
        }
        return grid;
    }
}

export function solution1() {
    const robot = new EmergencyHullPaintingRobot(getProgram(), Color.Black);
    robot.runUntilEnd();
    return robot.paintedPanels.size;
}

export function solution2() {
    const robot = new EmergencyHullPaintingRobot(getProgram(), Color.White);
    robot.runUntilEnd();
    const grid = robot.getPanelGrid();
    const mappedGrid = grid.map((row: Color[]) => row.map(c => c == Color.White ? "█" : " "));
    return "\n" + mappedGrid.map(row => row.join("")).join("\n");
}