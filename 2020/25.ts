import { getInputArray } from "../utils";

export function findLoopSize(publicKeys: number[]) {
  const subjectNumber = 7;
  let value = 1;
  let loopSize = 0;
  let foundLoopSizeForIndex = -1;
  while ((foundLoopSizeForIndex = publicKeys.indexOf(value)) === -1) {
    loopSize++;
    value = (value * subjectNumber) % 20201227;
  }
  return [loopSize, foundLoopSizeForIndex];
}

export function findEncryptionKey(publicKeys: number[]) {
  const [loopSize, loopSizeForIndex] = findLoopSize(publicKeys);
  const subjectNumber = publicKeys[1 - loopSizeForIndex]; // the other key
  let value = 1;
  for (let i = 0; i < loopSize; i++) {
    value = (value * subjectNumber) % 20201227;
  }
  return value;
}

export function solution1() {
  const publicKeys = getInputArray({
    day: 25,
    year: 2020,
    separator: "\n",
  }).map((v) => +v);
  return findEncryptionKey(publicKeys);
}
