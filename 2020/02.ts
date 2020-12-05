import { getInputArray } from "../utils";

function getPolicy(str: string) {
  const [policy, password] = str.split(": ");
  const [_, min, max, char] = policy.match(/(\d*)-(\d*) (\w)/);
  return [+min, +max, char, password] as const;
}
export function isValidPasswordWithCounting(str: string) {
  const [min, max, char, password] = getPolicy(str);
  const count = password.split(char).length - 1;
  return count >= min && count <= max;
}

export function isValidPasswordWithPosition(str: string) {
  const [pos1, pos2, char, password] = getPolicy(str);
  const char1 = password.charAt(pos1 - 1); // pos1 uses 1-indexing, charAt expects 0-indexing
  const char2 = password.charAt(pos2 - 1);
  return (char1 === char) !== (char2 === char); // !== acts as XOR
}

export function solution1() {
  const strings = getInputArray({ day: 2, year: 2020, separator: "\n" });
  return strings.filter(isValidPasswordWithCounting).length;
}

export function solution2() {
  const strings = getInputArray({ day: 2, year: 2020, separator: "\n" });
  return strings.filter(isValidPasswordWithPosition).length;
}
