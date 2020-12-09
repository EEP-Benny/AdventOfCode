import {
  findContiguousRangeThatSumsTo,
  findNumberThatIsNotASum,
  isSumOfNumbers,
} from "./09";

test("isSumOfNumbers", () => {
  const numbers1To25 = Array.from({ length: 25 }).map((_, i) => i + 1);
  expect(isSumOfNumbers(26, numbers1To25)).toBe(true);
  expect(isSumOfNumbers(49, numbers1To25)).toBe(true);
  expect(isSumOfNumbers(100, numbers1To25)).toBe(false);
  expect(isSumOfNumbers(50, numbers1To25)).toBe(false);
});

const numbers5 = [35, 20, 15, 25, 47].concat(
  [40, 62, 55, 65, 95],
  [102, 117, 150, 182, 127],
  [219, 299, 277, 309, 576]
);

test("findNumberThatIsNotASum", () => {
  expect(findNumberThatIsNotASum(numbers5, 5)).toBe(127);
});

test("findContiguousRangeThatSumsTo", () => {
  expect(findContiguousRangeThatSumsTo(127, numbers5)).toEqual([
    15,
    25,
    47,
    40,
  ]);
});
