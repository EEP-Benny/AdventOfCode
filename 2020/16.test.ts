import {
  getFieldNameOrder,
  parseInput,
  parseRule,
  ruleMatchesAllTicketsAtIndex,
  sumOfInvalidValues,
  valueMatchesAnyRule,
  valueMatchesRule,
} from "./16";

const exampleInput1 = `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
`;
const parsedExampleInput1 = parseInput(exampleInput1);

const exampleInput2 = `
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9
`;
const parsedExampleInput2 = parseInput(exampleInput2);

test("parseInput", () => {
  expect(parsedExampleInput1).toEqual({
    rules: [
      { name: "class", min1: 1, max1: 3, min2: 5, max2: 7 },
      { name: "row", min1: 6, max1: 11, min2: 33, max2: 44 },
      { name: "seat", min1: 13, max1: 40, min2: 45, max2: 50 },
    ],
    yourTicket: [7, 1, 14],
    nearbyTickets: [
      [7, 3, 47],
      [40, 4, 50],
      [55, 2, 20],
      [38, 6, 12],
    ],
  });
});

test("valueMatchesRule", () => {
  expect(valueMatchesRule(3, parsedExampleInput1.rules[0])).toBe(true);
  expect(valueMatchesRule(4, parsedExampleInput1.rules[0])).toBe(false);
  expect(valueMatchesRule(5, parsedExampleInput1.rules[0])).toBe(true);
});

test("valueMatchesAnyRule", () => {
  expect(valueMatchesAnyRule(3, parsedExampleInput1.rules)).toBe(true);
  expect(valueMatchesAnyRule(4, parsedExampleInput1.rules)).toBe(false);
  expect(valueMatchesAnyRule(47, parsedExampleInput1.rules)).toBe(true);
  expect(valueMatchesAnyRule(55, parsedExampleInput1.rules)).toBe(false);
});

test("sumOfInvalidValues", () => {
  expect(
    sumOfInvalidValues(
      parsedExampleInput1.rules,
      [].concat(...parsedExampleInput1.nearbyTickets)
    )
  ).toBe(71);
});

test("ruleMatchesAllTicketsAtIndex", () => {
  const tickets = [
    [3, 9, 18],
    [15, 1, 5],
    [5, 14, 9],
  ];
  expect(
    ruleMatchesAllTicketsAtIndex(parseRule("class: 0-1 or 4-19"), tickets, 0)
  ).toBe(false);
  expect(
    ruleMatchesAllTicketsAtIndex(parseRule("class: 0-1 or 4-19"), tickets, 1)
  ).toBe(true);
  expect(
    ruleMatchesAllTicketsAtIndex(parseRule("row: 0-5 or 8-19"), tickets, 0)
  ).toBe(true);
});

test("getFieldNameOrder", () => {
  expect(
    getFieldNameOrder(
      parsedExampleInput2.rules,
      parsedExampleInput2.nearbyTickets
    )
  ).toEqual(["row", "class", "seat"]);
});
