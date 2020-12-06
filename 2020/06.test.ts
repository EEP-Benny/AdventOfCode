import {
  countAnswersOfAnyoneOfAllGroups,
  countAnswersOfAnyone,
  countAnswersOfEveryoneOfAllGroups,
  countAnswersOfEveryone,
} from "./06";

test("countAnswersOfAnyone", () => {
  expect(countAnswersOfAnyone("abc")).toBe(3);
  expect(countAnswersOfAnyone("a\nb\nc")).toBe(3);
  expect(countAnswersOfAnyone("ab\nac")).toBe(3);
  expect(countAnswersOfAnyone("a\na\na\na")).toBe(1);
  expect(countAnswersOfAnyone("b")).toBe(1);
});
test("countAnswersOfEveryone", () => {
  expect(countAnswersOfEveryone("abc")).toBe(3);
  expect(countAnswersOfEveryone("a\nb\nc")).toBe(0);
  expect(countAnswersOfEveryone("ab\nac")).toBe(1);
  expect(countAnswersOfEveryone("a\na\na\na")).toBe(1);
  expect(countAnswersOfEveryone("b")).toBe(1);
});

const strForAllGroups = `abc

a
b
c

ab
ac

a
a
a
a

b`;
test("countAnswersOfAnyoneOfAllGroups", () => {
  expect(countAnswersOfAnyoneOfAllGroups(strForAllGroups)).toBe(11);
});
test("countAnswersOfEveryoneOfAllGroups", () => {
  expect(countAnswersOfEveryoneOfAllGroups(strForAllGroups)).toBe(6);
});
