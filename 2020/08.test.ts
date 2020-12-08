import { parseInstruction, runProgramUntilLoopOrEnd, swapJmpOrNop } from "./08";

test("parseInstruction", () => {
  expect(parseInstruction("nop +0")).toEqual(["nop", 0]);
  expect(parseInstruction("acc +1")).toEqual(["acc", 1]);
  expect(parseInstruction("jmp +4")).toEqual(["jmp", 4]);
  expect(parseInstruction("acc -99")).toEqual(["acc", -99]);
});

const simpleProgram = [
  "nop +0",
  "acc +1",
  "jmp +4",
  "acc +3",
  "jmp -3",
  "acc -99",
  "acc +1",
  "jmp -4",
  "acc +6",
].map(parseInstruction);
const simpleTerminatingProgram = [
  "nop +0",
  "acc +1",
  "jmp +4",
  "acc +3",
  "jmp -3",
  "acc -99",
  "acc +1",
  "nop -4",
  "acc +6",
].map(parseInstruction);

test("runProgramUntilLoopOrEnd", () => {
  expect(runProgramUntilLoopOrEnd(simpleProgram)).toEqual([5, false]);
  expect(runProgramUntilLoopOrEnd(simpleTerminatingProgram)).toEqual([8, true]);
});

test("swapJmpOrNop", () => {
  expect(swapJmpOrNop(["acc", 5])).toEqual(["acc", 5]);
  expect(swapJmpOrNop(["nop", 6])).toEqual(["jmp", 6]);
  expect(swapJmpOrNop(["jmp", 7])).toEqual(["nop", 7]);
});
