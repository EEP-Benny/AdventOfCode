// Intcode computer, needed on multiple days

export function isImmediateMode(i: number, opcodeValue: number) {
    return Math.floor((opcodeValue / Math.pow(10, i + 1)) % 10) == 1;
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
    Halt = 99,
}
export class IntcodeComputer {
    private instructionPointer = 0;
    private memory: number[];
    private lastOpcode: OpCode;

    public nextInputs: number[] = [];
    public lastOutputs: number[] = [];
    constructor(program: number[], inputs: number[] = []) {
        this.memory = [...program]; //make a copy to be sure
        this.nextInputs = inputs;
    }

    public step() {
        const opcodeValue = this.memory[this.instructionPointer];
        const opcode: OpCode = opcodeValue % 100;
        this.lastOpcode = opcode;
        const param = (i: number) => this.memory[this.instructionPointer + i];
        const value = (i: number) => isImmediateMode(i, opcodeValue) ? param(i) : this.memory[param(i)];

        switch (opcode) {
            case OpCode.Addition:
                this.memory[param(3)] = value(1) + value(2);
                this.instructionPointer += 4;
                break;
            case OpCode.Multiplication:
                this.memory[param(3)] = value(1) * value(2);
                this.instructionPointer += 4;
                break;
            case OpCode.Input:
                this.memory[param(1)] = this.nextInputs.shift();
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
                this.memory[param(3)] = (value(1) < value(2)) ? 1 : 0;
                this.instructionPointer += 4;
                break;
            case OpCode.Equals:
                this.memory[param(3)] = (value(1) === value(2)) ? 1 : 0;
                this.instructionPointer += 4;
                break;
            case OpCode.Halt:
                this.instructionPointer += 1;
                break;
            default:
                throw `unknown opcode ${opcode} at position ${this.instructionPointer}`;
        }
    }

    public runUntilNextOutput(): number | null {
        do {
            if (this.lastOpcode === OpCode.Halt) {
                return null;
            }
            this.step();
        } while (this.lastOpcode !== OpCode.Output)
        return this.lastOutputs[0];
    }

    public runUntilEnd() {
        while (this.lastOpcode !== OpCode.Halt) {
            this.step();
        }
    }

    public getMemory() {
        // for testing only
        return this.memory;
    }
}
