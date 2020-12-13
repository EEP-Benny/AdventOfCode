import {
  chineseRemainder,
  findEarliestConsecutiveDepartures,
  findNextDeparture,
  findNextDepartureOfLine,
  getCommonMultiple,
  getMultiplicativeInverse,
  parseLineNumbers,
} from "./13";

test("parseLineNumbers", () => {
  expect(parseLineNumbers("7,13,x,x,59,x,31,19")).toEqual([7, 13, 59, 31, 19]);
});

test("findNextDepartureOfLine", () => {
  expect(findNextDepartureOfLine(929, 7)).toBe(931);
  expect(findNextDepartureOfLine(933, 7)).toBe(938);
  expect(findNextDepartureOfLine(930, 13)).toBe(936);
  expect(findNextDepartureOfLine(930, 59)).toBe(944);
  expect(findNextDepartureOfLine(929, 31)).toBe(930);
  expect(findNextDepartureOfLine(929, 19)).toBe(931);
});

test("findNextDeparture", () => {
  expect(findNextDeparture(939, [7, 13, 59, 31, 19])).toEqual([59, 5]);
});

test("getCommonMultiple", () => {
  expect(getCommonMultiple([1, 2, 3].map(BigInt))).toBe(BigInt(6));
  expect(getCommonMultiple([67, 7, 59, 61].map(BigInt))).toBe(BigInt(1687931));
});

test("getMultiplicativeInverse", () => {
  expect(getMultiplicativeInverse(BigInt(1), BigInt(7))).toBe(BigInt(1));
  expect(getMultiplicativeInverse(BigInt(2), BigInt(7))).toBe(BigInt(4));
});

test("chineseRemainder", () => {
  expect(chineseRemainder([3, 5, 7].map(BigInt), [2, 3, 2].map(BigInt))).toBe(
    BigInt(23)
  );
  expect(
    chineseRemainder([17, 13, 19].map(BigInt), [0, -2, -3].map(BigInt))
  ).toBe(BigInt(3417));
});

test("findEarliestConsecutiveDepartures", () => {
  expect(findEarliestConsecutiveDepartures("17,x,13,19")).toBe(BigInt(3417));
  expect(findEarliestConsecutiveDepartures("7,13,x,x,59,x,31,19")).toBe(
    BigInt(1068781)
  );
  expect(findEarliestConsecutiveDepartures("67,7,59,61")).toBe(BigInt(754018));
  expect(findEarliestConsecutiveDepartures("67,x,7,59,61")).toBe(
    BigInt(779210)
  );
  expect(findEarliestConsecutiveDepartures("67,7,x,59,61")).toBe(
    BigInt(1261476)
  );
  expect(findEarliestConsecutiveDepartures("1789,37,47,1889")).toBe(
    BigInt(1202161486)
  );
});
