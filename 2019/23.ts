import { getProgram } from '../utils';
import { IntcodeComputer } from './intcode';

class IntcodeComputerNetwork {
    private comps: IntcodeComputer[] = [];
    private isIdle: boolean[] = [];
    public lastNATpackage: { X: number, Y: number; } = { X: 1, Y: 2 };
    constructor(compNum: number, program: number[]) {
        for (let i = 0; i < compNum; i++) {
            const comp = new IntcodeComputer(program, [i]);
            comp.inputFn = () => {
                const nextInput = comp.nextInputs.shift();
                if (nextInput === undefined) {
                    this.isIdle[i] = true;
                    return -1;
                }
                return nextInput;
            };
            this.comps[i] = comp;
            this.isIdle[i] = false;
        }
    }

    private sendPackage(source: number, target: number, X: number, Y: number) {
        if (target < this.comps.length) {
            this.isIdle[target] = false;
            this.comps[target].nextInputs.push(X, Y);
        } else {
            this.lastNATpackage = { X, Y };
        }
        return { source, target, X, Y };
    }
    public runUntilNextPackage() {
        while (true) {
            let allIdle = true;
            for (let i = 0; i < this.comps.length; i++) {
                const comp = this.comps[i];
                comp.step();
                allIdle = allIdle && this.isIdle[i];
                if (comp.lastOutputs.length >= 3) {
                    const address = comp.lastOutputs.pop();
                    const X = comp.lastOutputs.pop();
                    const Y = comp.lastOutputs.pop();
                    allIdle = false;
                    return this.sendPackage(i, address, X, Y);
                }
            }
            if (allIdle) {
                const { X, Y } = this.lastNATpackage;
                return this.sendPackage(255, 0, X, Y);
            }
        }
    }
}

export function solution1() {
    const prog = getProgram({ day: 23 });
    const network = new IntcodeComputerNetwork(50, prog);
    while (true) {
        const { target, Y } = network.runUntilNextPackage();
        if (target === 255) {
            return Y;
        }
    }
}

export function solution2() {
    const prog = getProgram({ day: 23 });
    const network = new IntcodeComputerNetwork(50, prog);
    let lastY: number;
    while (true) {
        const { source, Y } = network.runUntilNextPackage();
        if (source === 255) {
            if (lastY === Y) {
                return Y;
            } else {
                lastY = Y;
            }
        }
    }
}