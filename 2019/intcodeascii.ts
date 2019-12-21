import { IntcodeComputer } from './intcode';

export class AsciiIntcodeComputer extends IntcodeComputer {
    constructor(program: number[], inputLines: string[] = []) {
        super(program);
        this.nextInputLines = inputLines;
    }

    public set nextInputLines(lineArray: string[]) {
        const joinedString = lineArray.map(s => s + '\n').join("");
        this.nextInputs = [];
        for (let i = 0; i < joinedString.length; i++) {
            this.nextInputs.push(joinedString.charCodeAt(i));
        }
    }

    public get lastOutputLines(): string[] {
        const asciiCharacters = [...this.lastOutputs].reverse();
        return String.fromCharCode(...asciiCharacters).trim().split('\n');
    }

    public runUntilNextLine(): string {
        while (!this.hasHalted() && this.runUntilNextOutput() !== "\n".charCodeAt(0)) { }
        return this.lastOutputLines[0];
    }
}