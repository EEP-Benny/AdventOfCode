import {
  countDifferences,
  countPossibleArrangements,
  getJoltageDifferences,
} from "./10";

const someJoltages = [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4];
const moreJoltages = [28, 33, 18, 42, 31, 14, 46, 20, 48, 47].concat(
  [24, 23, 49, 45, 19, 38, 39, 11, 1, 32],
  [25, 35, 8, 17, 7, 9, 4, 2, 34, 10, 3]
);

test("getJoltageDifferences", () => {
  const expectedDifferences = [1, 3, 1, 1, 1, 3, 1, 1, 3, 1, 3, 3];
  expect(getJoltageDifferences(someJoltages)).toEqual(expectedDifferences);
});
test("countDifferences for someJoltages", () => {
  const differences = getJoltageDifferences(someJoltages);
  const diffMap = countDifferences(differences);

  expect(diffMap.get(1)).toEqual(7);
  expect(diffMap.get(3)).toEqual(5);
});
test("countDifferences for moreJoltages", () => {
  const differences = getJoltageDifferences(moreJoltages);
  const diffMap = countDifferences(differences);

  expect(diffMap.get(1)).toEqual(22);
  expect(diffMap.get(3)).toEqual(10);
});

test("countPossibleArrangements for someJoltages", () => {
  const differences = getJoltageDifferences(someJoltages);
  expect(countPossibleArrangements(differences)).toEqual(8);
});
test("countPossibleArrangements for moreJoltages", () => {
  const differences = getJoltageDifferences(moreJoltages);
  expect(countPossibleArrangements(differences)).toEqual(19208);
});
