import { findSumOfThree, findSumOfTwo } from "./01";

test("findSumOfTwo", () => {
  expect(findSumOfTwo([1721, 979, 366, 299, 675, 1456])).toEqual([299, 1721]);
});

test("findSumOfThree", () => {
  expect(findSumOfThree([1721, 979, 366, 299, 675, 1456])).toEqual([
    979,
    366,
    675,
  ]);
});
