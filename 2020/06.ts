import { getInput } from "../utils";

const allLetters = "abcdefghijklmnopqrstuvwxyz".split("");

export function countAnswersOfAnyone(strForGroup: string) {
  let count = 0;
  for (const letter of allLetters) {
    if (strForGroup.indexOf(letter) > -1) {
      count++;
    }
  }
  return count;
}
function everyoneHasAnsweredYes(strForGroup: string, letter: string) {
  for (const line of strForGroup.trim().split("\n")) {
    if (line.indexOf(letter) === -1) {
      return false;
    }
  }
  return true;
}
export function countAnswersOfEveryone(strForGroup: string) {
  let count = 0;
  for (const letter of allLetters) {
    if (everyoneHasAnsweredYes(strForGroup, letter)) {
      count++;
    }
  }
  return count;
}

function countAnswers(strForAllGroups: string, fn: (str: string) => number) {
  let count = 0;
  for (const strForGroup of strForAllGroups.split("\n\n")) {
    count += fn(strForGroup);
  }
  return count;
}
export function countAnswersOfAnyoneOfAllGroups(input) {
  return countAnswers(input, countAnswersOfAnyone);
}
export function countAnswersOfEveryoneOfAllGroups(input) {
  return countAnswers(input, countAnswersOfEveryone);
}

export function solution1() {
  const input = getInput(6, 2020);
  return countAnswersOfAnyoneOfAllGroups(input);
}
export function solution2() {
  const input = getInput(6, 2020);
  return countAnswersOfEveryoneOfAllGroups(input);
}
