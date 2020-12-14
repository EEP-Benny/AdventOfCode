import { getInputArray } from "../utils";

export function applyMask(mask: string, value: number): number {
  const valueArray = value.toString(2).split("").reverse();
  const maskArray = mask.split("").reverse();
  for (let i = 0; i < maskArray.length; i++) {
    if (maskArray[i] !== "X") {
      valueArray[i] = maskArray[i];
    }
    if (valueArray[i] === undefined) {
      valueArray[i] = "0";
    }
  }
  return parseInt(valueArray.reverse().join(""), 2);
}

export function applyFloatingMask(mask: string, value: number): number[] {
  const valueArray = value.toString(2).split("").reverse();
  const maskArray = mask.split("").reverse();
  let countOfX = 0;
  for (let i = 0; i < maskArray.length; i++) {
    if (maskArray[i] !== "0") {
      valueArray[i] = maskArray[i];
    }
    if (valueArray[i] === undefined) {
      valueArray[i] = "0";
    }
    if (valueArray[i] === "X") {
      countOfX++;
    }
  }
  const results = Array.from({ length: Math.pow(2, countOfX) }).map(
    (_, floatingValue) => {
      const floatingBits = floatingValue.toString(2).split("");
      const floatingValueArray = valueArray.map((value) =>
        value !== "X" ? value : floatingBits.pop() ?? "0"
      );

      return parseInt(floatingValueArray.reverse().join(""), 2);
    }
  );
  return results;
}

export class InitComputer {
  isFloatingMode = false;
  currentMask = "";
  memory = new Map<number, number>();

  executeStep(step: string) {
    const [operation, value] = step.split(" = ");
    if (operation === "mask") {
      this.currentMask = value;
    } else {
      const match = operation.match(/^mem\[(\d+)\]$/);
      if (this.isFloatingMode) {
        const memValue = +value;
        for (const memAdress of applyFloatingMask(
          this.currentMask,
          +match[1]
        )) {
          this.memory.set(memAdress, memValue);
        }
      } else {
        const memAdress = +match[1];
        const memValue = applyMask(this.currentMask, +value);
        this.memory.set(memAdress, memValue);
      }
    }
  }

  executeProgram(steps: string[]) {
    for (const step of steps) {
      this.executeStep(step);
    }
  }

  getSumOfMemory() {
    let sum = 0;
    this.memory.forEach((memValue) => (sum += memValue));
    return sum;
  }
}

export function solution1() {
  const program = getInputArray({ day: 14, year: 2020, separator: "\n" });
  const initComputer = new InitComputer();
  initComputer.executeProgram(program);
  return initComputer.getSumOfMemory();
}
export function solution2() {
  const program = getInputArray({ day: 14, year: 2020, separator: "\n" });
  const initComputer = new InitComputer();
  initComputer.isFloatingMode = true;
  initComputer.executeProgram(program);
  return initComputer.getSumOfMemory();
}
