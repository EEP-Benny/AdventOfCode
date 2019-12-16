// Intcode computer, needed on multiple days

export enum Mode {
    Position = 0,
    Immediate = 1,
    Relative = 2,
}
export function getMode(i: number, opcodeValue: number): Mode {
    return Math.floor((opcodeValue / Math.pow(10, i + 1)) % 10);
}

export enum OpCode {
    Addition = 1,
    Multiplication = 2,
    Input = 3,
    Output = 4,
    JumpIfTrue = 5,
    JumpIfFalse = 6,
    LessThan = 7,
    Equals = 8,
    RelativeBaseOffset = 9,
    Halt = 99,
}
export class IntcodeComputer {
    private instructionPointer = 0;
    private relativeBase = 0;
    private memory: number[];
    private lastOpcode: OpCode;

    public nextInputs: number[] = [];
    public lastOutputs: number[] = [];
    public stepCount = 0;
    public inputFn = () => this.nextInputs.shift();
    constructor(program: number[], inputs: number[] = []) {
        this.memory = [...program]; //make a copy to be sure
        this.nextInputs = inputs;
    }

    private readMemory(index: number) {
        return this.memory[index] || 0; // "converts" every undefined to 0
    }
    private writeMemory(index: number, data: number) {
        this.memory[index] = data;
    }

    public step() {
        const opcodeValue = this.readMemory(this.instructionPointer);
        const opcode: OpCode = opcodeValue % 100;
        this.lastOpcode = opcode;
        const param = (i: number) => this.readMemory(this.instructionPointer + i);
        const address = (i: number) => {
            switch (getMode(i, opcodeValue)) {
                case Mode.Position:
                    return param(i);
                case Mode.Relative:
                    return this.relativeBase + param(i);
                default:
                    return null;
            }
        }
        const value = (i: number) => address(i) !== null ? this.readMemory(address(i)) : param(i);

        switch (opcode) {
            case OpCode.Addition:
                this.writeMemory(address(3), value(1) + value(2));
                this.instructionPointer += 4;
                break;
            case OpCode.Multiplication:
                this.writeMemory(address(3), value(1) * value(2));
                this.instructionPointer += 4;
                break;
            case OpCode.Input:
                this.writeMemory(address(1), this.inputFn());
                this.instructionPointer += 2;
                break;
            case OpCode.Output:
                this.lastOutputs.unshift(value(1));
                this.instructionPointer += 2;
                break;
            case OpCode.JumpIfTrue:
                if (value(1) !== 0) {
                    this.instructionPointer = value(2);
                } else {
                    this.instructionPointer += 3;
                }
                break;
            case OpCode.JumpIfFalse:
                if (value(1) === 0) {
                    this.instructionPointer = value(2);
                } else {
                    this.instructionPointer += 3;
                }
                break;
            case OpCode.LessThan:
                this.writeMemory(address(3), (value(1) < value(2)) ? 1 : 0);
                this.instructionPointer += 4;
                break;
            case OpCode.Equals:
                this.writeMemory(address(3), (value(1) === value(2)) ? 1 : 0);
                this.instructionPointer += 4;
                break;
            case OpCode.RelativeBaseOffset:
                this.relativeBase += value(1);
                this.instructionPointer += 2;
                break;
            case OpCode.Halt:
                this.instructionPointer += 1;
                break;
            default:
                throw `unknown opcode ${opcode} at position ${this.instructionPointer}`;
        }
        this.stepCount++;
    }

    public hasHalted(): boolean {
        return this.lastOpcode === OpCode.Halt;
    }

    public runUntilNextOutput(): number | null {
        do {
            if (this.hasHalted()) {
                return null;
            }
            this.step();
        } while (this.lastOpcode !== OpCode.Output)
        return this.lastOutputs[0];
    }

    public runUntilEnd() {
        while (!this.hasHalted()) {
            this.step();
        }
    }

    public getMemory() {
        // for testing only
        return this.memory;
    }
}
