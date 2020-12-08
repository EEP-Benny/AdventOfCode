import { getInputArray } from "../utils";

type Operation = "acc" | "jmp" | "nop";
type Argument = number;
export type Instruction = [Operation, Argument];

export function parseInstruction(line: string): Instruction {
  const [operation, argument] = line.split(" ");
  return [operation as Operation, parseInt(argument)];
}

export function runProgramUntilLoopOrEnd(program: Instruction[]) {
  let accumulator = 0;
  let currentInstruction = 0;
  const visitedInstructions = new Set<number>();
  let hasTerminated;
  while (
    !visitedInstructions.has(currentInstruction) &&
    !(hasTerminated = currentInstruction >= program.length)
  ) {
    visitedInstructions.add(currentInstruction);
    const [operation, argument] = program[currentInstruction];
    switch (operation) {
      case "acc":
        accumulator += argument;
        currentInstruction++;
        break;
      case "jmp":
        currentInstruction += argument;
        break;
      case "nop":
        currentInstruction++;
        break;
    }
  }
  return [accumulator, hasTerminated];
}

export function swapJmpOrNop([operation, argument]: Instruction): Instruction {
  switch (operation) {
    case "jmp":
      return ["nop", argument];
    case "nop":
      return ["jmp", argument];
    default:
      return [operation, argument];
  }
}

export function solution1() {
  const program = getInputArray({ day: 8, year: 2020, separator: "\n" }).map(
    parseInstruction
  );
  const [accumulator] = runProgramUntilLoopOrEnd(program);
  return accumulator;
}

export function solution2() {
  const program = getInputArray({ day: 8, year: 2020, separator: "\n" }).map(
    parseInstruction
  );
  for (let i = 0; i < program.length; i++) {
    program[i] = swapJmpOrNop(program[i]);
    const [acc, hasTerminated] = runProgramUntilLoopOrEnd(program);
    if (hasTerminated) {
      return acc;
    }
    program[i] = swapJmpOrNop(program[i]); // swap back
  }
}
