import { applyFloatingMask, applyMask, InitComputer } from "./14";

test("applyMask", () => {
  expect(applyMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X", 11)).toBe(73);
  expect(applyMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X", 101)).toBe(101);
  expect(applyMask("XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X", 0)).toBe(64);
});

test("applyFloatingMask", () => {
  expect(
    applyFloatingMask("000000000000000000000000000000X1001X", 42)
  ).toEqual([26, 27, 58, 59]);
  expect(
    applyFloatingMask("00000000000000000000000000000000X0XX", 26)
  ).toEqual([16, 17, 18, 19, 24, 25, 26, 27]);
});

test("InitComputer", () => {
  const program = [
    "mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X",
    "mem[8] = 11",
    "mem[7] = 101",
    "mem[8] = 0",
  ];

  const initComputer = new InitComputer();
  initComputer.executeProgram(program);
  expect(initComputer.getSumOfMemory()).toBe(165);
});

test("FloatingInitComputer", () => {
  const program = [
    "mask = 000000000000000000000000000000X1001X",
    "mem[42] = 100",
    "mask = 00000000000000000000000000000000X0XX",
    "mem[26] = 1",
  ];
  const initComputer = new InitComputer();
  initComputer.isFloatingMode = true;
  initComputer.executeProgram(program);
  expect(initComputer.getSumOfMemory()).toBe(208);
});
